'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Car, 
  DollarSign, 
  Image, 
  List, 
  FileText,
  Upload,
  X,
  ChevronDown,
  Plus,
  Trash2
} from 'lucide-react'

type Step = 'basic' | 'pricing' | 'media' | 'features' | 'description'

const steps = [
  { id: 'basic', title: 'Basic Info', icon: Car },
  { id: 'pricing', title: 'Pricing', icon: DollarSign },
  { id: 'media', title: 'Media', icon: Image },
  { id: 'features', title: 'Features', icon: List },
  { id: 'description', title: 'Description', icon: FileText }
]

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

export default function NewVehiclePage() {
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState({
    // Basic Info
    make: '',
    model: '',
    trim: '',
    year: new Date().getFullYear(),
    condition: 'foreign_used',
    body_type: '',
    transmission: '',
    fuel_type: '',
    drive_type: '',
    mileage: '',
    engine_size: '',
    exterior_color: '',
    interior_color: '',
    vin: '',
    registration_number: '',
    
    // Pricing
    price: '',
    discount_price: '',
    negotiable: false,
    financing_available: false,
    
    // Media
    images: [] as string[],
    video_url: '',
    
    // Features
    selectedFeatures: [] as string[],
    custom_features: '',
    
    // Description
    title: '',
    description: '',
    meta_title: '',
    meta_description: ''
  })

  const [images, setImages] = useState<{ file: File; preview: string }[]>([])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter(f => f !== feature)
        : [...prev.selectedFeatures, feature]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as Step)
    }
  }

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as Step)
    }
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

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
            <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-500 mt-1">Create a new vehicle listing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Save as Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Publish Now
          </button>
        </div>
      </div>

      {/* Progress steps */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id as Step)}
                className={`flex items-center gap-2 ${
                  index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${index < currentStepIndex ? 'bg-green-500 text-white' :
                    index === currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-100'}
                `}>
                  {index < currentStepIndex ? <Check size={18} /> : <step.icon size={18} />}
                </div>
                <span className="hidden sm:inline font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Step 1: Basic Info */}
        {currentStep === 'basic' && (
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

        {/* Step 2: Pricing */}
        {currentStep === 'pricing' && (
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

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Setting a discount price will show the original price struck through and highlight the savings.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Media */}
        {currentStep === 'media' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Media</h2>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Images</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each (max 20 images)</p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => updateFormData('video_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">YouTube or Vimeo video link</p>
            </div>
          </div>
        )}

        {/* Step 4: Features */}
        {currentStep === 'features' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Features</h2>
            
            {/* Safety Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Safety Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {safetyFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interior Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Interior Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {interiorFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exterior Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Exterior Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {exteriorFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Features</label>
              <textarea
                value={formData.custom_features}
                onChange={(e) => updateFormData('custom_features', e.target.value)}
                rows={4}
                placeholder="Add any additional features not listed above..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 5: Description */}
        {currentStep === 'description' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Description & SEO</h2>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="e.g. 2023 Toyota Land Cruiser V8 TXL - Premium SUV"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={8}
                placeholder="Provide a detailed description of the vehicle..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SEO */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => updateFormData('meta_title', e.target.value)}
                    placeholder="SEO title for search engines"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => updateFormData('meta_description', e.target.value)}
                    rows={2}
                    placeholder="SEO description for search engines"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          
          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Check size={18} />
              Create Listing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
