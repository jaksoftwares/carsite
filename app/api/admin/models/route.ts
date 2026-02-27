import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/models - Get models, optionally filtered by make
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const makeId = searchParams.get('make_id')
    const activeOnly = searchParams.get('active') !== 'false'

    let query = supabase
      .from('models')
      .select('*')

    if (makeId) {
      query = query.eq('make_id', makeId)
    }

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    query = query.order('name')

    const { data: models, error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiResponse(models)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch models', 500)
  }
}

// POST /api/admin/models - Create a new model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { make_id, name, year_from, year_to, body_type } = body

    if (!make_id || !name) {
      return apiError('Make ID and model name are required', 400)
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data, error } = await supabase
      .from('models')
      .insert({
        make_id,
        name,
        slug,
        year_from,
        year_to,
        body_type
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Model created successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to create model', 500)
  }
}

// PUT /api/admin/models - Update a model
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId = searchParams.get('id')

    if (!modelId) {
      return apiError('Model ID is required', 400)
    }

    const body = await request.json()
    
    // Generate slug if name is being updated
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    const { data, error } = await supabase
      .from('models')
      .update(body)
      .eq('id', modelId)
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Model updated successfully', data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to update model', 500)
  }
}

// DELETE /api/admin/models - Delete a model
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId = searchParams.get('id')

    if (!modelId) {
      return apiError('Model ID is required', 400)
    }

    const { error } = await supabase
      .from('models')
      .delete()
      .eq('id', modelId)

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Model deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete model', 500)
  }
}
