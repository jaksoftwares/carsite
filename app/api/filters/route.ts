import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const [
      { data: makes },
      { data: bodyTypes },
      { data: fuelTypes },
      { data: transmissions },
      { data: driveTypes },
      { data: colors },
      { data: features }
    ] = await Promise.all([
      supabase.from('makes').select('id, name, slug').eq('is_active', true).order('display_order'),
      supabase.from('body_types').select('id, name, slug').eq('is_active', true).order('display_order'),
      supabase.from('fuel_types').select('id, name, slug').eq('is_active', true),
      supabase.from('transmissions').select('id, name, slug').eq('is_active', true),
      supabase.from('drive_types').select('id, name, slug').eq('is_active', true),
      supabase.from('colors').select('id, name, hex_code').eq('is_active', true).order('name'),
      supabase.from('features').select('id, name, slug, category').eq('is_active', true).order('name')
    ])

    return apiResponse({
      makes: makes || [],
      bodyTypes: bodyTypes || [],
      fuelTypes: fuelTypes || [],
      transmissions: transmissions || [],
      driveTypes: driveTypes || [],
      colors: colors || [],
      features: features || [],
      conditions: [
        { id: 'new', name: 'New' },
        { id: 'foreign_used', name: 'Foreign Used' },
        { id: 'locally_used', name: 'Locally Used' },
        { id: 'refurbished', name: 'Refurbished' }
      ]
    })
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch filters', 500)
  }
}
