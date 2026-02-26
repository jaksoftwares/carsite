'use strict';
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function VehicleSort({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', e.target.value);
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <select 
      defaultValue={defaultValue} 
      className="px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
      onChange={handleSortChange}
    >
      <option value="created_at">Newest Arrivals</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="year">Year: Newest</option>
      <option value="mileage">Mileage: Lowest</option>
    </select>
  );
}
