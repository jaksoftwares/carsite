import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiResponse, apiError, apiSuccess } from '@/lib/utils'
import cloudinary from '@/lib/cloudinary'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/upload - Upload image to Cloudinary
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

    if (!profile || !['admin', 'super_admin', 'dealer'].includes(profile.role)) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'vehicles'

    if (!file) {
      return apiError('No file provided', 400)
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUri,
        {
          folder: `carstore/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 2000, height: 2000, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    }) as any

    return apiSuccess('File uploaded successfully', {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (error: any) {
    return apiError(error.message || 'Upload failed', 500)
  }
}

// DELETE /api/upload - Delete image from Cloudinary
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

    if (!profile || !['admin', 'super_admin', 'dealer'].includes(profile.role)) {
      return apiError('Forbidden - Insufficient permissions', 403)
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('public_id')

    if (!publicId) {
      return apiError('Public ID is required', 400)
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId)

    return apiSuccess('File deleted successfully')
  } catch (error: any) {
    return apiError(error.message || 'Delete failed', 500)
  }
}
