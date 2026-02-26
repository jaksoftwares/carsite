import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/makes - List car makes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'

    let query = supabase
      .from('makes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (featured) {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // Get vehicle count for each make
    const makesWithCount = await Promise.all(
      (data || []).map(async (make: any) => {
        const { count } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('make_id', make.id)
          .eq('status', 'active')
        
        return {
          ...make,
          vehicle_count: count || 0
        }
      })
    )

    return apiResponse(makesWithCount)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch makes', 500)
  }
}

// POST /api/makes - Create make (admin)
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

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return apiError('Forbidden - Admin access required', 403)
    }

    const body = await request.json()
    const { name, logo_url, country_of_origin, description, is_featured, display_order } = body

    if (!name) {
      return apiError('Name is required', 400)
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('makes')
      .insert({
        name,
        slug,
        logo_url,
        country_of_origin,
        description,
        is_featured: is_featured || false,
        display_order: display_order || 0,
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
