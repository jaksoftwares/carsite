'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { VehicleCardData } from '@/types'

interface VehicleCardProps {
  vehicle: VehicleCardData
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const {
    slug,
    title,
    year,
    price,
    price_negotiable,
    mileage,
    transmission,
    fuel_type,
    condition,
    primary_image,
    city,
    make_name,
    model_name,
    is_featured,
  } = vehicle

  // Get condition label
  const conditionLabels: Record<string, string> = {
    new: 'New',
    foreign_used: 'Foreign Used',
    locally_used: 'Locally Used',
    refurbished: 'Refurbished',
  }

  // Get fuel type label
  const fuelLabels: Record<string, string> = {
    petrol: 'Petrol',
    diesel: 'Diesel',
    electric: 'Electric',
    hybrid: 'Hybrid',
    plug_in_hybrid: 'Plug-in Hybrid',
  }

  // Get transmission label
  const transmissionLabels: Record<string, string> = {
    automatic: 'Automatic',
    manual: 'Manual',
    semi_automatic: 'Semi-Auto',
    cvt: 'CVT',
  }

  const primaryImage = primary_image || '/placeholder-car.jpg'

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-[var(--border)] card-hover">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background-alt)]">
        <Link href={`/vehicle/${slug}`}>
          <Image
            src={primaryImage}
            alt={`${year} ${make_name} ${model_name}`}
            fill
            className="object-cover image-hover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        
        {/* Featured Badge */}
        {is_featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--accent)] text-white text-xs font-medium rounded">
            Featured
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
          {conditionLabels[condition] || condition}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/vehicle/${slug}`}>
          <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-[var(--primary)]">
            {formatCurrency(price)}
          </span>
          {price_negotiable && (
            <span className="text-sm text-[var(--foreground-muted)]">Negotiable</span>
          )}
        </div>

        {/* Quick Specs */}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {year}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {formatNumber(mileage)} km
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {transmissionLabels[transmission] || transmission}
          </span>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {city}
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/vehicle/${slug}`}
            className="flex-1 px-3 py-2 text-center text-sm font-medium text-[var(--primary)] border border-[var(--primary)] rounded hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            View Details
          </Link>
          <a
            href={`https://wa.me/254700000000?text=I'm interested in ${year} ${make_name} ${model_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-center text-sm font-medium text-white bg-[#25D366] rounded hover:bg-[#20BD5A] transition-colors"
          >
            <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
