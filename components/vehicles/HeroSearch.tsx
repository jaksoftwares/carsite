'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HeroSearchProps {
  makes?: { id: string; name: string }[]
  models?: { id: string; name: string }[]
  bodyTypesList?: { id: string; name: string }[]
}

export default function HeroSearch({ makes = [], models = [], bodyTypesList = [] }: HeroSearchProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    bodyType: '',
    priceMin: '',
    priceMax: '',
    yearFrom: '',
    yearTo: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (formData.make) params.set('make', formData.make)
    if (formData.model) params.set('model', formData.model)
    if (formData.bodyType) params.set('body_type', formData.bodyType)
    if (formData.priceMin) params.set('price_min', formData.priceMin)
    if (formData.priceMax) params.set('price_max', formData.priceMax)
    if (formData.yearFrom) params.set('year_from', formData.yearFrom)
    if (formData.yearTo) params.set('year_to', formData.yearTo)
    
    router.push(`/inventory?${params.toString()}`)
  }

  // Sample makes for display
  const sampleMakes = [
    { id: 'toyota', name: 'Toyota' },
    { id: 'mercedes', name: 'Mercedes-Benz' },
    { id: 'bmw', name: 'BMW' },
    { id: 'honda', name: 'Honda' },
    { id: 'nissan', name: 'Nissan' },
    { id: 'mitsubishi', name: 'Mitsubishi' },
    { id: 'ford', name: 'Ford' },
    { id: 'land-rover', name: 'Land Rover' },
  ]

  const bodyTypes = [
    { id: 'suv', name: 'SUV' },
    { id: 'sedan', name: 'Sedan' },
    { id: 'hatchback', name: 'Hatchback' },
    { id: 'pickup', name: 'Pickup' },
    { id: 'van', name: 'Van' },
    { id: 'coupe', name: 'Coupe' },
    { id: 'wagon', name: 'Wagon' },
  ]

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
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
            >
              <option value="">All Makes</option>
              {sampleMakes.map((make) => (
                <option key={make.id} value={make.id}>
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
            >
              <option value="">All Models</option>
              <option value="corolla">Corolla</option>
              <option value="civic">Civic</option>
              <option value="rav4">RAV4</option>
              <option value="x5">X5</option>
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
            >
              <option value="">All Types</option>
              {bodyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
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
              />
              <input
                type="number"
                placeholder="Max"
                value={formData.priceMax}
                onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
              />
              <input
                type="number"
                placeholder="To"
                value={formData.yearTo}
                onChange={(e) => setFormData({ ...formData, yearTo: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-3 md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-2 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)] transition-colors"
            >
              Search Vehicles
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-[var(--foreground-muted)]">Quick Search:</span>
            <button type="button" onClick={() => router.push('/inventory?condition=new')} className="text-[var(--primary)] hover:underline">New Cars</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?condition=foreign_used')} className="text-[var(--primary)] hover:underline">Used Cars</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?body_type=suv')} className="text-[var(--primary)] hover:underline">SUVs</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?make=toyota')} className="text-[var(--primary)] hover:underline">Toyota</button>
            <span className="text-[var(--border-dark)]">|</span>
            <button type="button" onClick={() => router.push('/inventory?price_max=5000000')} className="text-[var(--primary)] hover:underline">Under 5M</button>
          </div>
        </div>
      </form>
    </div>
  )
}
