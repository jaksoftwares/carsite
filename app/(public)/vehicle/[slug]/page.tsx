import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { formatCurrency, formatNumber } from '@/lib/utils'
import VehicleCard from '@/components/vehicles/VehicleCard'
import type { VehicleCardData } from '@/types'
import VehicleActions from '@/components/vehicles/VehicleActions'
import VehicleEnquiryForm from '@/components/vehicles/VehicleEnquiryForm'

async function getVehicle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
    const res = await fetch(`${baseUrl}/api/vehicles/${slug}`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return null
  }
}

async function getRelatedVehicles(vehicle: any, limit: number = 4) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
    const makeId = vehicle.make?.id
    const bodyTypeId = vehicle.body_type_id
    const price = vehicle.price
    
    // Calculate price range (±30%)
    const minPrice = Math.floor(price * 0.7)
    const maxPrice = Math.ceil(price * 1.3)
    
    // Build query params - prioritize same make, then body type, then price range
    const params = new URLSearchParams()
    params.set('limit', '8') // Fetch more to filter out current vehicle
    params.set('status', 'active')
    
    // Filter by make if available
    if (makeId) {
      params.set('make', makeId)
    }
    
    // Filter by body type
    if (bodyTypeId) {
      params.set('bodyType', bodyTypeId)
    }
    
    // Price range
    params.set('minPrice', minPrice.toString())
    params.set('maxPrice', maxPrice.toString())
    
    const res = await fetch(`${baseUrl}/api/vehicles?${params.toString()}`, {
      next: { revalidate: 3600 }
    })
    
    if (!res.ok) return []
    const data = await res.json()
    let vehicles = data.success && data.data?.vehicles ? data.data.vehicles : []
    
    // Filter out the current vehicle
    vehicles = vehicles.filter((v: any) => v.id !== vehicle.id)
    
    // Return limited number
    return vehicles.slice(0, limit)
  } catch (error) {
    console.error('Error fetching related vehicles:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicle(slug)
  
  if (!vehicle) return { title: 'Vehicle Not Found' }

  return {
    title: `${vehicle.title} - CarSite Kenya`,
    description: `Buy ${vehicle.year} ${vehicle.title} for ${formatCurrency(vehicle.price)}. ${formatNumber(vehicle.mileage)} km, ${vehicle.transmission?.name}, ${vehicle.fuel_type?.name}.`,
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)
  const relatedVehicles = vehicle ? await getRelatedVehicles(vehicle, 4) : []

  if (!vehicle) {
    notFound()
  }

  // Get first valid image from vehicle images
  const validImages = vehicle.images?.filter((img: any) => img.url && img.url.trim() !== '') || []
  const primaryImage = validImages.length > 0 ? validImages[0].url : ''

  // Prepare vehicle card data for related vehicles
  const relatedVehiclesData: VehicleCardData[] = relatedVehicles.map((v: any) => ({
    id: v.id,
    slug: v.slug,
    title: v.title,
    year: v.year,
    price: v.price,
    price_negotiable: v.price_negotiable,
    mileage: v.mileage,
    transmission: v.transmission || { id: '', name: 'Auto', slug: 'automatic' },
    fuel_type: v.fuel_type || { id: '', name: 'Petrol', slug: 'petrol' },
    condition: v.condition,
    is_new: v.is_new,
    primary_image: v.primary_image,
    city: v.city,
    make: v.make || { id: '', name: '', slug: '' },
    model: v.model || { id: '', name: '', slug: '' },
    is_featured: v.is_featured,
    created_at: v.created_at,
  }))

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
              Home
            </Link>
            <span className="text-[var(--border-dark)]">/</span>
            <Link href="/inventory" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
              Inventory
            </Link>
            <span className="text-[var(--border-dark)]">/</span>
            <span className="text-[var(--foreground)]">{vehicle.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            {primaryImage && (
              <div className="relative aspect-[16/10] bg-white rounded-lg overflow-hidden mb-4 shadow-sm group">
                <Image
                  src={primaryImage}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Image overlay actions (Client Component) */}
                <VehicleActions 
                  vehicleTitle={vehicle.title}
                  vehicleYear={vehicle.year}
                  makeName={vehicle.make?.name || ''}
                  modelName={vehicle.model?.name || ''}
                />

                {/* Image count badge */}
                {validImages.length > 1 && (
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {validImages.length} Photos
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Gallery */}
            {validImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {validImages.map((image: any, index: number) => (
                  <div
                    key={index}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-transparent transition-all cursor-pointer hover:border-[var(--primary)]`}
                  >
                    <Image
                      src={image.url}
                      alt={`${vehicle.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mt-8 bg-white rounded-lg border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border)]">
                Description
              </h2>
              <div className="prose prose-sm max-w-none text-[var(--foreground-muted)] whitespace-pre-wrap">
                {vehicle.description || 'No description provided.'}
              </div>
            </div>

            {/* Features */}
            {vehicle.features?.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border border-[var(--border)] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 pb-2 border-b border-[var(--border)]">
                  Features & Specifications
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {vehicle.features.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0 md:border-b">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-[var(--foreground-muted)]">{feature.name}</span>
                      </div>
                      {feature.value && (
                        <span className="text-sm text-[var(--foreground)]">{feature.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Vehicle Info Card */}
            <div className="bg-white rounded-lg border border-[var(--border)] p-6 shadow-sm">
              <h1 className="text-3xl font-extrabold text-[var(--foreground)] mb-4 leading-tight">
                {vehicle.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                  vehicle.is_new || vehicle.condition === 'new' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {vehicle.is_new || vehicle.condition === 'new' ? 'Brand New' : 'Used'}
                </span>
                {vehicle.is_featured && (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent)] text-white shadow-sm">
                    Featured
                  </span>
                )}
                <span className="text-sm text-[var(--foreground-muted)] font-medium">
                  {vehicle.condition?.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-extrabold text-[var(--primary)]">
                  {formatCurrency(vehicle.price)}
                </span>
                {vehicle.price_negotiable && (
                  <span className="text-sm font-semibold text-[var(--foreground-muted)] bg-[var(--background-alt)] px-3 py-1 rounded-md">Negotiable</span>
                )}
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Year</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">{vehicle.year}</p>
                </div>
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Mileage</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">{formatNumber(vehicle.mileage)} km</p>
                </div>
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Transmission</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">{vehicle.transmission?.name || 'Auto'}</p>
                </div>
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Fuel</p>
                  <p className="text-sm font-bold text-[var(--foreground)] uppercase">{vehicle.fuel_type?.name || 'Petrol'}</p>
                </div>
              </div>

              {/* More Specs */}
              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Make</span>
                  <span className="text-[var(--foreground)] font-medium">{vehicle.make?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Model</span>
                  <span className="text-[var(--foreground)] font-medium">{vehicle.model?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Body Type</span>
                  <span className="text-[var(--foreground)] font-medium">{vehicle.body_type?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Engine</span>
                  <span className="text-[var(--foreground)] font-medium">{vehicle.engine_size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Drive Type</span>
                  <span className="text-[var(--foreground)] font-medium">{vehicle.drive_type?.name || vehicle.drive_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Condition</span>
                  <span className="text-[var(--foreground)] font-medium capitalize">{vehicle.condition?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">VIN</span>
                  <span className="text-[var(--foreground)] font-mono text-xs">{vehicle.vin || 'N/A'}</span>
                </div>
              </div>

              {/* Vehicle Stats */}
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {formatNumber(vehicle.views || 0)} views
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Listed {new Date(vehicle.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg border border-[var(--border)] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Contact Seller
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {vehicle.seller?.first_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--foreground)]">
                      {vehicle.seller ? `${vehicle.seller.first_name} ${vehicle.seller.last_name || ''}` : 'CarSite Seller'}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">{vehicle.city}, Kenya</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${vehicle.seller?.phone || '+254700000000'}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--primary-dark)] transition-all shadow-md active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Seller
                </a>
                <a
                  href={`https://wa.me/${(vehicle.seller?.phone || '254700000000').replace('+', '')}?text=I'm interested in the ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name} listed on CarSite.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20BD5A] transition-all shadow-md active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Now
                </a>
                <Link
                  href={`/get-financed?vehicle=${vehicle.id}&price=${vehicle.price}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--foreground)] text-white font-bold rounded-lg hover:bg-black transition-all shadow-md active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Get Financed
                </Link>
              </div>

              {/* Enquiry Form (Client Component) */}
              <VehicleEnquiryForm 
                vehicleId={vehicle.id}
                vehicleTitle={vehicle.title}
              />
            </div>
          </div>
        </div>

        {/* Related Vehicles Section */}
        {relatedVehiclesData.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  Related Vehicles
                </h2>
                <p className="text-[var(--foreground-muted)] mt-1">
                  Similar {vehicle.make?.name} {vehicle.body_type?.name || 'vehicles'} you might like
                </p>
              </div>
              <Link 
                href={`/inventory?make=${vehicle.make?.slug}&bodyType=${vehicle.body_type?.slug}`}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[var(--border)] text-[var(--foreground)] font-semibold rounded-lg hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedVehiclesData.map((relatedVehicle) => (
                <VehicleCard key={relatedVehicle.id} vehicle={relatedVehicle} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link 
                href={`/inventory?make=${vehicle.make?.slug}&bodyType=${vehicle.body_type?.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] transition-all"
              >
                View All Related Vehicles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
