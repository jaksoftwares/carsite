import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/search - Search vehicles with full-text search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    if (!query || query.length < 2) {
      return apiError('Search query must be at least 2 characters', 400)
    }

    // Full-text search on vehicles using ilike for compatibility
    const { data: vehicles, error, count } = await supabase
      .from('vehicles')
      .select(`
        id, title, slug, year, price, mileage, condition, location, city,
        make:makes(id, name, slug),
        model:models(id, name, slug),
        body_type:body_types(id, name),
        images:vehicle_images(url, is_primary)
      `, { count: 'exact' })
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return apiError(error.message, 400)
    }

    // Also search makes and models for suggestions
    const { data: makes } = await supabase
      .from('makes')
      .select('id, name, slug')
      .ilike('name', `%${query}%`)
      .limit(5)

    const { data: models } = await supabase
      .from('models')
      .select('id, name, slug, make:makes(id, name, slug)')
      .ilike('name', `%${query}%`)
      .limit(5)

    // Save search history (non-blocking - fire and forget)
    const sessionId = request.headers.get('x-session-id') || undefined
    if (sessionId && count !== null) {
      supabase.from('search_history').insert({
        session_id: sessionId,
        search_query: query,
        results_count: count,
      })
    }

    const transformedVehicles = vehicles?.map(vehicle => ({
      ...vehicle,
      primary_image: vehicle.images?.find((img: any) => img.is_primary) || vehicle.images?.[0] || null,
      images: undefined,
    })) || []

    return apiResponse({
      vehicles: transformedVehicles,
      suggestions: {
        makes: makes || [],
        models: models || [],
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Search failed', 500)
  }
}
