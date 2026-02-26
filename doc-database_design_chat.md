This schema will support:

✅ User-facing marketplace

✅ Full Admin panel

✅ CRM & lead tracking

✅ Analytics & reporting

✅ CMS content

✅ Role-based access

✅ Future scalability (multi-dealer, monetization, packages)

Since Supabase runs on PostgreSQL, we’ll structure this properly using:

UUID primary keys

Foreign key constraints

Indexing for performance

Normalized relational structure

Audit fields

Soft deletes where needed

🏗 DATABASE ARCHITECTURE OVERVIEW

We divide into logical domains:

Authentication & Roles

Vehicle Inventory

Taxonomies (Make/Model/Features etc.)

Media

Leads & CRM

CMS & Blog

Promotions & Monetization

Analytics

System & Settings

Security & Logs



1️⃣ AUTH & USER MANAGEMENT

Supabase provides auth.users, so we extend it.

profiles

Stores extended user information.

profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  role_id uuid REFERENCES roles(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
)
roles
roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE, -- super_admin, admin, agent, editor
  description text
)
permissions
permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE,
  module text
)
role_permissions
role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY(role_id, permission_id)
)


2️⃣ VEHICLE INVENTORY (CORE)
vehicles

Main car table.

vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_number text UNIQUE,
  make_id uuid REFERENCES makes(id),
  model_id uuid REFERENCES models(id),
  trim text,
  year integer,
  condition_id uuid REFERENCES vehicle_conditions(id),
  body_type_id uuid REFERENCES body_types(id),
  transmission_id uuid REFERENCES transmissions(id),
  fuel_type_id uuid REFERENCES fuel_types(id),
  drive_type text,
  engine_capacity numeric,
  mileage integer,
  exterior_color text,
  interior_color text,
  vin text,
  price numeric,
  discount_price numeric,
  currency text DEFAULT 'KES',
  negotiable boolean DEFAULT false,
  financing_available boolean DEFAULT false,
  status text DEFAULT 'draft', -- draft, pending, published, sold
  is_featured boolean DEFAULT false,
  featured_until timestamptz,
  location_id uuid REFERENCES locations(id),
  description text,
  created_by uuid REFERENCES profiles(id),
  published_at timestamptz,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz
)

Indexes needed:

(make_id)

(model_id)

(price)

(year)

(status)

Full text index on description



3️⃣ TAXONOMY TABLES
makes
makes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE,
  logo_url text
)
models
models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make_id uuid REFERENCES makes(id) ON DELETE CASCADE,
  name text
)
vehicle_conditions
vehicle_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text -- new, foreign used, locally used
)
body_types
body_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text
)
transmissions
transmissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text -- automatic, manual
)
fuel_types
fuel_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text
)
features

Master feature list.

features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  category text -- safety, interior, exterior, tech
)
vehicle_features
vehicle_features (
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY(vehicle_id, feature_id)
)
locations
locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  county text,
  country text DEFAULT 'Kenya'
)


4️⃣ MEDIA MANAGEMENT
vehicle_images
vehicle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url text,
  is_featured boolean DEFAULT false,
  sort_order integer,
  created_at timestamptz DEFAULT now()
)
vehicle_videos
vehicle_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  video_url text
)


5️⃣ ENQUIRIES & CRM
enquiries
enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  message text,
  source text, -- whatsapp, form, call
  status text DEFAULT 'new', -- new, contacted, closed
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
)
enquiry_notes
enquiry_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid REFERENCES enquiries(id) ON DELETE CASCADE,
  note text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
)


6️⃣ CMS & BLOG
pages
pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  slug text UNIQUE,
  content text,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)
blog_posts
blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  slug text UNIQUE,
  content text,
  featured_image text,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  author_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
)


7️⃣ PROMOTIONS & PACKAGES
listing_packages
listing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  price numeric,
  duration_days integer,
  features jsonb
)
vehicle_package_orders
vehicle_package_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  package_id uuid REFERENCES listing_packages(id),
  payment_status text,
  start_date timestamptz,
  end_date timestamptz
)


8️⃣ ANALYTICS & TRACKING
vehicle_views
vehicle_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  ip_address text,
  viewed_at timestamptz DEFAULT now()
)
search_logs
search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make_id uuid,
  model_id uuid,
  min_price numeric,
  max_price numeric,
  searched_at timestamptz DEFAULT now()
)


9️⃣ SYSTEM SETTINGS
site_settings
site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE,
  value text,
  updated_at timestamptz DEFAULT now()
)


🔟 AUDIT & SECURITY
audit_logs
audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text,
  table_name text,
  record_id uuid,
  created_at timestamptz DEFAULT now()
)

SCALABILITY FEATURES INCLUDED

✔ Multi-user roles
✔ Multi-location support
✔ CRM pipeline
✔ Featured listings
✔ Monetization ready
✔ Analytics ready
✔ SEO ready
✔ Soft deletes
✔ Audit tracking
✔ Feature categorization
✔ Search tracking

RELATIONSHIP SUMMARY

vehicles → makes → models

vehicles ↔ features (many-to-many)

vehicles → enquiries

enquiries → profiles (agent)

vehicles → images/videos

vehicles → package_orders

profiles → roles → permissions

 ENTERPRISE ENHANCEMENTS (Optional)

Wishlist

Review & ratings