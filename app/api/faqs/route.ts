import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/faqs - List FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('faqs')
      .select('*, category:faq_categories(name, slug)')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (category) {
      query = query.eq('category_id', category)
    }

    const { data, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // Group by category
    const faqsByCategory: Record<string, any[]> = {}
    data?.forEach(faq => {
      const catName = faq.category?.name || 'Uncategorized'
      if (!faqsByCategory[catName]) {
        faqsByCategory[catName] = []
      }
      faqsByCategory[catName].push(faq)
    })

    return apiResponse({
      faqs: data,
      by_category: faqsByCategory,
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch FAQs', 500)
  }
}

// POST /api/faqs - Create FAQ (admin)
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
    const { question, answer, category_id, display_order } = body

    if (!question || !answer) {
      return apiError('Question and answer are required', 400)
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question,
        answer,
        category_id,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('FAQ created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create FAQ', 500)
  }
}

// GET /api/faqs/categories - List FAQ categories
export async function GETFAQCATEGORIES() {
  try {
    const { data, error } = await supabase
      .from('faq_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch categories', 500)
  }
}
