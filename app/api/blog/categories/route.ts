import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/blog/categories - List blog categories
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      return apiError(error.message, 400)
    }

    // Get post count for each category
    const categoriesWithCount = await Promise.all(
      (data || []).map(async (category) => {
        const { count } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published')
        
        return {
          ...category,
          post_count: count || 0
        }
      })
    )

    return apiResponse(categoriesWithCount)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch categories', 500)
  }
}

// POST /api/blog/categories - Create category (admin)
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
    const { name, description, parent_id, display_order } = body

    if (!name) {
      return apiError('Name is required', 400)
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('blog_categories')
      .insert({
        name,
        slug,
        description,
        parent_id,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Category created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create category', 500)
  }
}
