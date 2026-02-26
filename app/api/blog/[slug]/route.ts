import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/blog/[slug] - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug),
        author:profiles(id, first_name, last_name, avatar_url, bio)
      `)
      .eq('slug', slug)
      .single()

    if (error || !post) {
      return apiError('Post not found', 404)
    }

    // Only published posts are public
    if (post.status !== 'published') {
      return apiError('Post not found', 404)
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id)

    // Get comments
    const { data: comments } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', post.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    post.comments = comments || []

    // Get related posts (same category)
    const { data: relatedPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, published_at')
      .eq('category_id', post.category_id)
      .neq('id', post.id)
      .eq('status', 'published')
      .limit(3)

    post.related_posts = relatedPosts || []

    return apiResponse(post)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch post', 500)
  }
}

// PUT /api/blog/[slug] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
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

    // Get existing post
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('author_id')
      .eq('slug', slug)
      .single()

    if (!existingPost) {
      return apiError('Post not found', 404)
    }

    // Check permissions
    const isAuthor = existingPost.author_id === user.id
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    if (!isAuthor && !isAdmin) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const body = await request.json()
    const { title, excerpt, content, featured_image_url, category_id, tags, status } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content) updateData.content = content
    if (featured_image_url !== undefined) updateData.featured_image_url = featured_image_url
    if (category_id) updateData.category_id = category_id
    if (tags) updateData.tags = tags
    if (status) {
      updateData.status = status
      if (status === 'published') {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Post updated successfully', data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to update post', 500)
  }
}

// DELETE /api/blog/[slug] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
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

    // Get existing post
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('author_id')
      .eq('slug', slug)
      .single()

    if (!existingPost) {
      return apiError('Post not found', 404)
    }

    // Check permissions
    const isAuthor = existingPost.author_id === user.id
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    if (!isAuthor && !isAdmin) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Post deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete post', 500)
  }
}
