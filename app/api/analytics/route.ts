import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/analytics - Get analytics data (admin)
export async function GET(request: NextRequest) {
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
    const type = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    let data: any = {}

    switch (type) {
      case 'overview':
        // Get overview stats
        const { count: totalVehicles } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')

        const { count: totalEnquiries } = await supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true })

        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        const { count: totalViews } = await supabase
          .from('vehicle_views')
          .select('*', { count: 'exact', head: true })

        data = {
          total_vehicles: totalVehicles || 0,
          total_enquiries: totalEnquiries || 0,
          total_users: totalUsers || 0,
          total_views: totalViews || 0,
        }
        break

      case 'vehicles':
        // Get top vehicles by views
        const { data: topVehicles } = await supabase
          .from('vehicles')
          .select('id, title, slug, view_count, price, make:makes(name)')
          .eq('status', 'active')
          .order('view_count', { ascending: false })
          .limit(10)
        
        data.top_vehicles = topVehicles || []
        break

      case 'enquiries':
        // Get enquiries by status
        const { data: enquiriesByStatus } = await supabase
          .from('enquiries')
          .select('status')
        
        const statusCounts: Record<string, number> = {}
        enquiriesByStatus?.forEach(e => {
          statusCounts[e.status] = (statusCounts[e.status] || 0) + 1
        })
        
        data.by_status = statusCounts
        break

      case 'daily':
        // Get daily analytics
        let query = supabase
          .from('daily_analytics')
          .select('*')
          .order('date', { ascending: false })
          .limit(30)

        if (startDate) {
          query = query.gte('date', startDate)
        }
        if (endDate) {
          query = query.lte('date', endDate)
        }

        const { data: dailyData } = await query
        data.daily = dailyData || []
        break

      case 'searches':
        // Get popular searches
        const { data: popularSearches } = await supabase
          .from('search_history')
          .select('search_query')
        
        const searchCounts: Record<string, number> = {}
        popularSearches?.forEach(s => {
          searchCounts[s.search_query] = (searchCounts[s.search_query] || 0) + 1
        })
        
        data.popular_searches = Object.entries(searchCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20)
          .map(([query, count]) => ({ query, count }))
        break

      default:
        return apiError('Invalid analytics type', 400)
    }

    return apiResponse(data)
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch analytics', 500)
  }
}

// POST /api/analytics - Track event (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, event_category, event_action, event_label, vehicle_id, page_url, metadata } = body

    if (!event_type) {
      return apiError('Event type is required', 400)
    }

    // Get user/session info
    let user_id = null
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        user_id = user.id
      }
    }

    // Get device info from headers
    const deviceType = request.headers.get('x-device-type')
    const browser = request.headers.get('x-browser')
    const os = request.headers.get('x-os')

    // Track vehicle view specifically
    if (event_type === 'vehicle_view' && vehicle_id) {
      await supabase.from('vehicle_views').insert({
        vehicle_id,
        user_id,
        session_id: request.headers.get('x-session-id'),
        referrer: request.headers.get('referer'),
        device_type: deviceType,
      })

      // Increment vehicle view count
      await supabase.rpc('increment_vehicle_view_count', { vehicle_uuid: vehicle_id })
    }

    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        event_category,
        event_action,
        event_label,
        vehicle_id,
        user_id,
        session_id: request.headers.get('x-session-id'),
        page_url,
        device_type: deviceType,
        browser,
        os,
        metadata,
      })

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Event tracked', data, 201)
  } catch (error: any) {
    return apiError(error.message || 'Failed to track event', 500)
  }
}
