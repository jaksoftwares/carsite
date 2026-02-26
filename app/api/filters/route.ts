import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/filters - Get all filter options
export async function GET() {
  try {
    // Get all filter data in parallel
    const [bodyTypes, fuelTypes, transmissions, driveTypes, colors, features] = await Promise.all([
      supabase.from('body_types').select('*').eq('is_active', true).order('display_order'),
      supabase.from('fuel_types').select('*').eq('is_active', true).order('name'),
      supabase.from('transmissions').select('*').eq('is_active', true).order('name'),
      supabase.from('drive_types').select('*').eq('is_active', true).order('name'),
      supabase.from('colors').select('*').eq('is_active', true).order('name'),
      supabase.from('features').select('*').eq('is_active', true).order('category', { ascending: true }),
    ])

    // Group features by category
    const featuresByCategory: Record<string, any[]> = {}
    features.data?.forEach(feature => {
      if (!featuresByCategory[feature.category]) {
        featuresByCategory[feature.category] = []
      }
      featuresByCategory[feature.category].push(feature)
    })

    return apiResponse({
      body_types: bodyTypes.data || [],
      fuel_types: fuelTypes.data || [],
      transmissions: transmissions.data || [],
      drive_types: driveTypes.data || [],
      colors: colors.data || [],
      features: features.data || [],
      features_by_category: featuresByCategory,
      conditions: [
        { value: 'new', label: 'New' },
        { value: 'foreign_used', label: 'Foreign Used' },
        { value: 'locally_used', label: 'Locally Used' },
        { value: 'refurbished', label: 'Refurbished' },
      ],
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch filters', 500)
  }
}
