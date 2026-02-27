'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  MessageSquare, 
  Car,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Mock data for demonstration
const statsCards = [
  {
    title: 'Total Views',
    value: '45,231',
    change: '+12.5%',
    changeType: 'positive',
    icon: Eye,
    color: 'blue'
  },
  {
    title: 'Unique Visitors',
    value: '12,456',
    change: '+8.2%',
    changeType: 'positive',
    icon: Users,
    color: 'green'
  },
  {
    title: 'Total Enquiries',
    value: '342',
    change: '+15.3%',
    changeType: 'positive',
    icon: MessageSquare,
    color: 'purple'
  },
  {
    title: 'Vehicles Listed',
    value: '248',
    change: '-2.1%',
    changeType: 'negative',
    icon: Car,
    color: 'amber'
  }
]

const topVehicles = [
  { name: 'Toyota Prado TX', views: 4521, enquiries: 42, conversion: '2.1%' },
  { name: 'BMW X5 xDrive30d', views: 3842, enquiries: 35, conversion: '1.8%' },
  { name: 'Mercedes-Benz GLE', views: 3102, enquiries: 28, conversion: '1.5%' },
  { name: 'Toyota Rav4 Hybrid', views: 2876, enquiries: 24, conversion: '1.3%' },
  { name: 'Lexus RX 350', views: 2453, enquiries: 19, conversion: '1.1%' }
]

const topMakes = [
  { name: 'Toyota', percentage: 35, vehicles: 87 },
  { name: 'BMW', percentage: 22, vehicles: 55 },
  { name: 'Mercedes-Benz', percentage: 18, vehicles: 45 },
  { name: 'Lexus', percentage: 12, vehicles: 30 },
  { name: 'Others', percentage: 13, vehicles: 31 }
]

const monthlyData = [
  { month: 'Aug', views: 3200, enquiries: 45 },
  { month: 'Sep', views: 3800, enquiries: 52 },
  { month: 'Oct', views: 4100, enquiries: 61 },
  { month: 'Nov', views: 3900, enquiries: 55 },
  { month: 'Dec', views: 4500, enquiries: 72 },
  { month: 'Jan', views: 5200, enquiries: 85 }
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your website performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 h-48">
                  <div 
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative group"
                    style={{ height: `${(data.views / 5200) * 100}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {data.views.toLocaleString()} views
                    </div>
                  </div>
                  <div 
                    className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors relative group"
                    style={{ height: `${(data.enquiries / 85) * 100}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {data.enquiries} enquiries
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Enquiries</span>
            </div>
          </div>
        </div>

        {/* Top Makes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Makes</h2>
          <div className="space-y-4">
            {topMakes.map((make, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{make.name}</span>
                  <span className="text-sm text-gray-500">{make.vehicles} vehicles</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${make.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Vehicles Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Vehicles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enquiries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topVehicles.map((vehicle, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{vehicle.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye size={16} />
                      {vehicle.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageSquare size={16} />
                      {vehicle.enquiries}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {vehicle.conversion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">G</span>
                </div>
                <span className="text-gray-700">Google</span>
              </div>
              <span className="font-medium text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">F</span>
                </div>
                <span className="text-gray-700">Facebook</span>
              </div>
              <span className="font-medium text-gray-900">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <span className="text-sky-600 font-bold">T</span>
                </div>
                <span className="text-gray-700">Twitter</span>
              </div>
              <span className="font-medium text-gray-900">12%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold">D</span>
                </div>
                <span className="text-gray-700">Direct</span>
              </div>
              <span className="font-medium text-gray-900">15%</span>
            </div>
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="150.8 251.2" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-150.8" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="37.7 251.2" strokeDashoffset="-213.6" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Mobile (60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Desktop (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded" />
              <span className="text-sm text-gray-600">Tablet (15%)</span>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
          <div className="space-y-3">
            <div className="relative">
              <div className="h-10 bg-blue-500 rounded flex items-center justify-between px-4">
                <span className="text-white font-medium">Page Views</span>
                <span className="text-white">45,231</span>
              </div>
            </div>
            <div className="relative" style={{ width: '80%' }}>
              <div className="h-10 bg-blue-400 rounded flex items-center justify-between px-4">
                <span className="text-white font-medium">Vehicle Views</span>
                <span className="text-white">28,456</span>
              </div>
            </div>
            <div className="relative" style={{ width: '60%' }}>
              <div className="h-10 bg-blue-300 rounded flex items-center justify-between px-4">
                <span className="text-white font-medium">Enquiries</span>
                <span className="text-white">342</span>
              </div>
            </div>
            <div className="relative" style={{ width: '40%' }}>
              <div className="h-10 bg-green-500 rounded flex items-center justify-between px-4">
                <span className="text-white font-medium">Sales</span>
                <span className="text-white">28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
