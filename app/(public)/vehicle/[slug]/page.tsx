import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

// Sample vehicle data
const vehicle = {
  id: '1',
  slug: 'toyota-prado-tx-2023',
  title: 'Toyota Prado TX 2023',
  year: 2023,
  price: 18500000,
  price_negotiable: false,
  mileage: 15000,
  transmission: 'automatic',
  fuel_type: 'petrol',
  condition: 'foreign_used',
  body_type: 'SUV',
  engine_size: '2.7L',
  color: 'White',
  drive_type: '4WD',
  registration_number: 'KCA 123A',
  country: 'Kenya',
  city: 'Nairobi',
  description: `This is a premium Toyota Prado TX in excellent condition. It comes with a full service history and has been meticulously maintained. The vehicle features a powerful 2.7L engine paired with a smooth automatic transmission. Ideal for family use or adventurous trips across Kenya.

The interior is spacious and comfortable, featuring leather seats, automatic climate control, and a premium audio system. Safety features include multiple airbags, ABS, EBD, and stability control.

Don't miss this opportunity to own a reliable premium SUV at a competitive price.`,
  features: [
    { category: 'Safety', items: ['Airbags (Driver & Passenger)', 'ABS', 'EBD', 'Stability Control', 'Reverse Camera', 'Parking Sensors'] },
    { category: 'Comfort', items: ['Leather Seats', 'Power Seats', 'Climate Control', 'Cruise Control', 'Power Windows', 'Central Locking'] },
    { category: 'Entertainment', items: ['Touchscreen Infotainment', 'Bluetooth', 'USB Ports', 'Apple CarPlay', 'Android Auto', 'Premium Audio'] },
    { category: 'Exterior', items: ['LED Headlights', 'Daytime Running Lights', 'Roof Rails', 'Alloy Wheels', 'Fog Lights', 'Rear Spoiler'] },
  ],
  images: [
    'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=1200&q=80',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  ],
  seller: {
    name: 'CarSite Motors',
    phone: '+254 700 000 000',
    email: 'sales@carsite.co.ke',
    location: 'Nairobi',
  },
  created_at: '2024-01-15',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return {
    title: `${vehicle.title} - CarSite Kenya`,
    description: `Buy ${vehicle.year} ${vehicle.title} for KES ${vehicle.price.toLocaleString()}. ${vehicle.mileage.toLocaleString()} km, ${vehicle.transmission}, ${vehicle.fuel_type}.`,
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // In a real app, fetch vehicle data based on slug
  // const vehicle = await getVehicle(params.slug)

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
            <div className="relative aspect-[16/10] bg-white rounded-lg overflow-hidden mb-4">
              <Image
                src={vehicle.images[0]}
                alt={vehicle.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                    index === 0 ? 'border-[var(--primary)]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${vehicle.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="mt-8 bg-white rounded-lg border border-[var(--border)] p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                Description
              </h2>
              <div className="prose prose-sm max-w-none text-[var(--foreground-muted)]">
                {vehicle.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 bg-white rounded-lg border border-[var(--border)] p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
                Features & Specifications
              </h2>
              
              <div className="space-y-6">
                {vehicle.features.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.items.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-[var(--foreground-muted)]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Vehicle Info Card */}
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                {vehicle.title}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-[var(--primary)]">
                  KES {vehicle.price.toLocaleString()}
                </span>
                {vehicle.price_negotiable && (
                  <span className="text-sm text-[var(--foreground-muted)]">Negotiable</span>
                )}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[var(--foreground)]">{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[var(--foreground)]">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-[var(--foreground)]">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span className="text-[var(--foreground)]">{vehicle.fuel_type}</span>
                </div>
              </div>

              {/* More Specs */}
              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Body Type</span>
                  <span className="text-[var(--foreground)]">{vehicle.body_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Engine</span>
                  <span className="text-[var(--foreground)]">{vehicle.engine_size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Drive Type</span>
                  <span className="text-[var(--foreground)]">{vehicle.drive_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Color</span>
                  <span className="text-[var(--foreground)]">{vehicle.color}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Condition</span>
                  <span className="text-[var(--foreground)]">Foreign Used</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">Location</span>
                  <span className="text-[var(--foreground)]">{vehicle.city}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
                Contact Seller
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{vehicle.seller.name}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{vehicle.seller.location}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${vehicle.seller.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
                <a
                  href={`https://wa.me/254700000000?text=I'm interested in ${vehicle.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20BD5A] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-[var(--primary)] text-[var(--primary)] font-medium rounded-lg hover:bg-[var(--primary)]/5 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              </div>

              {/* Enquiry Form */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">
                  Send Enquiry
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <textarea
                    placeholder="I'm interested in this vehicle..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  ></textarea>
                  <button className="w-full py-2 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)] transition-colors">
                    Send Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
