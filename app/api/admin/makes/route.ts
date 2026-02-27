import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/makes - Get all makes with optional vehicle count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const withCount = searchParams.get('with_count') === 'true'
    const activeOnly = searchParams.get('active') !== 'false'

    let query = supabase
      .from('makes')
      .select('*')

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    query = query.order('display_order').order('name')

    const { data: makes, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // If withCount, get vehicle counts for each make
    if (withCount) {
      const { data: vehicleCounts } = await supabase
        .from('vehicles')
        .select('make_id')
        .eq('status', 'active')

      const counts = vehicleCounts?.reduce((acc: any, v) => {
        acc[v.make_id] = (acc[v.make_id] || 0) + 1
        return acc
      }, {}) || {}

      const makesWithCount = makes?.map(make => ({
        ...make,
        vehicle_count: counts[make.id] || 0
      })) || []

      return apiResponse(makesWithCount)
    }

    return apiResponse(makes)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch makes', 500)
  }
}

// POST /api/admin/makes - Create a new make
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, country_of_origin, description, logo_url } = body

    if (!name) {
      return apiError('Make name is required', 400)
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data, error } = await supabase
      .from('makes')
      .insert({
        name,
        slug,
        country_of_origin,
        description,
        logo_url
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Make created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create make', 500)
  }
}

// PUT /api/admin/makes - Update a make
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const makeId = searchParams.get('id')

    if (!makeId) {
      return apiError('Make ID is required', 400)
    }

    const body = await request.json()
    
    // Generate slug if name is being updated
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    const { data, error } = await supabase
      .from('makes')
      .update(body)
      .eq('id', makeId)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Make updated successfully', data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to update make', 500)
  }
}

// DELETE /api/admin/makes - Delete a make
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const makeId = searchParams.get('id')

    if (!makeId) {
      return apiError('Make ID is required', 400)
    }

    // Check if make has vehicles
    const { count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('make_id', makeId)

    if (count && count > 0) {
      return apiError(`Cannot delete make with ${count} associated vehicles`, 400)
    }

    const { error } = await supabase
      .from('makes')
      .delete()
      .eq('id', makeId)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Make deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete make', 500)
  }
}
