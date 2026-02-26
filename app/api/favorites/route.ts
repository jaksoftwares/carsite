import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
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

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        vehicle:vehicles(
          id, title, slug, year, price, mileage, condition, location, city,
          make:makes(id, name, slug),
          model:models(id, name, slug),
          images:vehicle_images(url, is_primary)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return apiError(error.message, 400)
    }

    // Transform data
    const transformedFavorites = favorites?.map((fav: any) => {
      const vehicle = fav.vehicle?.[0] || fav.vehicle
      return {
        id: fav.id,
        added_at: fav.created_at,
        vehicle: vehicle ? {
          ...vehicle,
          primary_image: vehicle.images?.find((img: any) => img.is_primary) || vehicle.images?.[0] || null,
        } : null
      }
    }) || []

    return apiResponse(transformedFavorites)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch favorites', 500)
  }
}

// POST /api/favorites - Add vehicle to favorites
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

    const body = await request.json()
    const { vehicle_id } = body

    if (!vehicle_id) {
      return apiError('Vehicle ID is required', 400)
    }

    // Check if vehicle exists
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', vehicle_id)
      .single()

    if (!vehicle) {
      return apiError('Vehicle not found', 404)
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('vehicle_id', vehicle_id)
      .single()

    if (existing) {
      return apiError('Vehicle already in favorites', 400)
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        vehicle_id,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Added to favorites', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to add favorite', 500)
  }
}

// DELETE /api/favorites - Remove vehicle from favorites
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicle_id')
    const favoriteId = searchParams.get('id')

    if (!vehicleId && !favoriteId) {
      return apiError('Vehicle ID or Favorite ID is required', 400)
    }

    let query = supabase.from('favorites').delete().eq('user_id', user.id)
    
    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId)
    } else if (favoriteId) {
      query = query.eq('id', favoriteId)
    }

    const { error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Removed from favorites')
  } catch (error: any) {
    return apiError(error.message || 'Failed to remove favorite', 500)
  }
}
