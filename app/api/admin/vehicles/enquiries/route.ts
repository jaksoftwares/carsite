import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/vehicles/enquiries - Get enquiries for a specific vehicle
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicle_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('enquiries')
      .select(`
        *,
        vehicle:vehicles(id, title, slug, primary_image)
      `, { count: 'exact' })

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId)
    }

    query = query.order('created_at', { ascending: false })
    query = query.range(offset, offset + limit - 1)

    const { data: enquiries, error, count } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse({
      enquiries,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch enquiries', 500)
  }
}

// PATCH /api/admin/vehicles/enquiries - Update enquiry status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiry_ids, status, notes } = body

    if (!enquiry_ids || !Array.isArray(enquiry_ids) || enquiry_ids.length === 0) {
      return apiError('Enquiry IDs are required', 400)
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (notes) updateData.notes = notes
    
    if (status === 'completed') {
      updateData.resolved_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('enquiries')
      .update(updateData)
      .in('id', enquiry_ids)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess(`Enquiry(s) updated successfully`)
  } catch (error: any) {
    return apiError(error.message || 'Failed to update enquiry', 500)
  }
}

// DELETE /api/admin/vehicles/enquiries - Delete enquiry(s)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enquiryId = searchParams.get('id')

    if (!enquiryId) {
      return apiError('Enquiry ID is required', 400)
    }

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', enquiryId)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Enquiry deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete enquiry', 500)
  }
}
