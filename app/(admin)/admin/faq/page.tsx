'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Mock data for demonstration
const mockFAQs = [
  {
    id: '1',
    question: 'What documents do I need to buy a car?',
    answer: 'You will need your National ID or Passport, proof of income (salary statement or business registration), and proof of residence (utility bill or rental agreement).',
    category: 'Buying',
    is_active: true,
    display_order: 1,
    created_at: '2023-12-01'
  },
  {
    id: '2',
    question: 'Do you offer financing options?',
    answer: 'Yes, we partner with several financial institutions to offer competitive financing options. We can help you get approved for a car loan with flexible payment terms.',
    category: 'Finance',
    is_active: true,
    display_order: 2,
    created_at: '2023-12-01'
  },
  {
    id: '3',
    question: 'Can I trade in my current car?',
    answer: 'Absolutely! We accept trade-ins. Simply bring your car for evaluation and we will provide you with a fair market value that can be used towards your new purchase.',
    category: 'Trade-in',
    is_active: true,
    display_order: 3,
    created_at: '2023-12-05'
  },
  {
    id: '4',
    question: 'What warranty do you offer on used cars?',
    answer: 'All our used cars come with a comprehensive warranty that covers major mechanical and electrical components. The warranty duration varies depending on the vehicle age and condition.',
    category: 'Warranty',
    is_active: true,
    display_order: 4,
    created_at: '2023-12-10'
  },
  {
    id: '5',
    question: 'How can I schedule a test drive?',
    answer: 'You can schedule a test drive by calling our showroom, using the contact form on our website, or visiting us directly at our location. We recommend scheduling at least 24 hours in advance.',
    category: 'Services',
    is_active: false,
    display_order: 5,
    created_at: '2023-12-15'
  },
  {
    id: '6',
    question: 'Do you offer delivery services?',
    answer: 'Yes, we offer delivery services within Kenya. Delivery charges vary based on the distance and location. Contact us for more details.',
    category: 'Services',
    is_active: true,
    display_order: 6,
    created_at: '2023-12-20'
  }
]

const categories = ['All', 'Buying', 'Finance', 'Trade-in', 'Warranty', 'Services']

export default function FAQPage() {
  const [faqs, setFaqs] = useState(mockFAQs)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && faq.is_active) ||
      (statusFilter === 'inactive' && !faq.is_active)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage)
  const paginatedFAQs = filteredFAQs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleFAQ = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const toggleActive = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, is_active: !faq.is_active } : faq
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Add FAQ
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total FAQs</p>
              <p className="text-xl font-bold text-gray-900">{faqs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ToggleRight size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900">{faqs.filter(f => f.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ToggleLeft size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-xl font-bold text-gray-900">{faqs.filter(f => !f.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <HelpCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-xl font-bold text-gray-900">{categories.length - 1}</p>
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
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? 'all' : cat}>{cat}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {paginatedFAQs.map((faq) => (
            <div 
              key={faq.id} 
              className={`p-4 ${!faq.is_active ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Drag handle */}
                <button className="p-2 text-gray-400 hover:text-gray-600 cursor-grab">
                  <GripVertical size={20} />
                </button>

                {/* Expand/Collapse */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  {expandedId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mt-1">
                        {faq.category}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleActive(faq.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          faq.is_active 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={faq.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {faq.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      
                      <button
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expandedId === faq.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {paginatedFAQs.length === 0 && (
          <div className="p-12 text-center">
            <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No FAQs found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFAQs.length)} of {filteredFAQs.length} FAQs
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
