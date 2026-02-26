import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess, isValidEmail } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, department } = body

    if (!name || !email || !message) {
      return apiError('Name, email and message are required', 400)
    }

    if (!isValidEmail(email)) {
      return apiError('Invalid email format', 400)
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        subject,
        message,
        department,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    // TODO: Send notification email to admin

    return apiSuccess('Message sent successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to send message', 500)
  }
}

// GET /api/contact - Get contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const isRead = searchParams.get('is_read')

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

    // Build query
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (isRead !== null) {
      query = query.eq('is_read', isRead === 'true')
    }

    const { data: messages, error, count } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse({
      messages,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch messages', 500)
  }
}
