'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Car, 
  Users, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

// Mock data for demonstration
const statsCards = [
  {
    title: 'Total Vehicles',
    value: '248',
    change: '+12%',
    changeType: 'positive',
    icon: Car,
    color: 'blue'
  },
  {
    title: 'Active Enquiries',
    value: '56',
    change: '+8%',
    changeType: 'positive',
    icon: MessageSquare,
    color: 'green'
  },
  {
    title: 'Total Views',
    value: '12.5K',
    change: '+24%',
    changeType: 'positive',
    icon: Eye,
    color: 'purple'
  },
  {
    title: 'Featured Listings',
    value: '18',
    change: '-2%',
    changeType: 'negative',
    icon: Star,
    color: 'amber'
  }
]

const recentEnquiries = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+254 712 345 678',
    vehicle: 'Toyota Prado TX',
    date: '2024-01-15',
    status: 'new'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+254 733 987 654',
    vehicle: 'BMW X5 xDrive30d',
    date: '2024-01-15',
    status: 'contacted'
  },
  {
    id: '3',
    name: 'Michael Chen',
    phone: '+254 721 234 567',
    vehicle: 'Mercedes-Benz GLE',
    date: '2024-01-14',
    status: 'new'
  },
  {
    id: '4',
    name: 'Emily Wilson',
    phone: '+254 757 111 222',
    vehicle: 'Toyota Rav4',
    date: '2024-01-14',
    status: 'closed'
  }
]

const recentListings = [
  {
    id: '1',
    title: 'Toyota Land Cruiser V8',
    price: 'KSh 14,500,000',
    status: 'published',
    views: 342,
    date: '2024-01-15'
  },
  {
    id: '2',
    title: 'BMW 530i M Sport',
    price: 'KSh 8,200,000',
    status: 'draft',
    views: 0,
    date: '2024-01-14'
  },
  {
    id: '3',
    title: 'Mercedes-Benz C300',
    price: 'KSh 6,800,000',
    status: 'pending',
    views: 89,
    date: '2024-01-13'
  }
]

const topVehicles = [
  { name: 'Toyota Prado TX', views: 1245, enquiries: 18 },
  { name: 'BMW X5 xDrive30d', views: 987, enquiries: 12 },
  { name: 'Mercedes-Benz GLE', views: 856, enquiries: 9 },
  { name: 'Toyota Rav4 Hybrid', views: 743, enquiries: 7 },
  { name: 'Lexus RX 350', views: 621, enquiries: 5 }
]

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-amber-100 text-amber-800',
  closed: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  sold: 'bg-purple-100 text-purple-800'
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your dealership.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Car size={18} />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
            <Link 
              href="/admin/enquiries" 
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{enquiry.name}</p>
                        <p className="text-sm text-gray-500">{enquiry.phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{enquiry.vehicle}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {enquiry.date}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[enquiry.status]}`}>
                        {enquiry.status === 'new' && <AlertCircle size={12} className="mr-1" />}
                        {enquiry.status === 'contacted' && <Clock size={12} className="mr-1" />}
                        {enquiry.status === 'closed' && <CheckCircle size={12} className="mr-1" />}
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Vehicles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Vehicles</h2>
            <Link 
              href="/admin/vehicles" 
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {topVehicles.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 text-sm">{vehicle.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Eye size={14} />
                    {vehicle.views}
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <MessageSquare size={14} />
                    {vehicle.enquiries}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Listings</h2>
          <Link 
            href="/admin/vehicles" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900">{listing.title}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{listing.price}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[listing.status]}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {listing.views}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{listing.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/admin/vehicles/new"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
            <Car className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add New Vehicle</h3>
            <p className="text-sm text-gray-500">List a new car in your inventory</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/enquiries"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-600 transition-colors">
            <MessageSquare className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Manage Enquiries</h3>
            <p className="text-sm text-gray-500">View and respond to customer inquiries</p>
          </div>
        </Link>

        <Link 
          href="/admin/settings"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-600 transition-colors">
            <DollarSign className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Site Settings</h3>
            <p className="text-sm text-gray-500">Configure your website settings</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
