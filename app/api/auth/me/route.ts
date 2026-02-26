import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return apiError('Unauthorized', 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return apiError('Invalid token', 401)
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return apiError('Failed to fetch profile', 500)
    }

    return apiResponse({
      user: {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        role: profile.role,
        avatar_url: profile.avatar_url,
        company_name: profile.company_name,
        is_verified: profile.is_verified,
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to get user', 500)
  }
}

// PUT /api/auth/me - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return apiError('Unauthorized', 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return apiError('Invalid token', 401)
    }

    const body = await request.json()

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        avatar_url: body.avatar_url,
        company_name: body.company_name,
        bio: body.bio,
        address: body.address,
        city: body.city,
        country: body.country,
        social_links: body.social_links,
        notification_preferences: body.notification_preferences,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(data, 200, 'Profile updated successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to update profile', 500)
  }
}
