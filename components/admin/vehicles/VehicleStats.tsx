'use client'

import { 
  Car, 
  Eye, 
  Star, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Archive
} from 'lucide-react'

interface VehicleStatsProps {
  stats: {
    total: number
    active: number
    pending: number
    draft: number
    sold: number
    featured: number
    views: number
    enquiries: number
  }
}

const statusConfig = [
  { key: 'total', label: 'Total Vehicles', icon: Car, color: 'bg-blue-100 text-blue-600', iconBg: 'bg-blue-100' },
  { key: 'active', label: 'Active Listings', icon: CheckCircle, color: 'bg-green-100 text-green-600', iconBg: 'bg-green-100' },
  { key: 'pending', label: 'Pending Review', icon: Clock, color: 'bg-amber-100 text-amber-600', iconBg: 'bg-amber-100' },
  { key: 'draft', label: 'Drafts', icon: Archive, color: 'bg-gray-100 text-gray-600', iconBg: 'bg-gray-100' },
  { key: 'sold', label: 'Sold', icon: DollarSign, color: 'bg-purple-100 text-purple-600', iconBg: 'bg-purple-100' },
  { key: 'featured', label: 'Featured', icon: Star, color: 'bg-amber-100 text-amber-600', iconBg: 'bg-amber-100' }
]

export default function VehicleStats({ stats }: VehicleStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statusConfig.map((item) => {
        const Icon = item.icon
        const value = item.key === 'views' 
          ? stats.views?.toLocaleString() || '0'
          : item.key === 'enquiries'
          ? stats.enquiries?.toLocaleString() || '0'
          : stats[item.key as keyof typeof stats] || 0
        
        return (
          <div 
            key={item.key}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.iconBg}`}>
                <Icon size={20} className={item.color.replace('bg-', 'text-').split(' ')[1]} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
