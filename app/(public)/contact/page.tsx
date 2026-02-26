import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - CarSite Kenya',
  description: 'Get in touch with CarSite Kenya. Contact us for car sales, financing, or general inquiries.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-white/80">We are here to help with all your vehicle needs</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg border border-[var(--border)] p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">First Name *</label>
                  <input type="text" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Last Name *</label>
                  <input type="text" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email Address *</label>
                <input type="email" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Subject *</label>
                <select required className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white">
                  <option value="">Select a subject</option>
                  <option value="sales">Vehicle Sales Inquiry</option>
                  <option value="financing">Financing Questions</option>
                  <option value="sell">Sell Your Car</option>
                  <option value="support">Customer Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Message *</label>
                <textarea required rows={5} className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)] transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Phone</h3>
                <p className="text-[var(--foreground-muted)] text-sm">+254 700 000 000</p>
              </div>
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Email</h3>
                <p className="text-[var(--foreground-muted)] text-sm">info@carsite.co.ke</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Visit Us</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                CarSite Kenya Ltd<br />
                Nairobi, Kenya
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Business Hours</h3>
              <p className="text-[var(--foreground-muted)] text-sm">
                Monday - Saturday: 8:00 AM - 6:00 PM<br />
                Sunday: 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
