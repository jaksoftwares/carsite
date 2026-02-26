// Class name utility - simple implementation
export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}

// Format currency
export function formatCurrency(amount: number, currency = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-KE').format(num)
}

// Generate slug from string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Paginate results
export function paginate<T>(
  data: T[],
  page: number,
  limit: number
): {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
} {
  const total = data.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: data.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone (Kenyan format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+254|0)[1-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`
  }
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`
  }
  return `+254${cleaned}`
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Calculate time ago
export function timeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

// Build filter query for Supabase
export function buildVehicleFilterQuery(
  query: any,
  filters: {
    make?: string | null
    model?: string | null
    bodyType?: string | null
    fuelType?: string | null
    transmission?: string | null
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    minMileage?: number
    maxMileage?: number
    condition?: string | null
    city?: string | null
    featured?: boolean
  }
) {
  if (filters.make) {
    // If it's a UUID, use make_id. Otherwise, it might be a slug.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(filters.make)
    if (isUuid) {
      query = query.eq('make_id', filters.make)
    } else {
      query = query.eq('make.slug', filters.make)
    }
  }
  if (filters.model) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(filters.model)
    if (isUuid) {
      query = query.eq('model_id', filters.model)
    } else {
      query = query.eq('model.slug', filters.model)
    }
  }
  if (filters.bodyType) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(filters.bodyType)
    if (isUuid) {
      query = query.eq('body_type_id', filters.bodyType)
    } else {
      query = query.eq('body_type.slug', filters.bodyType)
    }
  }
  if (filters.fuelType) {
    query = query.eq('fuel_type_id', filters.fuelType)
  }
  if (filters.transmission) {
    query = query.eq('transmission_id', filters.transmission)
  }
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  if (filters.minYear) {
    query = query.gte('year', filters.minYear)
  }
  if (filters.maxYear) {
    query = query.lte('year', filters.maxYear)
  }
  if (filters.minMileage) {
    query = query.gte('mileage', filters.minMileage)
  }
  if (filters.maxMileage) {
    query = query.lte('mileage', filters.maxMileage)
  }
  if (filters.condition) {
    query = query.eq('condition', filters.condition)
  }
  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }
  if (filters.featured !== undefined) {
    query = query.eq('is_featured', filters.featured)
  }

  return query
}

// API Response helpers
export function apiResponse<T>(
  data: T,
  status = 200,
  message?: string
): Response {
  const body = message ? { success: true, message, data } : { success: true, data }
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function apiError(
  message: string,
  status = 400
): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status, headers: { 'Content-Type': 'application/json' } }
  )
}

export function apiSuccess<T>(
  message: string,
  data?: T,
  status = 200
): Response {
  return new Response(
    JSON.stringify({ success: true, message, data }),
    { status, headers: { 'Content-Type': 'application/json' } }
  )
}
