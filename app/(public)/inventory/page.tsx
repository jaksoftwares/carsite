import Link from 'next/link'
import VehicleCard from '@/components/vehicles/VehicleCard'
import type { Metadata } from 'next'
import { formatCurrency } from '@/lib/utils'

import VehicleSort from '@/components/vehicles/VehicleSort'

export const metadata: Metadata = {
  title: 'Car Inventory - Browse New and Used Cars for Sale',
  description: 'Browse our extensive collection of new and used vehicles. Filter by make, model, price, year, and more to find your perfect car.',
}

async function getInventoryData(searchParams: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Create params for vehicles
  const params = new URLSearchParams()
  Object.keys(searchParams).forEach(key => {
    if (searchParams[key]) params.set(key, searchParams[key])
  })
  if (!params.has('limit')) params.set('limit', '50')

  try {
    const [vehiclesRes, filtersRes] = await Promise.all([
      fetch(`${baseUrl}/api/vehicles?${params.toString()}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/filters`, { next: { revalidate: 3600 } })
    ])

    if (!vehiclesRes.ok) throw new Error('Vehicles fetch failed')
    if (!filtersRes.ok) throw new Error('Filters fetch failed')

    const vehiclesData = await vehiclesRes.json()
    const filtersData = await filtersRes.json()

    return {
      vehicles: vehiclesData.success ? vehiclesData.data.vehicles : [],
      pagination: vehiclesData.success ? vehiclesData.data.pagination : { total: 0, totalPages: 0 },
      filters: filtersData.success ? filtersData.data : { makes: [], bodyTypes: [], fuelTypes: [], transmissions: [], conditions: [] }
    }
  } catch (error) {
    console.error('Error fetching inventory data:', error)
    return {
      vehicles: [],
      pagination: { total: 0, totalPages: 0, page: 1 },
      filters: { makes: [], bodyTypes: [], fuelTypes: [], transmissions: [], conditions: [] }
    }
  }
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  const resolvedParams = await searchParams
  const { vehicles, pagination, filters } = await getInventoryData(resolvedParams)

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      {/* Page Header */}
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Car Inventory
          </h1>
          <p className="text-white/80">
            Browse {pagination.total} quality vehicles found in our database
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Mobile Filter Toggle & Horizontal Sticky Filters */}
        <div className="sticky top-16 z-30 bg-[var(--background-alt)] pb-4 mb-4">
          <div className="bg-white rounded-lg border border-[var(--border)] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Filter Vehicles
              </h2>
              <Link href="/inventory" className="text-sm text-[var(--primary)] hover:underline font-medium">
                Reset
              </Link>
            </div>

            <form action="/inventory" method="GET" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Condition Filter */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Condition
                </label>
                <select name="condition" defaultValue={resolvedParams.condition || ''} className="w-full px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--primary)] outline-none">
                  <option value="">All</option>
                  {filters.conditions.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Make Filter */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Make
                </label>
                <select name="make" defaultValue={resolvedParams.make || ''} className="w-full px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--primary)] outline-none">
                  <option value="">All Makes</option>
                  {filters.makes.map((m: any) => (
                    <option key={m.slug} value={m.slug}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Body Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Body Type
                </label>
                <select name="bodyType" defaultValue={resolvedParams.bodyType || ''} className="w-full px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--primary)] outline-none">
                  <option value="">All Types</option>
                  {filters.bodyTypes.map((b: any) => (
                    <option key={b.slug} value={b.slug}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Min Price
                </label>
                <input
                  name="minPrice"
                  type="number"
                  placeholder="Min"
                  defaultValue={resolvedParams.minPrice || ''}
                  className="w-full px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Max Price
                </label>
                <input
                  name="maxPrice"
                  type="number"
                  placeholder="Max"
                  defaultValue={resolvedParams.maxPrice || ''}
                  className="w-full px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Year
                </label>
                <select name="maxYear" defaultValue={resolvedParams.maxYear || ''} className="w-full px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--primary)] outline-none">
                  <option value="">Any Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                  <option value="2015">2015</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-3 lg:col-span-6 mt-2">
                <button type="submit" className="w-full py-2 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--primary-dark)] transition-all text-sm">
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="text-[var(--foreground)] font-medium">
                Showing <span className="text-[var(--primary)] font-bold">{pagination.total}</span> vehicles
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--foreground-muted)]">Sort by:</span>
                <VehicleSort defaultValue={resolvedParams.sortBy || 'created_at'} />
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle: any) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-[var(--border)]">
                  <div className="w-16 h-16 bg-[var(--background-alt)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No matching vehicles</h3>
                  <p className="text-[var(--foreground-muted)] mb-6">Try adjusting your filters or search terms.</p>
                  <Link href="/inventory" className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--primary-dark)] transition-all">
                    View All Inventory
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  {pagination.page > 1 && (
                    <Link 
                      href={`/inventory?page=${pagination.page - 1}`}
                      className="w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-lg bg-white text-[var(--foreground)] hover:border-[var(--primary)] transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  )}
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <Link
                      key={p}
                      href={`/inventory?page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all shadow-sm ${
                        pagination.page === p 
                          ? 'bg-[var(--primary)] text-white' 
                          : 'bg-white text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}

                  {pagination.hasMore && (
                    <Link 
                      href={`/inventory?page=${pagination.page + 1}`}
                      className="w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-lg bg-white text-[var(--foreground)] hover:border-[var(--primary)] transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
