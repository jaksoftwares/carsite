import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - CarSite Kenya',
  description: 'Learn about CarSite Kenya, your trusted partner for quality vehicles in Kenya.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">About Us</h1>
          <p className="text-white/80">Your trusted partner for quality vehicles in Kenya</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Mission Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Our Mission</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed mb-6">
            CarSite Kenya was established with a clear mission: to simplify the car buying process in Kenya. 
            We believe that everyone deserves access to quality vehicles at transparent prices, with professional 
            support throughout their purchase journey.
          </p>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            Our team is dedicated to providing exceptional customer service, ensuring that every client finds 
            the perfect vehicle to match their needs and budget. We have built strong relationships with 
            trusted dealers and financial institutions to offer comprehensive solutions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg border border-[var(--border)] p-6 text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">500+</div>
            <div className="text-sm text-[var(--foreground-muted)]">Vehicles Sold</div>
          </div>
          <div className="bg-white rounded-lg border border-[var(--border)] p-6 text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">50+</div>
            <div className="text-sm text-[var(--foreground-muted)]">Trusted Dealers</div>
          </div>
          <div className="bg-white rounded-lg border border-[var(--border)] p-6 text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">10K+</div>
            <div className="text-sm text-[var(--foreground-muted)]">Happy Customers</div>
          </div>
          <div className="bg-white rounded-lg border border-[var(--border)] p-6 text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">15</div>
            <div className="text-sm text-[var(--foreground-muted)]">Years Experience</div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Trust & Integrity</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                We build lasting relationships through honest dealings and transparent practices.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Excellence</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                We strive for excellence in every aspect of our service delivery.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Customer Focus</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Our customers are at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center">Why Choose CarSite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Verified Inventory</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Every vehicle undergoes a comprehensive inspection to ensure quality and authenticity. We verify 
                documentation and vehicle history to give you peace of mind.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Transparent Pricing</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                No hidden fees or surprise charges. The price you see is the price you pay. We believe in 
                clear, upfront pricing for all our vehicles.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Flexible Financing</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                We partner with leading financial institutions to offer competitive financing options tailored 
                to your budget and credit profile.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Nationwide Delivery</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Regardless of your location in Kenya, we can arrange secure transportation of your 
                purchased vehicle to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
