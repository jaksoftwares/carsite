import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/vehicles/features - Get all features or features for a specific vehicle
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicle_id')

    if (vehicleId) {
      // Get features for a specific vehicle
      const { data: vehicleFeatures, error } = await supabase
        .from('vehicle_features')
        .select(`
          *,
          feature:features(*)
        `)
        .eq('vehicle_id', vehicleId)

      if (error) {
        return apiError(error.message, 400)
      }

      return apiResponse(vehicleFeatures)
    } else {
      // Get all available features
      const { data: features, error } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('name')

      if (error) {
        return apiError(error.message, 400)
      }

      // Group by category
      const groupedFeatures = features?.reduce((acc: any, feature) => {
        if (!acc[feature.category]) {
          acc[feature.category] = []
        }
        acc[feature.category].push(feature)
        return acc
      }, {}) || {}

      return apiResponse({
        features,
        groupedFeatures,
        categories: ['safety', 'comfort', 'entertainment', 'performance', 'exterior', 'interior', 'other']
      })
    }
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch features', 500)
  }
}

// POST /api/admin/vehicles/features - Add feature(s) to a vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicle_id, feature_ids, features } = body

    if (!vehicle_id) {
      return apiError('Vehicle ID is required', 400)
    }

    // If feature_ids provided, add them
    if (feature_ids && Array.isArray(feature_ids)) {
      const vehicleFeatures = feature_ids.map((feature_id: string) => ({
        vehicle_id,
        feature_id
      }))

      const { error } = await supabase
        .from('vehicle_features')
        .upsert(vehicleFeatures, { onConflict: 'vehicle_id,feature_id' })

      if (error) {
        return apiError(error.message, 400)
      }
    }

    // If features (new ones) provided, first create them then link
    if (features && Array.isArray(features)) {
      for (const feature of features) {
        // Create the feature if it doesn't exist
        const { data: existingFeature } = await supabase
          .from('features')
          .select('id')
          .eq('name', feature.name)
          .single()

        let featureId = existingFeature?.id

        if (!featureId) {
          const { data: newFeature, error: createError } = await supabase
            .from('features')
            .insert({
              name: feature.name,
              slug: feature.name.toLowerCase().replace(/\s+/g, '-'),
              category: feature.category || 'other',
              description: feature.description
            })
            .select()
            .single()

          if (createError) {
            return apiError(createError.message, 400)
          }
          featureId = newFeature?.id
        }

        // Link feature to vehicle
        if (featureId) {
          await supabase
            .from('vehicle_features')
            .upsert({
              vehicle_id,
              feature_id: featureId,
              value: feature.value
            }, { onConflict: 'vehicle_id,feature_id' })
        }
      }
    }

    return apiSuccess('Features added successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to add features', 500)
  }
}

// DELETE /api/admin/vehicles/features - Remove feature(s) from a vehicle
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicle_id')
    const featureId = searchParams.get('feature_id')

    if (!vehicleId) {
      return apiError('Vehicle ID is required', 400)
    }

    let query = supabase
      .from('vehicle_features')
      .delete()
      .eq('vehicle_id', vehicleId)

    if (featureId) {
      query = query.eq('feature_id', featureId)
    }

    const { error } = await query

    if (error) {
      return apiError(error.message, 400)
    }

    return apiSuccess('Feature(s) removed successfully')
  } catch (error: any) {
    return apiError(error.message || 'Failed to remove features', 500)
  }
}
