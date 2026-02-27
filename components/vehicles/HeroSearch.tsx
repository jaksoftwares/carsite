'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface HeroSearchProps {
  makes?: { id: string; name: string; slug: string }[]
  bodyTypesList?: { id: string; name: string; slug: string }[]
}

export default function HeroSearch({ makes = [], bodyTypesList = [] }: HeroSearchProps) {
  const router = useRouter()
  const [localMakes, setLocalMakes] = useState(makes)
  const [localBodyTypes, setLocalBodyTypes] = useState(bodyTypesList)
  const [loading, setLoading] = useState(!makes.length || !bodyTypesList.length)
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    bodyType: '',
    priceMin: '',
    priceMax: '',
    yearFrom: '',
    yearTo: '',
  })

  // Hydration fix
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch makes and body types if not provided as props
  useEffect(() => {
    if (makes.length && bodyTypesList.length) {
      setLoading(false)
      return
    }

    async function fetchFilterData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
        const res = await fetch(`${baseUrl}/api/filters`, {
          next: { revalidate: 3600 }
        })
        const data = await res.json()
        if (data.success) {
          setLocalMakes(data.data.makes || [])
          setLocalBodyTypes(data.data.bodyTypes || [])
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterData()
  }, [makes.length, bodyTypesList.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (formData.make) params.set('make', formData.make)
    if (formData.model) params.set('model', formData.model)
    if (formData.bodyType) params.set('bodyType', formData.bodyType)
    if (formData.priceMin) params.set('minPrice', formData.priceMin)
    if (formData.priceMax) params.set('maxPrice', formData.priceMax)
    if (formData.yearFrom) params.set('minYear', formData.yearFrom)
    if (formData.yearTo) params.set('maxYear', formData.yearTo)
    
    router.push(`/inventory?${params.toString()}`)
  }

  // Map body type slugs to display names
  const getBodyTypeName = (slug: string) => {
    const bodyTypeMap: Record<string, string> = {
      'suv': 'SUV',
      'sedan': 'Sedan', 
      'hatchback': 'Hatchback',
      'pickup': 'Pickup',
      'van': 'Van',
      'coupe': 'Coupe',
      'wagon': 'Wagon',
      'convertible': 'Convertible',
      'crossover': 'Crossover',
      'mpv': 'MPV',
    }
    return bodyTypeMap[slug] || slug
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Make */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Make
            </label>
            <select
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value, model: '' })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
              suppressHydrationWarning
            >
              <option value="">All Makes</option>
              {localMakes.map((make) => (
                <option key={make.id} value={make.slug}>
                  {make.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Model
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
              disabled={!formData.make}
              suppressHydrationWarning
            >
              <option value="">All Models</option>
              {/* Models would need to be fetched based on selected make - for now show common models */}
              <option value="corolla">Corolla</option>
              <option value="civic">Civic</option>
              <option value="rav4">RAV4</option>
              <option value="x5">X5</option>
              <option value="prado">Prado</option>
              <option value="land-cruiser">Land Cruiser</option>
            </select>
          </div>

          {/* Body Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Body Type
            </label>
            <select
              value={formData.bodyType}
              onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
              suppressHydrationWarning
            >
              <option value="">All Types</option>
              {localBodyTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {getBodyTypeName(type.slug)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={formData.priceMin}
                onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                suppressHydrationWarning
              />
              <input
                type="number"
                placeholder="Max"
                value={formData.priceMax}
                onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Year
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="From"
                value={formData.yearFrom}
                onChange={(e) => setFormData({ ...formData, yearFrom: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                suppressHydrationWarning
              />
              <input
                type="number"
                placeholder="To"
                value={formData.yearTo}
                onChange={(e) => setFormData({ ...formData, yearTo: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-3 md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-2 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)] transition-colors"
              suppressHydrationWarning
            >
              Search Vehicles
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-[var(--foreground-muted)]">Quick Search:</span>
            <button type="button" onClick={() => router.push('/inventory?condition=new')} className="text-[var(--primary)] hover:underline" suppressHydrationWarning>New Cars</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?condition=foreign_used')} className="text-[var(--primary)] hover:underline" suppressHydrationWarning>Used Cars</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?bodyType=suv')} className="text-[var(--primary)] hover:underline" suppressHydrationWarning>SUVs</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?make=toyota')} className="text-[var(--primary)] hover:underline" suppressHydrationWarning>Toyota</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?maxPrice=5000000')} className="text-[var(--primary)] hover:underline" suppressHydrationWarning>Under 5M</button>
          </div>
        </div>
      </form>
    </div>
  )
}
