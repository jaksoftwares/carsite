import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/vehicles/images - Get images for a vehicle
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicle_id')

    if (!vehicleId) {
      return apiError('Vehicle ID is required', 400)
    }

    const { data, error } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('display_order', { ascending: true })

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch images', 500)
  }
}

// POST /api/vehicles/images - Add image to vehicle
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
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin', 'dealer'].includes(profile.role)) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const body = await request.json()
    const { vehicle_id, url, public_id, is_primary, display_order, caption } = body

    if (!vehicle_id || !url) {
      return apiError('Vehicle ID and URL are required', 400)
    }

    // If this is set as primary, unset other primary images
    if (is_primary) {
      await supabase
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', vehicle_id)
    }

    const { data, error } = await supabase
      .from('vehicle_images')
      .insert({
        vehicle_id,
        url,
        public_id,
        is_primary: is_primary || false,
        display_order: display_order || 0,
        caption,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Image added successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to add image', 500)
  }
}

// DELETE /api/vehicles/images - Delete image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')

    if (!imageId) {
      return apiError('Image ID is required', 400)
    }

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

    if (!profile || !['admin', 'super_admin', 'dealer'].includes(profile.role)) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const { error } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Image deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete image', 500)
  }
}
