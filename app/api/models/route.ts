import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/models - List car models
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const makeId = searchParams.get('make_id')

    let query = supabase
      .from('models')
      .select('*, make:makes(id, name, slug)')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (makeId) {
      query = query.eq('make_id', makeId)
    }

    const { data, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch models', 500)
  }
}

// POST /api/models - Create model (admin)
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
    const { make_id, name, year_from, year_to, body_type } = body

    if (!make_id || !name) {
      return apiError('Make ID and name are required', 400)
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('models')
      .insert({
        make_id,
        name,
        slug,
        year_from,
        year_to,
        body_type,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Model created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create model', 500)
  }
}
