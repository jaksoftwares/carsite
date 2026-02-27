'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  Copy,
  Download,
  ChevronLeft,
  ChevronRight,
  Car,
  SlidersHorizontal,
  X
} from 'lucide-react'

// Mock data for demonstration
const mockVehicles = [
  {
    id: '1',
    title: 'Toyota Land Cruiser V8',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2023,
    price: 14500000,
    condition: 'foreign_used',
    status: 'published',
    mileage: 15000,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    images: ['/placeholder-car.jpg'],
    is_featured: true,
    views: 1245,
    created_at: '2024-01-10'
  },
  {
    id: '2',
    title: 'BMW X5 xDrive30d',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 8200000,
    condition: 'foreign_used',
    status: 'published',
    mileage: 28000,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    images: ['/placeholder-car.jpg'],
    is_featured: true,
    views: 987,
    created_at: '2024-01-08'
  },
  {
    id: '3',
    title: 'Mercedes-Benz GLE 400',
    make: 'Mercedes-Benz',
    model: 'GLE',
    year: 2023,
    price: 9500000,
    condition: 'new',
    status: 'published',
    mileage: 0,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    images: ['/placeholder-car.jpg'],
    is_featured: false,
    views: 856,
    created_at: '2024-01-05'
  },
  {
    id: '4',
    title: 'Toyota RAV4 Hybrid',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    price: 4500000,
    condition: 'new',
    status: 'draft',
    mileage: 0,
    transmission: 'CVT',
    fuel_type: 'Hybrid',
    images: ['/placeholder-car.jpg'],
    is_featured: false,
    views: 0,
    created_at: '2024-01-12'
  },
  {
    id: '5',
    title: 'Lexus RX 350 Luxury',
    make: 'Lexus',
    model: 'RX',
    year: 2022,
    price: 7200000,
    condition: 'foreign_used',
    status: 'sold',
    mileage: 35000,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    images: ['/placeholder-car.jpg'],
    is_featured: true,
    views: 2341,
    created_at: '2023-12-15'
  },
  {
    id: '6',
    title: 'Porsche Cayenne S',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2021,
    price: 11500000,
    condition: 'foreign_used',
    status: 'pending',
    mileage: 42000,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    images: ['/placeholder-car.jpg'],
    is_featured: false,
    views: 567,
    created_at: '2024-01-14'
  }
]

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  sold: 'bg-purple-100 text-purple-800',
  archived: 'bg-red-100 text-red-800'
}

const conditionLabels: Record<string, string> = {
  new: 'New',
  foreign_used: 'Foreign Used',
  locally_used: 'Locally Used',
  refurbished: 'Refurbished'
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesCondition = conditionFilter === 'all' || vehicle.condition === conditionFilter
    return matchesSearch && matchesStatus && matchesCondition
  })

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleSelectAll = () => {
    if (selectedVehicles.length === paginatedVehicles.length) {
      setSelectedVehicles([])
    } else {
      setSelectedVehicles(paginatedVehicles.map(v => v.id))
    }
  }

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicles(prev => 
      prev.includes(id) 
        ? prev.filter(v => v !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-500 mt-1">Manage your vehicle inventory</p>
        </div>
        <Link 
          href="/admin/vehicles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Vehicle
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'published').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <SlidersHorizontal size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-xl font-bold text-gray-900">{vehicles.filter(v => v.is_featured).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="sold">Sold</option>
          </select>

          {/* Condition filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Conditions</option>
            <option value="new">New</option>
            <option value="foreign_used">Foreign Used</option>
            <option value="locally_used">Locally Used</option>
            <option value="refurbished">Refurbished</option>
          </select>

          {/* Advanced filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            More
          </button>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Makes</option>
                <option value="toyota">Toyota</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="lexus">Lexus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any</option>
                <option value="0-2000000">Under 2M</option>
                <option value="2000000-5000000">2M - 5M</option>
                <option value="5000000-10000000">5M - 10M</option>
                <option value="10000000+">Above 10M</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="cvt">CVT</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk actions */}
        {selectedVehicles.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              {selectedVehicles.length} vehicle(s) selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Mark as Published
              </button>
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Mark as Sold
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicles table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.length === paginatedVehicles.length && paginatedVehicles.length > 0}
                    onChange={handleSelectAll}
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
              {paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={() => handleSelectVehicle(vehicle.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Car size={20} />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vehicle.title}</p>
                        <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.transmission} • {vehicle.fuel_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-900">{formatPrice(vehicle.price)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {conditionLabels[vehicle.condition]}
                  </td>
                  <td className="px-4 py-4">
                    {vehicle.is_featured ? (
                      <Star size={18} className="text-amber-500 fill-amber-500" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {vehicle.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/vehicle/${vehicle.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
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
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
