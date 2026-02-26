import Link from 'next/link'
import Image from 'next/image'
import HeroSearch from '@/components/vehicles/HeroSearch'
import VehicleCard from '@/components/vehicles/VehicleCard'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarSite Kenya - Quality Cars for Sale in Nairobi',
  description: 'Your trusted partner for quality vehicles in Kenya. Browse new and used cars, get financing, or sell your car with CarSite.',
}

// Sample featured vehicles data
const featuredVehicles = [
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
]

const latestVehicles = [
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

const brands = [
  { name: 'Toyota', logo: 'T', href: '/inventory?make=toyota' },
  { name: 'Mercedes-Benz', logo: 'M', href: '/inventory?make=mercedes' },
  { name: 'BMW', logo: 'B', href: '/inventory?make=bmw' },
  { name: 'Honda', logo: 'H', href: '/inventory?make=honda' },
  { name: 'Nissan', logo: 'N', href: '/inventory?make=nissan' },
  { name: 'Mitsubishi', logo: 'M', href: '/inventory?make=mitsubishi' },
  { name: 'Ford', logo: 'F', href: '/inventory?make=ford' },
  { name: 'Land Rover', logo: 'L', href: '/inventory?make=land-rover' },
]

export default function HomePage() {
  return (
      {/* Hero Section */}
    <div Section */}
      <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container-custom relative z-10 py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Browse quality new and used cars from trusted dealers across Kenya. 
              Your journey starts here.
            </p>
          </div>
          
          <HeroSearch />

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/70 text-sm">Vehicles Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/70 text-sm">Trusted Dealers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-white/70 text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15</div>
              <div className="text-white/70 text-sm">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-[var(--background-alt)]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                Featured Vehicles
              </h2>
              <p className="text-[var(--foreground-muted)] mt-1">
                Handpicked premium vehicles ready for delivery
              </p>
            </div>
            <Link
              href="/inventory?featured=true"
              className="hidden md:flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
            >
              View All Featured
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/inventory?featured=true"
              className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
            >
              View All Featured
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Browse by Brand
            </h2>
            <p className="text-[var(--foreground-muted)] mt-1">
              Find your preferred make from our trusted partners
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="flex flex-col items-center justify-center p-4 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-xl mb-2 group-hover:bg-[var(--primary-light)]">
                  {brand.logo}
                </div>
                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[var(--background-alt)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Why Choose CarSite
            </h2>
            <p className="text-[var(--foreground-muted)] mt-2 max-w-2xl mx-auto">
              We are committed to providing a seamless car buying experience with transparency and professionalism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Verified Inventory */}
            <div className="bg-white p-6 rounded-lg border border-[var(--border)]">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Verified Inventory
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Every vehicle undergoes a comprehensive inspection to ensure quality and authenticity.
              </p>
            </div>

            {/* Transparent Pricing */}
            <div className="bg-white p-6 rounded-lg border border-[var(--border)]">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Transparent Pricing
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Clear, upfront pricing with no hidden fees. What you see is what you pay.
              </p>
            </div>

            {/* Professional Support */}
            <div className="bg-white p-6 rounded-lg border border-[var(--border)]">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9 11v5a2 2 0 002 2h2a2 2 0 002-2v-5m0-5a5 5 0 11-10 0 5 5 0 0110 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Professional Support
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Our experienced team is ready to assist you throughout your purchase journey.
              </p>
            </div>

            {/* Nationwide Delivery */}
            <div className="bg-white p-6 rounded-lg border border-[var(--border)]">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Nationwide Delivery
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                We deliver vehicles to any location in Kenya with secure transportation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                Latest Listings
              </h2>
              <p className="text-[var(--foreground-muted)] mt-1">
                Fresh arrivals added daily
              </p>
            </div>
            <Link
              href="/inventory"
              className="hidden md:flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
            >
              View All Inventory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
            >
              View All Inventory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="py-16 bg-[var(--primary)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Get Financed */}
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    Get Financed
                  </h3>
                  <p className="text-[var(--foreground-muted)] mb-4">
                    Flexible financing options to help you own your dream car. Competitive rates and quick approval.
                  </p>
                  <Link
                    href="/get-financed"
                    className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
                  >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sell Your Car */}
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    Sell Your Car
                  </h3>
                  <p className="text-[var(--foreground-muted)] mb-4">
                    Turn your vehicle into cash quickly. We buy all makes and models at fair market prices.
                  </p>
                  <Link
                    href="/sell-your-car"
                    className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
                  >
                    Get a Quote
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
