import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/reviews - Get vehicle reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const vehicleId = searchParams.get('vehicle_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    if (!vehicleId) {
      return apiError('Vehicle ID is required', 400)
    }

    // Build query
    let query = supabase
      .from('vehicle_reviews')
      .select('*', { count: 'exact' })
      .eq('vehicle_id', vehicleId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: reviews, error, count } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    // Calculate average rating
    const { data: stats } = await supabase
      .from('vehicle_reviews')
      .select('rating')
      .eq('vehicle_id', vehicleId)
      .eq('is_approved', true)

    const avgRating = stats && stats.length > 0
      ? stats.reduce((sum, r) => sum + r.rating, 0) / stats.length
      : 0

    // Get rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    stats?.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++
    })

    return apiResponse({
      reviews,
      stats: {
        average_rating: avgRating,
        total_reviews: count || 0,
        distribution,
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch reviews', 500)
  }
}

// POST /api/reviews - Add review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicle_id, rating, title, content, pros, cons, reviewer_name, reviewer_email } = body

    if (!vehicle_id || !rating || !reviewer_name || !reviewer_email || !content) {
      return apiError('Vehicle ID, rating, name, email and content are required', 400)
    }

    if (rating < 1 || rating > 5) {
      return apiError('Rating must be between 1 and 5', 400)
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

    // Check if vehicle exists
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', vehicle_id)
      .single()

    if (!vehicle) {
      return apiError('Vehicle not found', 404)
    }

    const { data, error } = await supabase
      .from('vehicle_reviews')
      .insert({
        vehicle_id,
        user_id,
        rating,
        title,
        content,
        pros,
        cons,
        reviewer_name,
        reviewer_email,
        is_approved: true, // Auto-approve for now
      })
      .select()
      .single()

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Review added successfully', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to add review', 500)
  }
}
