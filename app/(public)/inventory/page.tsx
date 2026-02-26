import Link from 'next/link'
import VehicleCard from '@/components/vehicles/VehicleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Car Inventory - Browse New and Used Cars for Sale',
  description: 'Browse our extensive collection of new and used vehicles. Filter by make, model, price, year, and more to find your perfect car.',
}

// Sample vehicles for display
const vehicles = [
  {
    id: '1',
    slug: 'toyota-prado-tx-2023',
    title: 'Toyota Prado TX 2023',
    year: 2023,
    price: 18500000,
    price_negotiable: false,
    mileage: 15000,
    transmission: 'automatic' as const,
    fuel_type: 'petrol' as const,
    condition: 'foreign_used' as const,
    primary_image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800&q=80',
    city: 'Nairobi',
    make_name: 'Toyota',
    model_name: 'Prado',
    is_featured: true,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    slug: 'mercedes-benz-gle-2022',
    title: 'Mercedes-Benz GLE 2022',
    year: 2022,
    price: 15000000,
    price_negotiable: true,
    mileage: 28000,
    transmission: 'automatic' as const,
    fuel_type: 'diesel' as const,
    condition: 'foreign_used' as const,
    primary_image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    city: 'Mombasa',
    make_name: 'Mercedes-Benz',
    model_name: 'GLE',
    is_featured: true,
    created_at: '2024-01-14',
  },
  {
    id: '3',
    slug: 'bmw-x5-2023',
    title: 'BMW X5 xDrive40i 2023',
    year: 2023,
    price: 13500000,
    price_negotiable: false,
    mileage: 8500,
    transmission: 'automatic' as const,
    fuel_type: 'petrol' as const,
    condition: 'new' as const,
    primary_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    city: 'Nairobi',
    make_name: 'BMW',
    model_name: 'X5',
    is_featured: true,
    created_at: '2024-01-13',
  },
  {
    id: '4',
    slug: 'toyota-land-cruiser-2022',
    title: 'Toyota Land Cruiser VX-R 2022',
    year: 2022,
    price: 16500000,
    price_negotiable: true,
    mileage: 45000,
    transmission: 'automatic' as const,
    fuel_type: 'diesel' as const,
    condition: 'foreign_used' as const,
    primary_image: 'https://images.unsplash.com/photo-1600705922612-7d260cb57795?w=800&q=80',
    city: 'Kisumu',
    make_name: 'Toyota',
    model_name: 'Land Cruiser',
    is_featured: true,
    created_at: '2024-01-12',
  },
  {
    id: '5',
    slug: 'honda-civic-2021',
    title: 'Honda Civic EX 2021',
    year: 2021,
    price: 3200000,
    price_negotiable: true,
    mileage: 52000,
    transmission: 'automatic' as const,
    fuel_type: 'petrol' as const,
    condition: 'foreign_used' as const,
    primary_image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80',
    city: 'Nairobi',
    make_name: 'Honda',
    model_name: 'Civic',
    is_featured: false,
    created_at: '2024-01-20',
  },
  {
    id: '6',
    slug: 'nissan-x-trail-2022',
    title: 'Nissan X-Trail 2022',
    year: 2022,
    price: 4500000,
    price_negotiable: true,
    mileage: 38000,
    transmission: 'automatic' as const,
    fuel_type: 'petrol' as const,
    condition: 'foreign_used' as const,
    primary_image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    city: 'Nairobi',
    make_name: 'Nissan',
    model_name: 'X-Trail',
    is_featured: false,
    created_at: '2024-01-19',
  },
  {
    id: '7',
    slug: 'ford-ranger-2023',
    title: 'Ford Ranger Wildtrak 2023',
    year: 2023,
    price: 6800000,
    price_negotiable: false,
    mileage: 12000,
    transmission: 'automatic' as const,
    fuel_type: 'diesel' as const,
    condition: 'new' as const,
    primary_image: 'https://images.unsplash.com/photo-1667912233401-0e63436c0a73?w=800&q=80',
    city: 'Nairobi',
    make_name: 'Ford',
    model_name: 'Ranger',
    is_featured: false,
    created_at: '2024-01-18',
  },
  {
    id: '8',
    slug: 'mitsubishi-outlander-2022',
    title: 'Mitsubishi Outlander PHEV 2022',
    year: 2022,
    price: 5500000,
    price_negotiable: true,
    mileage: 25000,
    transmission: 'automatic' as const,
    fuel_type: 'hybrid' as const,
    condition: 'foreign_used' as const,
    primary_image: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=800&q=80',
    city: 'Mombasa',
    make_name: 'Mitsubishi',
    model_name: 'Outlander',
    is_featured: false,
    created_at: '2024-01-17',
  },
]

const makes = [
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

const fuelTypes = [
  { id: 'petrol', name: 'Petrol' },
  { id: 'diesel', name: 'Diesel' },
  { id: 'electric', name: 'Electric' },
  { id: 'hybrid', name: 'Hybrid' },
]

const transmissions = [
  { id: 'automatic', name: 'Automatic' },
  { id: 'manual', name: 'Manual' },
  { id: 'semi-automatic', name: 'Semi-Auto' },
]

const conditions = [
  { id: 'new', name: 'New' },
  { id: 'foreign_used', name: 'Foreign Used' },
  { id: 'locally_used', name: 'Locally Used' },
]

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      {/* Page Header */}
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Car Inventory
          </h1>
          <p className="text-white/80">
            Browse our collection of quality vehicles
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border border-[var(--border)] p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Filters
                </h2>
                <button className="text-sm text-[var(--primary)] hover:underline">
                  Clear All
                </button>
              </div>

              {/* Make Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Make
                </label>
                <select className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="">All Makes</option>
                  {makes.map((make) => (
                    <option key={make.id} value={make.id}>
                      {make.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Body Type
                </label>
                <select className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="">All Types</option>
                  {bodyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Price Range (KES)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Year
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Fuel Type
                </label>
                <select className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="">All Fuel Types</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel.id} value={fuel.id}>
                      {fuel.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Transmission
                </label>
                <select className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="">All Transmissions</option>
                  {transmissions.map((trans) => (
                    <option key={trans.id} value={trans.id}>
                      {trans.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Condition
                </label>
                <select className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="">All Conditions</option>
                  {conditions.map((cond) => (
                    <option key={cond.id} value={cond.id}>
                      {cond.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apply Filters Button */}
              <button className="w-full py-2 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)] transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="text-[var(--foreground)]">
                <span className="font-semibold">{vehicles.length}</span> vehicles found
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select className="px-3 py-2 border border-[var(--border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest</option>
                  <option value="mileage_asc">Mileage: Low to High</option>
                </select>

                {/* View Toggle */}
                <div className="hidden sm:flex border border-[var(--border)] rounded-md overflow-hidden">
                  <button className="p-2 bg-[var(--primary)] text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012a2 2 2v2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-white text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] hover:bg-[var(--background-alt)] disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-2 border border-[var(--primary)] rounded-md bg-[var(--primary)] text-white">
                  1
                </button>
                <button className="px-3 py-2 border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] hover:bg-[var(--background-alt)]">
                  2
                </button>
                <button className="px-3 py-2 border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] hover:bg-[var(--background-alt)]">
                  3
                </button>
                <span className="px-2 text-[var(--foreground-muted)]">...</span>
                <button className="px-3 py-2 border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] hover:bg-[var(--background-alt)]">
                  10
                </button>
                <button className="px-3 py-2 border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] hover:bg-[var(--background-alt)]">
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
