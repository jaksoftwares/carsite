import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const category = searchParams.get('category')
    const publicOnly = searchParams.get('public') !== 'false'

    let query = supabase
      .from('site_settings')
      .select('*')

    if (key) {
      query = query.eq('key', key)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (publicOnly) {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // If single key, return value directly
    if (key && data && data.length > 0) {
      const setting = data[0]
      return apiResponse({
        key: setting.key,
        value: setting.value,
        value_type: setting.value_type,
      })
    }

    // Group by category
    const settingsByCategory: Record<string, any> = {}
    data?.forEach(setting => {
      if (!settingsByCategory[setting.category]) {
        settingsByCategory[setting.category] = {}
      }
      settingsByCategory[setting.category][setting.key] = {
        value: setting.value,
        value_type: setting.value_type,
      }
    })

    return apiResponse({
      settings: data,
      by_category: settingsByCategory,
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch settings', 500)
  }
}

// PUT /api/settings - Update site setting (admin)
export async function PUT(request: NextRequest) {
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
    const { key, value, description, is_public } = body

    if (!key) {
      return apiError('Key is required', 400)
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update({ value, description, is_public })
      .eq('key', key)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Setting updated successfully', data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to update setting', 500)
  }
}

// POST /api/settings - Create site setting (admin)
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
    const { key, value, value_type, description, category, is_public } = body

    if (!key || value === undefined) {
      return apiError('Key and value are required', 400)
    }

    const { data, error } = await supabase
      .from('site_settings')
      .insert({
        key,
        value,
        value_type: value_type || 'string',
        description,
        category: category || 'general',
        is_public: is_public ?? true,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Setting created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create setting', 500)
  }
}
