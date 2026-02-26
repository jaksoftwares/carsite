import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Your Car - CarSite Kenya',
  description: 'Sell your car quickly and easily. We buy all makes and models at fair market prices.',
}

export default function SellYourCarPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Sell Your Car</h1>
          <p className="text-white/80">Turn your vehicle into cash quickly</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-[var(--border)] p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Get a Quote</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Make</label>
                  <select required className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-white">
                    <option value="">Select Make</option>
                    <option value="toyota">Toyota</option>
                    <option value="mercedes">Mercedes-Benz</option>
                    <option value="bmw">BMW</option>
                    <option value="honda">Honda</option>
                    <option value="nissan">Nissan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Model</label>
                  <input type="text" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Year</label>
                  <input type="number" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Mileage (km)</label>
                  <input type="number" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Condition</label>
                <select required className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-white">
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="foreign_used">Foreign Used</option>
                  <option value="locally_used">Locally Used</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Expected Price (KES)</label>
                <input type="number" className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Your Name</label>
                <input type="text" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone Number</label>
                <input type="tel" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
                <input type="email" required className="w-full px-4 py-2 border border-[var(--border)] rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Additional Details</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-[var(--border)] rounded-md"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-light)]">
                Get Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
