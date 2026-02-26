import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess, isValidEmail } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/auth/signup - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, first_name, last_name, phone, role } = body

    if (!email || !password) {
      return apiError('Email and password are required', 400)
    }

    if (!isValidEmail(email)) {
      return apiError('Invalid email format', 400)
    }

    if (password.length < 6) {
      return apiError('Password must be at least 6 characters', 400)
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return apiError('User with this email already exists', 400)
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
        },
      },
    })

    if (authError) {
      return apiError(authError.message, 400)
    }

    if (!authData.user) {
      return apiError('Failed to create user', 400)
    }

    // Create profile (trigger will handle this, but ensure it exists)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        first_name,
        last_name,
        phone,
        role: role || 'customer',
      })

    if (profileError) {
      // Log error but don't fail - trigger should handle it
      console.error('Profile creation error:', profileError)
    }

    return apiSuccess(
      'Registration successful. Please check your email to verify your account.',
      { user_id: authData.user.id },
      201
    )
  } catch (error: any) {
    return apiError(error.message || 'Registration failed', 500)
  }
}
