'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Clock,
  DollarSign,
  Car,
  Gauge,
  Fuel,
  Settings,
  Palette,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  Share2,
  Loader2,
  MoreVertical,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  MapPinIcon,
  User,
  FileText
} from 'lucide-react'

// Mock vehicle data for demo
const mockVehicle = {
  id: '1',
  title: 'Toyota Land Cruiser V8',
  slug: 'toyota-land-cruiser-v8',
  make: { id: '1', name: 'Toyota', slug: 'toyota' },
  model: { id: '1', name: 'Land Cruiser', slug: 'land-cruiser' },
  trim: 'TX L Package',
  year: 2023,
  condition: 'foreign_used',
  condition_label: 'Foreign Used',
  body_type: 'SUV',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  drive_type: '4WD',
  mileage: 15000,
  engine_size: '4.0L',
  horsepower: 271,
  exterior_color: 'Pearl White',
  interior_color: 'Black Leather',
  vin: 'JM1BK343551234567',
  registration_number: 'KAA 123A',
  first_registration_date: '2023-01-15',
  door_count: 4,
  seat_count: 7,
  fuel_efficiency: '10 km/L',
  emission_standard: 'Euro 5',
  price: 14500000,
  price_negotiable: true,
  financing_available: true,
  description: `This is a pristine Toyota Land Cruiser V8 in excellent condition. It features a powerful 4.0L V6 engine producing 271 horsepower, paired with a smooth 6-speed automatic transmission. The vehicle comes with full-time 4WD capability, making it perfect for both city driving and off-road adventures.

The interior features premium leather seats with heating and ventilation functions for the front passengers. The panoramic sunroof provides excellent natural lighting, and the JBL premium audio system delivers exceptional sound quality.

Safety features include:
- Toyota Safety Sense suite
- Pre-collision system
- Lane departure alert
- Adaptive cruise control
- 10 airbags throughout the vehicle

This vehicle has been meticulously maintained with full service history available. It comes with a 3-month warranty for peace of mind.`,
  highlights: [
    'Full Toyota Service History',
    '3-Month Warranty Included',
    'Financing Available',
    'Trade-ins Accepted',
    'Inspections Welcome'
  ],
  specifications: {
    'Engine': '4.0L V6',
    'Horsepower': '271 hp',
    'Torque': '385 Nm',
    'Transmission': '6-Speed Automatic',
    'Drive Type': 'Full-Time 4WD',
    'Fuel Type': 'Petrol',
    'Fuel Efficiency': '10 km/L',
    'Brakes': 'Ventilated Disc',
    'Suspension': 'Double Wishbone',
    'Cargo Capacity': '1200 L'
  },
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200', is_primary: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200', is_primary: false },
    { id: '3', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200', is_primary: false },
    { id: '4', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200', is_primary: false },
    { id: '5', url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200', is_primary: false }
  ],
  video_url: '',
  features: [
    'Airbags', 'Leather Seats', 'Sunroof', 'Navigation System', 'Reverse Camera',
    'Parking Sensors', 'Blind Spot Monitoring', 'Lane Departure Warning',
    'Adaptive Cruise Control', 'Heated Seats', 'Ventilated Seats', 'Premium Audio'
  ],
  location: 'Nairobi',
  city: 'Nairobi',
  is_featured: true,
  is_premium: true,
  status: 'active',
  status_label: 'Active',
  view_count: 1245,
  inquiry_count: 23,
  created_at: '2024-01-10T10:00:00Z',
  published_at: '2024-01-12T10:00:00Z'
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-amber-100 text-amber-800',
  active: 'bg-green-100 text-green-800',
  sold: 'bg-purple-100 text-purple-800',
  inactive: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800'
}

const conditionColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  foreign_used: 'bg-green-100 text-green-800',
  locally_used: 'bg-amber-100 text-amber-800',
  refurbished: 'bg-purple-100 text-purple-800'
}

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicleId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [vehicle, setVehicle] = useState<typeof mockVehicle | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    // Simulate loading vehicle data
    setTimeout(() => {
      setVehicle(mockVehicle)
      setIsLoading(false)
    }, 500)
  }, [vehicleId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const nextImage = () => {
    if (vehicle) {
      setCurrentImageIndex(prev => 
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (vehicle) {
      setCurrentImageIndex(prev => 
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading vehicle...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vehicle not found</p>
        <Link href="/admin/vehicles" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to vehicles
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/vehicles"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{vehicle.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
                {vehicle.status_label}
              </span>
              {vehicle.is_featured && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              )}
            </div>
            <p className="text-gray-500 mt-1">Added on {formatDate(vehicle.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/vehicle/${vehicle.slug}`}
            target="_blank"
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye size={18} />
            View Public Page
          </Link>
          <Link
            href={`/admin/vehicles/${vehicle.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit size={18} />
            Edit Vehicle
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Views</p>
              <p className="text-xl font-bold text-gray-900">{vehicle.view_count.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Enquiries</p>
              <p className="text-xl font-bold text-gray-900">{vehicle.inquiry_count}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-xl font-bold text-gray-900">{formatDate(vehicle.published_at)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <DollarSign size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(vehicle.price)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Main image */}
            <div className="relative aspect-[16/9] bg-gray-100">
              <img
                src={vehicle.images[currentImageIndex]?.url}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded">
                {currentImageIndex + 1} / {vehicle.images.length}
              </div>
              {vehicle.is_featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded flex items-center gap-1">
                  <Star size={14} className="fill-white" />
                  Featured
                </div>
              )}
            </div>
            
            {/* Thumbnail strip */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick specs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Year</p>
                  <p className="font-medium text-gray-900">{vehicle.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Gauge size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mileage</p>
                  <p className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transmission</p>
                  <p className="font-medium text-gray-900">{vehicle.transmission}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Fuel size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fuel Type</p>
                  <p className="font-medium text-gray-900">{vehicle.fuel_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Car size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Body Type</p>
                  <p className="font-medium text-gray-900">{vehicle.body_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Drive Type</p>
                  <p className="font-medium text-gray-900">{vehicle.drive_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Palette size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Exterior</p>
                  <p className="font-medium text-gray-900">{vehicle.exterior_color}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Engine</p>
                  <p className="font-medium text-gray-900">{vehicle.engine_size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed specifications */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(vehicle.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Options</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
              {vehicle.description}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Buy From Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicle.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Asking Price</p>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(vehicle.price)}</p>
            </div>
            <div className="space-y-3">
              {vehicle.price_negotiable && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  Price is negotiable
                </div>
              )}
              {vehicle.financing_available && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" />
                  Financing available
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Request Information
              </button>
              <button className="w-full px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Schedule Test Drive
              </button>
            </div>
          </div>

          {/* Vehicle details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Condition</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${conditionColors[vehicle.condition]}`}>
                  {vehicle.condition_label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Make</span>
                <span className="font-medium text-gray-900">{vehicle.make.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Model</span>
                <span className="font-medium text-gray-900">{vehicle.model.name}</span>
              </div>
              {vehicle.trim && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trim</span>
                  <span className="font-medium text-gray-900">{vehicle.trim}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Year</span>
                <span className="font-medium text-gray-900">{vehicle.year}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mileage</span>
                <span className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transmission</span>
                <span className="font-medium text-gray-900">{vehicle.transmission}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fuel Type</span>
                <span className="font-medium text-gray-900">{vehicle.fuel_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Drive Type</span>
                <span className="font-medium text-gray-900">{vehicle.drive_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Body Type</span>
                <span className="font-medium text-gray-900">{vehicle.body_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Engine Size</span>
                <span className="font-medium text-gray-900">{vehicle.engine_size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Exterior Color</span>
                <span className="font-medium text-gray-900">{vehicle.exterior_color}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Interior Color</span>
                <span className="font-medium text-gray-900">{vehicle.interior_color}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Doors</span>
                <span className="font-medium text-gray-900">{vehicle.door_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Seats</span>
                <span className="font-medium text-gray-900">{vehicle.seat_count}</span>
              </div>
            </div>
          </div>

          {/* Registration info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration & VIN</h2>
            <div className="space-y-4">
              {vehicle.registration_number && (
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium text-gray-900">{vehicle.registration_number}</p>
                </div>
              )}
              {vehicle.vin && (
                <div>
                  <p className="text-sm text-gray-500">VIN</p>
                  <p className="font-medium text-gray-900 font-mono text-sm">{vehicle.vin}</p>
                </div>
              )}
              {vehicle.first_registration_date && (
                <div>
                  <p className="text-sm text-gray-500">First Registration</p>
                  <p className="font-medium text-gray-900">{formatDate(vehicle.first_registration_date)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="flex items-center gap-3">
              <MapPinIcon size={20} className="text-gray-400" />
              <span className="text-gray-900">{vehicle.location}, {vehicle.city}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Star size={18} className={vehicle.is_featured ? 'text-amber-500 fill-amber-500' : ''} />
                {vehicle.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
              </button>
              <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Share2 size={18} />
                Share Vehicle
              </button>
              <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={18} />
                Delete Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
