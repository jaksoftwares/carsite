'use client'

import { Search, Filter, X } from 'lucide-react'

interface VehicleFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  condition: string
  onConditionChange: (value: string) => void
  make: string
  onMakeChange: (value: string) => void
  showAdvanced: boolean
  onToggleAdvanced: () => void
}

export default function VehicleFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  condition,
  onConditionChange,
  make,
  onMakeChange,
  showAdvanced,
  onToggleAdvanced
}: VehicleFiltersProps) {
  const makes = [
    { value: '', label: 'All Makes' },
    { value: 'toyota', label: 'Toyota' },
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'lexus', label: 'Lexus' },
    { value: 'porsche', label: 'Porsche' },
    { value: 'audi', label: 'Audi' }
  ]

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'archived', label: 'Archived' }
  ]

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'foreign_used', label: 'Foreign Used' },
    { value: 'locally_used', label: 'Locally Used' },
    { value: 'refurbished', label: 'Refurbished' }
  ]

  const hasActiveFilters = search || status !== 'all' || condition !== 'all' || make

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search vehicles by title, VIN, or registration..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Condition filter */}
        <select
          value={condition}
          onChange={(e) => onConditionChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {conditions.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Advanced filters button */}
        <button
          onClick={onToggleAdvanced}
          className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showAdvanced || hasActiveFilters 
              ? 'border-blue-300 bg-blue-50 text-blue-700' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Filter size={18} />
          {showAdvanced ? 'Hide' : 'More'}
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
            <select 
              value={make}
              onChange={(e) => onMakeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {makes.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Any</option>
              {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
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

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
              Search: {search}
              <button onClick={() => onSearchChange('')} className="hover:text-blue-900">
                <X size={14} />
              </button>
            </span>
          )}
          {status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
              Status: {status}
              <button onClick={() => onStatusChange('all')} className="hover:text-green-900">
                <X size={14} />
              </button>
            </span>
          )}
          {condition !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-sm rounded">
              Condition: {condition.replace('_', ' ')}
              <button onClick={() => onConditionChange('all')} className="hover:text-amber-900">
                <X size={14} />
              </button>
            </span>
          )}
          {make && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
              Make: {make}
              <button onClick={() => onMakeChange('')} className="hover:text-purple-900">
                <X size={14} />
              </button>
            </span>
          )}
          <button 
            onClick={() => {
              onSearchChange('')
              onStatusChange('all')
              onConditionChange('all')
              onMakeChange('')
            }}
            className="text-sm text-red-600 hover:text-red-700 ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
