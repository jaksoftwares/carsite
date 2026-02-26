import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/blog - List blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'

    // Build query
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(name, slug),
        author:profiles(first_name, last_name, avatar_url)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category_id', category)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    const { data: posts, error, count } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse({
      posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch posts', 500)
  }
}

// POST /api/blog - Create blog post (admin)
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
    const { title, excerpt, content, featured_image_url, category_id, tags, status } = body

    if (!title || !content) {
      return apiError('Title and content are required', 400)
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now()

    // Set author and published_at if publishing
    const dataToInsert: any = {
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      category_id,
      author_id: user.id,
      tags: tags || [],
      status: status || 'draft',
    }

    if (status === 'published') {
      dataToInsert.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(dataToInsert)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Post created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create post', 500)
  }
}
