import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Financed - CarSite Kenya',
  description: 'Flexible financing options to help you own your dream car.',
}

export default function GetFinancedPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Get Financed</h1>
          <p className="text-white/80">Flexible financing options to help you own your dream car</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Financing Options</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Bank Financing</h3>
                <p className="text-[var(--foreground-muted)] text-sm mb-4">We partner with leading banks to offer competitive interest rates.</p>
                <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                  <li className="flex items-center gap-2">Competitive interest rates</li>
                  <li className="flex items-center gap-2">Up to 80% financing</li>
                  <li className="flex items-center gap-2">Flexible repayment up to 72 months</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">In-House Financing</h3>
                <p className="text-[var(--foreground-muted)] text-sm mb-4">Quick approval with minimal documentation.</p>
                <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                  <li className="flex items-center gap-2">Quick approval process</li>
                  <li className="flex items-center gap-2">Minimal documentation required</li>
                  <li className="flex items-center gap-2">Flexible down payment options</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[var(--border)] p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Apply for Financing</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Full Name</label>
                <input type="text" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
                <input type="email" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone</label>
                <input type="tel" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Vehicle Interest</label>
                <input type="text" className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Financing Amount Needed</label>
                <input type="number" className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <button type="submit" className="w-full py-3 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)]">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
