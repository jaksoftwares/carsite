// Vehicle Types
export type VehicleCondition = 'new' | 'foreign_used' | 'locally_used' | 'refurbished';
export type VehicleStatus = 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'archived';
export type VehicleStatusEnum = 'new' | 'foreign_used' | 'locally_used' | 'refurbished';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plug-in_hybrid';
export type Transmission = 'automatic' | 'manual' | 'semi-automatic' | 'cvt';
export type DriveType = 'fwd' | 'rwd' | 'awd' | '4wd';

export interface Vehicle {
  id: string;
  slug: string;
  make_id: string;
  model_id: string;
  make?: Make;
  model?: Model;
  year: number;
  price: number;
  price_negotiable: boolean;
  mileage: number;
  condition: VehicleCondition;
  status: VehicleStatus;
  
  // Vehicle details
  body_type_id: string;
  body_type?: BodyType;
  fuel_type: FuelType;
  transmission: Transmission;
  drive_type: DriveType;
  engine_size: string;
  horsepower?: number;
  color?: string;
  interior_color?: string;
  
  // VIN and registration
  vin?: string;
  registration_number?: string;
  year_of_manufacture: number;
  year_of_first_registration?: number;
  
  // Location
  country: string;
  city: string;
  location?: string;
  
  // Description
  title: string;
  description: string;
  short_description?: string;
  
  // Media
  images: VehicleImage[];
  primary_image?: string;
  has_video: boolean;
  video_url?: string;
  has_360_view: boolean;
  virtual_tour_url?: string;
  
  // Features
  features: VehicleFeature[];
  
  // Seller
  seller_id: string;
  seller?: Profile;
  dealer_name?: string;
  is_verified_seller: boolean;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  views: number;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  alt_text?: string;
}

export interface VehicleFeature {
  id: string;
  vehicle_id: string;
  category: FeatureCategory;
  name: string;
  description?: string;
}

export type FeatureCategory = 'safety' | 'comfort' | 'entertainment' | 'performance' | 'exterior' | 'interior' | 'other';

// Make/Brand Types
export interface Make {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  country_of_origin?: string;
  description?: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  models?: Model[];
}

// Model Types
export interface Model {
  id: string;
  make_id: string;
  name: string;
  slug: string;
  year_from?: number;
  year_to?: number;
  body_type?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Body Types
export interface BodyType {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
  display_order: number;
  is_active: boolean;
}

// Fuel Types
export interface FuelTypeData {
  id: string;
  name: string;
  slug: string;
}

// Blog Types
export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  status: BlogStatus;
  category_id: string;
  category?: BlogCategory;
  author_id: string;
  author?: Profile;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  views: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

// User Types
export type UserRole = 'super_admin' | 'admin' | 'dealer' | 'customer';

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_verified: boolean;
  company_name?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

// Enquiry Types
export type EnquiryStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export interface Enquiry {
  id: string;
  vehicle_id?: string;
  vehicle?: Vehicle;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Page Types
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Review Types
export interface Review {
  id: string;
  vehicle_id: string;
  vehicle?: Vehicle;
  user_id: string;
  user?: Profile;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

// Filter Types
export interface VehicleFilters {
  make?: string;
  model?: string;
  year_from?: number;
  year_to?: number;
  price_min?: number;
  price_max?: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  condition?: VehicleCondition;
  mileage_max?: number;
  city?: string;
  country?: string;
  keyword?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'year_desc' | 'year_asc' | 'mileage_asc' | 'mileage_desc' | 'newest';
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Site Settings
export interface SiteSettings {
  site_name: string;
  site_description?: string;
  logo_url?: string;
  favicon_url?: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp?: string;
  contact_address?: string;
  contact_city?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_youtube?: string;
  default_currency: string;
  currency_symbol: string;
}

// Make with vehicle count for display
export interface MakeWithCount extends Make {
  vehicle_count: number;
}

// Vehicle card for listings
export interface VehicleCardData {
  id: string;
  slug: string;
  title: string;
  year: number;
  price: number;
  price_negotiable: boolean;
  mileage: number;
  transmission: Transmission;
  fuel_type: FuelType;
  condition: VehicleCondition;
  primary_image?: string;
  city: string;
  make_name: string;
  model_name: string;
  is_featured?: boolean;
  created_at: string;
}
