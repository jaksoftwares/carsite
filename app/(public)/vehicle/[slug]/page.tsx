import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { formatCurrency, formatNumber } from '@/lib/utils'

async function getVehicle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
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

  if (!vehicle) {
    notFound()
  }

  // Get first valid image from vehicle images
  const validImages = vehicle.images?.filter((img: any) => img.url && img.url.trim() !== '') || []
  const primaryImage = validImages.length > 0 ? validImages[0].url : ''

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
              <div className="relative aspect-[16/10] bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                <Image
                  src={primaryImage}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  priority
                />
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
              </div>

              {/* Enquiry Form */}
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <h3 className="text-base font-bold text-[var(--foreground)] mb-4">
                  Interested? Send an Enquiry
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                  />
                  <textarea
                    placeholder="I'm interested in this vehicle and would like to know more details or book a test drive."
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all resize-none"
                  ></textarea>
                  <button className="w-full py-3 bg-[var(--foreground)] text-white font-bold rounded-lg hover:bg-black transition-all shadow-md">
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
