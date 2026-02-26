import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - CarSite Kenya',
  description: 'Latest car news, buying guides, and tips from CarSite Kenya.',
}

const blogPosts = [
  {
    id: '1',
    slug: 'buying-first-car-kenya',
    title: 'Buying Your First Car in Kenya: A Complete Guide',
    excerpt: 'Everything you need to know about buying your first car in Kenya, from budgeting to paperwork.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    date: 'January 20, 2024',
    category: 'Buying Guide',
  },
  {
    id: '2',
    slug: 'suv-vs-sedan-kenya',
    title: 'SUV vs Sedan: Which is Right for You?',
    excerpt: 'Comparing the pros and cons of SUVs and sedans for Kenyan roads and lifestyles.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    date: 'January 15, 2024',
    category: 'Car Reviews',
  },
  {
    id: '3',
    slug: 'car-maintenance-tips',
    title: 'Essential Car Maintenance Tips for Kenyan Weather',
    excerpt: 'Keep your car running smoothly with these maintenance tips tailored to Kenyan conditions.',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
    date: 'January 10, 2024',
    category: 'Maintenance',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Blog</h1>
          <p className="text-white/80">Latest news, tips, and guides</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-lg border border-[var(--border)] overflow-hidden card-hover">
              <div className="relative aspect-[16/9] bg-[var(--background-alt)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-[var(--primary)] text-white text-xs rounded">{post.category}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-[var(--foreground-muted)] mb-2">{post.date}</p>
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
