'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  MoreVertical,
  Check,
  X
} from 'lucide-react'

export interface VehicleTableItem {
  id: string
  title: string
  make?: { name: string }
  model?: { name: string }
  year: number
  price: number
  condition: string
  status: string
  mileage?: number
  transmission?: string
  fuel_type?: string
  is_featured: boolean
  view_count?: number
  images?: { url: string; is_primary: boolean }[]
  primary_image?: string
  created_at: string
}

interface VehicleTableProps {
  vehicles: VehicleTableItem[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: () => void
  onDelete: (id: string) => void
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-amber-100 text-amber-800',
  active: 'bg-green-100 text-green-800',
  sold: 'bg-purple-100 text-purple-800',
  inactive: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800'
}

const conditionLabels: Record<string, string> = {
  new: 'New',
  foreign_used: 'Foreign Used',
  locally_used: 'Locally Used',
  refurbished: 'Refurbished'
}

export default function VehicleTable({ 
  vehicles, 
  selectedIds, 
  onSelect, 
  onSelectAll,
  onDelete 
}: VehicleTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === vehicles.length && vehicles.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(vehicle.id)}
                    onChange={() => onSelect(vehicle.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {vehicle.primary_image ? (
                        <img 
                          src={vehicle.primary_image}
                          alt={vehicle.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{vehicle.title}</p>
                      <p className="text-sm text-gray-500">
                        {vehicle.year} • {vehicle.transmission} • {vehicle.fuel_type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-gray-900">{formatPrice(vehicle.price)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[vehicle.status] || statusColors.draft}`}>
                    {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1) || 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {conditionLabels[vehicle.condition] || vehicle.condition}
                </td>
                <td className="px-4 py-4">
                  {vehicle.is_featured ? (
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {(vehicle.view_count || 0).toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/vehicles/${vehicle.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/vehicles/${vehicle.id}/edit`}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
