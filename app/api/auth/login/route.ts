import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return apiError('Email and password are required', 400)
    }

    // Sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return apiError(authError.message, 401)
    }

    if (!authData.user) {
      return apiError('Invalid credentials', 401)
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      return apiError('Failed to fetch user profile', 500)
    }

    // Create session token (JWT)
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: authData.session!.access_token,
      refresh_token: authData.session!.refresh_token,
    })

    return apiSuccess('Login successful', {
      user: {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      },
      session: {
        access_token: authData.session!.access_token,
        refresh_token: authData.session!.refresh_token,
        expires_at: authData.session!.expires_at,
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Login failed', 500)
  }
}
