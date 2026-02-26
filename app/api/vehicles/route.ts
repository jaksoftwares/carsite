import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess, buildVehicleFilterQuery } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/vehicles - List vehicles with filters, pagination, sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const sortColumn = sortBy === 'price' ? 'price' : sortBy === 'year' ? 'year' : sortBy === 'mileage' ? 'mileage' : 'created_at'

    // Filters
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const bodyType = searchParams.get('bodyType')
    const fuelType = searchParams.get('fuelType')
    const transmission = searchParams.get('transmission')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined
    const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined
    const minMileage = searchParams.get('minMileage') ? parseInt(searchParams.get('minMileage')!) : undefined
    const maxMileage = searchParams.get('maxMileage') ? parseInt(searchParams.get('maxMileage')!) : undefined
    const condition = searchParams.get('condition')
    const city = searchParams.get('city')
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const status = searchParams.get('status') || 'active'

    // Build query
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        make:makes(*),
        model:models(*),
        body_type:body_types(*),
        fuel_type:fuel_types(*),
        transmission:transmissions(*),
        images:vehicle_images(*)
      `, { count: 'exact' })

    // Apply filters
    query = buildVehicleFilterQuery(query, {
      make,
      model,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      condition,
      city,
      featured,
    })

    // Always filter by status for public requests
    if (status) {
      query = query.eq('status', status)
    }

    // Apply sorting
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: vehicles, error, count } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // Transform data to add primary image
    const transformedVehicles = vehicles?.map(vehicle => ({
      ...vehicle,
      primary_image: vehicle.images?.find((img: any) => img.is_primary) || vehicle.images?.[0] || null,
      images: undefined, // Remove full images array from main response
    })) || []

    return apiResponse({
      vehicles: transformedVehicles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch vehicles', 500)
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
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

    if (!profile || !['admin', 'super_admin', 'dealer'].includes(profile.role)) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const body = await request.json()
    
    // Generate slug
    const slug = `${body.title?.toLowerCase().replace(/\s+/g, '-') || 'vehicle'}-${Date.now()}`
    
    // Set created_by
    body.created_by = user.id
    body.slug = slug

    // If no status set, default to draft
    if (!body.status) {
      body.status = 'draft'
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert(body)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Vehicle created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create vehicle', 500)
  }
}
