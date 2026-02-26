import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/vehicles/[slug] - Get single vehicle by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // First try to find by slug, then by id
    let { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        make:makes(*),
        model:models(*),
        body_type:body_types(*),
        fuel_type:fuel_types(*),
        transmission:transmissions(*),
        drive_type:drive_types(*),
        exterior_color:colors!exterior_color_id(*),
        interior_color:colors!interior_color_id(*),
        images:vehicle_images(*),
        features:vehicle_features(
          feature:features(*),
          value
        ),
        reviews:vehicle_reviews(
          rating,
          title,
          content,
          reviewer_name,
          created_at,
          is_approved
        )
      `)
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single()

    if (error || !vehicle) {
      return apiError('Vehicle not found', 404)
    }

    // Check if vehicle is active or user is authorized
    if (vehicle.status !== 'active') {
      // Check if user has admin rights - simplified check
      const authHeader = request.headers.get('authorization')
      if (!authHeader) {
        return apiError('Vehicle not found', 404)
      }
    }

    // Increment view count (non-blocking)
    await supabase
      .from('vehicles')
      .update({ view_count: (vehicle.view_count || 0) + 1 })
      .eq('id', vehicle.id)

    // Get seller info
    if (vehicle.created_by) {
      const { data: seller } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, email, company_name, avatar_url')
        .eq('id', vehicle.created_by)
        .single()
      
      vehicle.seller = seller
    }

    // Calculate average rating
    const approvedReviews = vehicle.reviews?.filter((r: any) => r.is_approved) || []
    const avgRating = approvedReviews.length > 0
      ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length
      : 0

    // Transform features
    vehicle.features = vehicle.features?.map((f: any) => ({
      name: f.feature?.name,
      category: f.feature?.category,
      value: f.value,
    })) || []

    // Transform reviews
    vehicle.reviews = approvedReviews.slice(0, 5) // Only show latest 5 reviews
    vehicle.rating = avgRating
    vehicle.review_count = approvedReviews.length

    // Get similar vehicles (same make, different id)
    const { data: similarVehicles } = await supabase
      .from('vehicles')
      .select(`
        id, title, slug, year, price, mileage, condition,
        make:makes(name, slug),
        images:vehicle_images(url, is_primary)
      `)
      .eq('make_id', vehicle.make_id)
      .neq('id', vehicle.id)
      .eq('status', 'active')
      .limit(4)

    vehicle.similar_vehicles = similarVehicles?.map((v: any) => ({
      ...v,
      primary_image: v.images?.find((img: any) => img.is_primary) || v.images?.[0] || null,
      images: undefined,
    })) || []

    return apiResponse(vehicle)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch vehicle', 500)
  }
}

// PUT /api/vehicles/[slug] - Update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return apiError('Unauthorized', 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return apiError('Unauthorized', 401)
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get existing vehicle
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('created_by, assigned_dealer_id')
      .eq('slug', slug)
      .single()

    if (!existingVehicle) {
      return apiError('Vehicle not found', 404)
    }

    // Check permissions
    const isOwner = existingVehicle.created_by === user.id
    const isAssignedDealer = existingVehicle.assigned_dealer_id === user.id
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    if (!isOwner && !isAssignedDealer && !isAdmin) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const body = await request.json()

    // Update slug if title changes
    if (body.title) {
      body.slug = body.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    }

    const { data, error } = await supabase
      .from('vehicles')
      .update(body)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(data, 200, 'Vehicle updated successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to update vehicle', 500)
  }
}

// DELETE /api/vehicles/[slug] - Delete vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return apiError('Unauthorized', 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return apiError('Unauthorized', 401)
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Get existing vehicle
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('created_by')
      .eq('slug', slug)
      .single()

    if (!existingVehicle) {
      return apiError('Vehicle not found', 404)
    }

    // Check permissions
    const isOwner = existingVehicle.created_by === user.id
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    if (!isOwner && !isAdmin) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('slug', slug)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(null, 200, 'Vehicle deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete vehicle', 500)
  }
}
