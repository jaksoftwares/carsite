'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Car, 
  DollarSign, 
  Image as ImageIcon, 
  List, 
  FileText,
  Upload,
  X,
  ChevronDown,
  Plus,
  Trash2,
  Save,
  Eye,
  Loader2
} from 'lucide-react'

type Step = 'basic' | 'pricing' | 'media' | 'features' | 'description'

const steps = [
  { id: 'basic', title: 'Basic Info', icon: Car },
  { id: 'pricing', title: 'Pricing', icon: DollarSign },
  { id: 'media', title: 'Media', icon: ImageIcon },
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

// Mock vehicle data for demo
const mockVehicle = {
  id: '1',
  title: 'Toyota Land Cruiser V8',
  make: 'toyota',
  model: 'Land Cruiser',
  trim: 'TX L Package',
  year: 2023,
  condition: 'foreign_used',
  body_type: 'SUV',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  drive_type: '4WD',
  mileage: '15000',
  engine_size: '4.0L',
  exterior_color: 'Pearl White',
  interior_color: 'Black Leather',
  vin: 'JM1BK343551234567',
  registration_number: 'KAA 123A',
  price: '14500000',
  discount_price: '',
  negotiable: true,
  financing_available: true,
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800', is_primary: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800', is_primary: false }
  ],
  video_url: '',
  selectedFeatures: ['Airbags', 'Leather Seats', 'Sunroof', 'Navigation System', 'Reverse Camera'],
  custom_features: '',
  description: 'This is a pristine Toyota Land Cruiser V8 in excellent condition. Features include...',
  meta_title: 'Toyota Land Cruiser V8 for sale',
  meta_description: 'Buy Toyota Land Cruiser V8 at the best price'
}

export default function EditVehiclePage() {
  const params = useParams()
  const vehicleId = params.id as string
  
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
    images: [] as any[],
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

  useEffect(() => {
    // Simulate loading vehicle data
    setTimeout(() => {
      setFormData({
        make: mockVehicle.make,
        model: mockVehicle.model,
        trim: mockVehicle.trim,
        year: mockVehicle.year,
        condition: mockVehicle.condition,
        body_type: mockVehicle.body_type,
        transmission: mockVehicle.transmission,
        fuel_type: mockVehicle.fuel_type,
        drive_type: mockVehicle.drive_type,
        mileage: mockVehicle.mileage,
        engine_size: mockVehicle.engine_size,
        exterior_color: mockVehicle.exterior_color,
        interior_color: mockVehicle.interior_color,
        vin: mockVehicle.vin,
        registration_number: mockVehicle.registration_number,
        price: mockVehicle.price,
        discount_price: mockVehicle.discount_price,
        negotiable: mockVehicle.negotiable,
        financing_available: mockVehicle.financing_available,
        images: mockVehicle.images,
        video_url: mockVehicle.video_url,
        selectedFeatures: mockVehicle.selectedFeatures,
        custom_features: mockVehicle.custom_features,
        title: mockVehicle.title,
        description: mockVehicle.description,
        meta_title: mockVehicle.meta_title,
        meta_description: mockVehicle.meta_description
      })
      setIsLoading(false)
    }, 500)
  }, [vehicleId])

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
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        is_primary: formData.images.length === 0
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index
    })))
  }

  const [images, setImages] = useState<{ id: string; file?: File; preview?: string; url?: string; is_primary: boolean }[]>([])

  useEffect(() => {
    if (formData.images.length > 0) {
      setImages(formData.images)
    }
  }, [formData.images])

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

  const handleSave = async (publish: boolean = false) => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert(publish ? 'Vehicle published successfully!' : 'Vehicle saved as draft!')
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="text-gray-500 mt-1">Update vehicle listing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/vehicles/${vehicleId}`}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye size={18} />
            Preview
          </Link>
          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={18} />}
            Publish
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
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
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
                          onClick={() => setPrimaryImage(index)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          title="Set as primary"
                        >
                          <Star size={16} className="text-gray-700" />
                        </button>
                      )}
                      <button
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

        {/* Step 4: Features */}
        {currentStep === 'features' && (
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

        {/* Step 5: Description */}
        {currentStep === 'description' && (
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

        {/* Navigation buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-center gap-2-colors flex items disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

import { Star } from 'lucide-react'
