import type { Metadata } from 'next'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata: Metadata = {
  title: {
    default: 'CarSite Kenya - Quality Cars for Sale',
    template: '%s | CarSite Kenya',
  },
  description: 'Your trusted partner for quality vehicles in Kenya. Browse new and used cars, get financing, or sell your car with CarSite.',
  keywords: ['cars', 'vehicles', 'car dealership', 'kenya', 'new cars', 'used cars', 'car sales', 'auto'],
  authors: [{ name: 'CarSite Kenya' }],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: 'CarSite Kenya',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
