'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { 
  Check, 
  Image as ImageIcon, 
  Upload, 
  X,
  Star,
  Trash2,
  Loader2,
  Plus
} from 'lucide-react'

export interface VehicleFormData {
  // Basic Info
  make: string
  model: string
  trim: string
  year: number
  condition: string
  body_type: string
  transmission: string
  fuel_type: string
  drive_type: string
  mileage: string
  engine_size: string
  exterior_color: string
  interior_color: string
  vin: string
  registration_number: string
  
  // Pricing
  price: string
  discount_price: string
  negotiable: boolean
  financing_available: boolean
  
  // Media
  images: VehicleImage[]
  video_url: string
  
  // Features
  selectedFeatures: string[]
  custom_features: string
  
  // Description
  title: string
  description: string
  meta_title: string
  meta_description: string
}

export interface VehicleImage {
  id: string
  file?: File
  preview?: string
  url?: string
  is_primary: boolean
}

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>
  onSubmit: (data: VehicleFormData) => Promise<void>
  isLoading?: boolean
}

const vehicleConditions = [
  { value: 'new', label: 'New' },
  { value: 'foreign_used', label: 'Foreign Used' },
  { value: 'locally_used', label: 'Locally Used' },
  { value: 'refurbished', label: 'Refurbished' }
]

const bodyTypes = [
  'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 
  'Wagon', 'Van', 'Truck', 'Pickup', 'Mini Van'
]

const transmissions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic']
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
const driveTypes = ['FWD', 'RWD', 'AWD', '4WD']

const safetyFeatures = [
  'Anti-lock Braking System (ABS)', 'Electronic Stability Control (ESC)', 
  'Traction Control', 'Airbags', 'Reverse Camera', 
  'Parking Sensors', 'Blind Spot Monitoring', 'Lane Departure Warning',
  'Forward Collision Warning', 'Adaptive Cruise Control'
]

const interiorFeatures = [
  'Leather Seats', 'Heated Seats', 'Ventilated Seats', 'Power Seats',
  'Sunroof', 'Panoramic Roof', 'Navigation System', 'Touchscreen Display',
  'Bluetooth', 'USB Ports', 'Wireless Charging', 'Premium Audio'
]

const exteriorFeatures = [
  'Alloy Wheels', 'LED Headlights', 'Fog Lights', 'Daytime Running Lights',
  'Roof Rails', 'Side Steps', 'Towing Hitch', 'Privacy Glass',
  'Keyless Entry', 'Remote Start'
]

