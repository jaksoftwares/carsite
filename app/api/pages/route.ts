import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/pages - List pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // Public access - only published pages
    let query = supabase
      .from('pages')
      .select('id, title, slug, excerpt, meta_title, meta_description, template, display_order')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (slug) {
      query = query.eq('slug', slug).limit(1)
    }

    const { data, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // If single slug, get full content
    if (slug && data && data.length > 0) {
      const { data: fullPage } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single()

      return apiResponse(fullPage)
    }

    return apiResponse(data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch pages', 500)
  }
}

// POST /api/pages - Create page (admin)
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
    const { title, slug, content, meta_title, meta_description, featured_image_url, template, is_published, display_order } = body

    if (!title) {
      return apiError('Title is required', 400)
    }

    // Generate slug if not provided
    const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('pages')
      .insert({
        title,
        slug: pageSlug,
        content,
        meta_title,
        meta_description,
        featured_image_url,
        template: template || 'default',
        is_published: is_published || false,
        display_order: display_order || 0,
        created_by: user.id,
        published_at: is_published ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Page created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create page', 500)
  }
}

// PUT /api/pages - Update page (admin)
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
    const { id, title, slug, content, meta_title, meta_description, featured_image_url, template, is_published, display_order } = body

    if (!id) {
      return apiError('Page ID is required', 400)
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (slug) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (meta_title !== undefined) updateData.meta_title = meta_title
    if (meta_description !== undefined) updateData.meta_description = meta_description
    if (featured_image_url !== undefined) updateData.featured_image_url = featured_image_url
    if (template) updateData.template = template
    if (is_published !== undefined) {
      updateData.is_published = is_published
      if (is_published) {
        updateData.published_at = new Date().toISOString()
      }
    }
    if (display_order !== undefined) updateData.display_order = display_order

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Page updated successfully', data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to update page', 500)
  }
}

// DELETE /api/pages - Delete page (admin)
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return apiError('Page ID is required', 400)
    }

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Page deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete page', 500)
  }
}
