import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/enquiries - List enquiries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const status = searchParams.get('status')

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
      .select('role, id')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    // Build query
    let query = supabase
      .from('enquiries')
      .select(`
        *,
        vehicle:vehicles(id, title, slug, make:makes(name)),
        user:profiles(first_name, last_name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter based on role
    if (!isAdmin) {
      // Regular users can only see their own enquiries
      query = query.eq('user_id', user.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

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

// POST /api/enquiries - Create new enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicle_id, name, email, phone, subject, message, source } = body

    if (!name || !email || !message) {
      return apiError('Name, email and message are required', 400)
    }

    // Try to get user from auth if available
    let user_id = null
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        user_id = user.id
      }
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        vehicle_id,
        user_id,
        name,
        email,
        phone,
        subject,
        message,
        source: source || 'website',
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    // TODO: Send notification email to admin

    return apiSuccess('Enquiry submitted successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to submit enquiry', 500)
  }
}
