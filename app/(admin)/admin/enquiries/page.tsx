'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Phone, 
  Mail,
  MessageSquare,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Car,
  User,
  MapPin
} from 'lucide-react'

// Mock data for demonstration
const mockEnquiries = [
  {
    id: '1',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '+254 712 345 678',
    vehicle_id: '1',
    vehicle_title: 'Toyota Land Cruiser V8',
    message: 'I am interested in this vehicle. Is it still available? Can I schedule a test drive?',
    source: 'website',
    status: 'new',
    created_at: '2024-01-15 10:30'
  },
  {
    id: '2',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@example.com',
    customer_phone: '+254 733 987 654',
    vehicle_id: '2',
    vehicle_title: 'BMW X5 xDrive30d',
    message: 'Hello, I would like to know more about the financing options for this car.',
    source: 'whatsapp',
    status: 'contacted',
    created_at: '2024-01-15 09:15'
  },
  {
    id: '3',
    customer_name: 'Michael Chen',
    customer_email: 'michael@example.com',
    customer_phone: '+254 721 234 567',
    vehicle_id: '3',
    vehicle_title: 'Mercedes-Benz GLE 400',
    message: 'Is the price negotiable? What is the lowest you can go?',
    source: 'website',
    status: 'new',
    created_at: '2024-01-14 16:45'
  },
  {
    id: '4',
    customer_name: 'Emily Wilson',
    customer_email: 'emily@example.com',
    customer_phone: '+254 757 111 222',
    vehicle_id: null,
    vehicle_title: 'General Inquiry',
    message: 'I am looking for a family SUV. What do you recommend in the 5-7M range?',
    source: 'website',
    status: 'in_progress',
    created_at: '2024-01-14 14:20'
  },
  {
    id: '5',
    customer_name: 'David Brown',
    customer_email: 'david@example.com',
    customer_phone: '+254 700 888 999',
    vehicle_id: '5',
    vehicle_title: 'Toyota RAV4 Hybrid',
    message: 'Can I come see the car tomorrow?',
    source: 'call',
    status: 'completed',
    created_at: '2024-01-13 11:00'
  },
  {
    id: '6',
    customer_name: 'Lisa Anderson',
    customer_email: 'lisa@example.com',
    customer_phone: '+254 733 444 555',
    vehicle_id: '6',
    vehicle_title: 'Lexus RX 350 Luxury',
    message: 'Interested in this vehicle. Please contact me ASAP.',
    source: 'whatsapp',
    status: 'new',
    created_at: '2024-01-13 08:30'
  }
]

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800'
}

const sourceIcons: Record<string, React.ReactNode> = {
  website: <MessageSquare size={14} />,
  whatsapp: <MessageSquare size={14} />,
  call: <Phone size={14} />
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState(mockEnquiries)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEnquiry, setSelectedEnquiry] = useState<typeof mockEnquiries[0] | null>(null)
  const itemsPerPage = 10

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.vehicle_title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter
    const matchesSource = sourceFilter === 'all' || enquiry.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage)
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const newCount = enquiries.filter(e => e.status === 'new').length
  const inProgressCount = enquiries.filter(e => e.status === 'in_progress').length

  const handleSelectAll = () => {
    if (selectedEnquiries.length === paginatedEnquiries.length) {
      setSelectedEnquiries([])
    } else {
      setSelectedEnquiries(paginatedEnquiries.map(e => e.id))
    }
  }

  const handleSelectEnquiry = (id: string) => {
    setSelectedEnquiries(prev => 
      prev.includes(id) 
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 mt-1">Manage customer enquiries and leads</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New</p>
              <p className="text-xl font-bold text-gray-900">{newCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-gray-900">{enquiries.filter(e => e.status === 'completed').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">{enquiries.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Source filter */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Call</option>
              </select>
            </div>
          </div>

          {/* Enquiries table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedEnquiries.length === paginatedEnquiries.length && paginatedEnquiries.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedEnquiries.map((enquiry) => (
                    <tr 
                      key={enquiry.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedEnquiry?.id === enquiry.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedEnquiries.includes(enquiry.id)}
                          onChange={() => handleSelectEnquiry(enquiry.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{enquiry.customer_name}</p>
                          <p className="text-sm text-gray-500">{enquiry.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Car size={14} />
                          {enquiry.vehicle_title}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                          {sourceIcons[enquiry.source]}
                          {enquiry.source}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[enquiry.status]}`}>
                          {enquiry.status === 'new' && <AlertCircle size={12} />}
                          {enquiry.status === 'contacted' && <Clock size={12} />}
                          {enquiry.status === 'completed' && <CheckCircle size={12} />}
                          {enquiry.status.replace('_', ' ').charAt(0).toUpperCase() + enquiry.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {enquiry.created_at}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} /></button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
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

        {/* Enquiry details panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-fit">
          {selectedEnquiry ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Enquiry Details</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedEnquiry.status]}`}>
                  {selectedEnquiry.status.replace('_', ' ').charAt(0).toUpperCase() + selectedEnquiry.status.replace('_', ' ').slice(1)}
                </span>
              </div>

              {/* Customer info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedEnquiry.customer_name}</p>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${selectedEnquiry.customer_phone}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.customer_phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${selectedEnquiry.customer_email}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.customer_email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Vehicle info */}
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-sm text-gray-500 mb-1">Interested in</p>
                <div className="flex items-center gap-2">
                  <Car size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{selectedEnquiry.vehicle_title}</span>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <p className="text-gray-700">{selectedEnquiry.message}</p>
              </div>

              {/* Meta info */}
              <div className="text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} />
                  <span>{selectedEnquiry.created_at}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} />
                  <span className="capitalize">via {selectedEnquiry.source}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone size={18} />
                  Contact Customer
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageSquare size={18} />
                  Send Reply
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Mark as Contacted</option>
                    <option>Mark as In Progress</option>
                    <option>Mark as Completed</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Assign to...</option>
                    <option>John Doe</option>
                    <option>Sarah Johnson</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