export default function VehicleForm({ 
  initialData, 
  onSubmit,
  isLoading = false 
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    make: initialData?.make || '',
    model: initialData?.model || '',
    trim: initialData?.trim || '',
    year: initialData?.year || new Date().getFullYear(),
    condition: initialData?.condition || 'foreign_used',
    body_type: initialData?.body_type || '',
    transmission: initialData?.transmission || '',
    fuel_type: initialData?.fuel_type || '',
    drive_type: initialData?.drive_type || '',
    mileage: initialData?.mileage || '',
    engine_size: initialData?.engine_size || '',
    exterior_color: initialData?.exterior_color || '',
    interior_color: initialData?.interior_color || '',
    vin: initialData?.vin || '',
    registration_number: initialData?.registration_number || '',
    price: initialData?.price || '',
    discount_price: initialData?.discount_price || '',
    negotiable: initialData?.negotiable ?? true,
    financing_available: initialData?.financing_available ?? true,
    images: initialData?.images || [],
    video_url: initialData?.video_url || '',
    selectedFeatures: initialData?.selectedFeatures || [],
    custom_features: initialData?.custom_features || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || ''
  })

  const [images, setImages] = useState<VehicleImage[]>(initialData?.images || [])
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'media' | 'features' | 'description'>('basic')

  const updateFormData = useCallback((field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const toggleFeature = useCallback((feature: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter(f => f !== feature)
        : [...prev.selectedFeatures, feature]
    }))
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        is_primary: images.length === 0
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }, [images.length])

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const setPrimaryImage = useCallback((index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index
    })))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ ...formData, images })
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'media', label: 'Media' },
    { id: 'features', label: 'Features' },
    { id: 'description', label: 'Description' }
  ] as const

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                <select
                  value={formData.make}
                  onChange={(e) => updateFormData('make', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Make</option>
                  <option value="toyota">Toyota</option>
                  <option value="bmw">BMW</option>
                  <option value="mercedes">Mercedes-Benz</option>
                  <option value="lexus">Lexus</option>
                  <option value="porsche">Porsche</option>
                  <option value="audi">Audi</option>
                  <option value="volkswagen">Volkswagen</option>
                  <option value="honda">Honda</option>
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => updateFormData('model', e.target.value)}
                  placeholder="e.g. Land Cruiser"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Trim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                <input
                  type="text"
                  value={formData.trim}
                  onChange={(e) => updateFormData('trim', e.target.value)}
                  placeholder="e.g. TX L Package"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => updateFormData('condition', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {vehicleConditions.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type *</label>
                <select
                  value={formData.body_type}
                  onChange={(e) => updateFormData('body_type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Body Type</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => updateFormData('transmission', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Transmission</option>
                  {transmissions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) => updateFormData('fuel_type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Drive Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drive Type</label>
                <select
                  value={formData.drive_type}
                  onChange={(e) => updateFormData('drive_type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Drive Type</option>
                  {driveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => updateFormData('mileage', e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Engine Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                <input
                  type="text"
                  value={formData.engine_size}
                  onChange={(e) => updateFormData('engine_size', e.target.value)}
                  placeholder="e.g. 2.0L"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Exterior Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
                <input
                  type="text"
                  value={formData.exterior_color}
                  onChange={(e) => updateFormData('exterior_color', e.target.value)}
                  placeholder="e.g. Pearl White"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Interior Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interior Color</label>
                <input
                  type="text"
                  value={formData.interior_color}
                  onChange={(e) => updateFormData('interior_color', e.target.value)}
                  placeholder="e.g. Black Leather"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* VIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => updateFormData('vin', e.target.value)}
                  placeholder="Vehicle Identification Number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  value={formData.registration_number}
                  onChange={(e) => updateFormData('registration_number', e.target.value)}
                  placeholder="e.g. KAA 123A"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">KSh</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (KES)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">KSh</span>
                  <input
                    type="number"
                    value={formData.discount_price}
                    onChange={(e) => updateFormData('discount_price', e.target.value)}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Negotiable */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.negotiable}
                  onChange={(e) => updateFormData('negotiable', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="negotiable" className="text-sm font-medium text-gray-700">
                  Price is negotiable
                </label>
              </div>

              {/* Financing Available */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="financing"
                  checked={formData.financing_available}
                  onChange={(e) => updateFormData('financing_available', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="financing" className="text-sm font-medium text-gray-700">
                  Financing available
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Media Gallery</h2>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Images</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="vehicle-image-upload"
                />
                <label htmlFor="vehicle-image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                </label>
              </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {image.preview || image.url ? (
                        <img 
                          src={image.preview || image.url} 
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {image.is_primary && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {!image.is_primary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          title="Set as primary"
                        >
                          <Star size={16} className="text-gray-700" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => updateFormData('video_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Add a YouTube or Vimeo video URL</p>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Features & Specifications</h2>
            
            {/* Safety Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Safety Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {safetyFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interior Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Interior Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {interiorFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exterior Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Exterior Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {exteriorFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Features</label>
              <textarea
                value={formData.custom_features}
                onChange={(e) => updateFormData('custom_features', e.target.value)}
                placeholder="Enter any additional features not listed above..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Description & SEO</h2>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="e.g. 2023 Toyota Land Cruiser V8 TX-L"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe the vehicle in detail..."
                rows={8}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* SEO Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Search Engine Optimization (SEO)</h3>
              
              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => updateFormData('meta_title', e.target.value)}
                  placeholder="SEO optimized title for search engines"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => updateFormData('meta_description', e.target.value)}
                  placeholder="SEO optimized description for search engines"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
