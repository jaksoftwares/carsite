import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/vehicles - List all vehicles with admin filters (includes all statuses)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Admin-specific filters
    const status = searchParams.get('status')
    const condition = searchParams.get('condition')
    const make = searchParams.get('make')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    let query = supabase
      .from('vehicles')
      .select(`
        *,
        make:makes(id, name, slug),
        model:models(id, name, slug),
        body_type:body_types(id, name),
        fuel_type:fuel_types(id, name),
        transmission:transmissions(id, name),
        images:vehicle_images(*)
      `, { count: 'exact' })

    // Apply admin filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (condition && condition !== 'all') {
      query = query.eq('condition', condition)
    }

    if (make && make !== 'all') {
      query = query.eq('make_id', make)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,vin.ilike.%${search}%,registration_number.ilike.%${search}%`)
    }

    query = query.order(sortBy === 'price' ? 'price' : sortBy === 'year' ? 'year' : 'created_at', { ascending: sortOrder === 'asc' })
    query = query.range(offset, offset + limit - 1)

    const { data: vehicles, error, count } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // Transform data
    const transformedVehicles = vehicles?.map(vehicle => ({
      ...vehicle,
      primary_image: (vehicle.images?.find((img: any) => img.is_primary) || vehicle.images?.[0])?.url || null,
      images: undefined,
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

// POST /api/admin/vehicles - Bulk operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, vehicleIds, data } = body

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return apiError('Vehicle IDs are required', 400)
    }

    switch (action) {
      case 'delete':
        // Delete vehicles and their related data
        const { error: deleteError } = await supabase
          .from('vehicles')
          .delete()
          .in('id', vehicleIds)

        if (deleteError) {
          return apiError(deleteError.message, 400)
        }
        return apiSuccess(`${vehicleIds.length} vehicle(s) deleted successfully`)

      case 'publish':
        const { error: publishError } = await supabase
          .from('vehicles')
          .update({ 
            status: 'active',
            published_at: new Date().toISOString()
          })
          .in('id', vehicleIds)

        if (publishError) {
          return apiError(publishError.message, 400)
        }
        return apiSuccess(`${vehicleIds.length} vehicle(s) published successfully`)

      case 'unpublish':
        const { error: unpublishError } = await supabase
          .from('vehicles')
          .update({ status: 'draft' })
          .in('id', vehicleIds)

        if (unpublishError) {
          return apiError(unpublishError.message, 400)
        }
        return apiSuccess(`${vehicleIds.length} vehicle(s) unpublished successfully`)

      case 'mark_sold':
        const { error: soldError } = await supabase
          .from('vehicles')
          .update({ status: 'sold' })
          .in('id', vehicleIds)

        if (soldError) {
          return apiError(soldError.message, 400)
        }
        return apiSuccess(`${vehicleIds.length} vehicle(s) marked as sold`)

      case 'feature':
        const { error: featureError } = await supabase
          .from('vehicles')
          .update({ is_featured: true })
          .in('id', vehicleIds)

        if (featureError) {
          return apiError(featureError.message, 400)
        }
        return apiSuccess(`${vehicleIds.length} vehicle(s) marked as featured`)

      case 'unfeature':
        const { error: unfeatureError } = await supabase
          .from('vehicles')
          .update({ is_featured: false })
          .in('id', vehicleIds)

        if (unfeatureError) {
          return apiError(unfeatureError.message, 400)
        }
        return apiSuccess(`${vehicleIds.length} vehicle(s) removed from featured`)

      default:
        return apiError('Invalid action', 400)
    }
  } catch (error: any) {
    return apiError(error.message || 'Failed to perform bulk operation', 500)
  }
}
