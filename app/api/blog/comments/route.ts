import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/blog/comments - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')
    const approved = searchParams.get('approved') !== 'false'

    if (!postId) {
      return apiError('Post ID is required', 400)
    }

    let query = supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (approved) {
      query = query.eq('is_approved', true)
    }

    const { data, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch comments', 500)
  }
}

// POST /api/blog/comments - Add comment to post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, name, email, content, parent_id } = body

    if (!post_id || !name || !email || !content) {
      return apiError('Post ID, name, email and content are required', 400)
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

    // Verify post exists
    const { data: post } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', post_id)
      .single()

    if (!post) {
      return apiError('Post not found', 404)
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        post_id,
        user_id,
        parent_id,
        name,
        email,
        content,
        is_approved: true, // Auto-approve for now
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Comment added successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to add comment', 500)
  }
}
