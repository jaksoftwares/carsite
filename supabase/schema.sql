-- =============================================================================
-- CAR DEALERSHIP WEBSITE DATABASE SCHEMA
-- Supabase PostgreSQL Database Setup
-- =============================================================================
-- This script creates all tables, relationships, indexes, and security policies
-- for a comprehensive car dealership platform
-- =============================================================================

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'dealer', 'customer');

-- Vehicle condition
CREATE TYPE vehicle_condition AS ENUM ('new', 'foreign_used', 'locally_used', 'refurbished');

-- Vehicle status
CREATE TYPE vehicle_status AS ENUM ('draft', 'pending', 'active', 'sold', 'inactive', 'archived');

-- Enquiry status
CREATE TYPE enquiry_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

-- Blog post status
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');

-- Feature categories
CREATE TYPE feature_category AS ENUM ('safety', 'comfort', 'entertainment', 'performance', 'exterior', 'interior', 'other');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    company_name TEXT,
    bio TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Kenya',
    social_links JSONB DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Car Makes (Brands)
CREATE TABLE makes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    country_of_origin TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Car Models
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make_id UUID NOT NULL REFERENCES makes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    year_from INT,
    year_to INT,
    body_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(make_id, name, year_from)
);

-- Body Types
CREATE TABLE body_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fuel Types
CREATE TABLE fuel_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transmissions
CREATE TABLE transmissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drive Types
CREATE TABLE drive_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colors
CREATE TABLE colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    hex_code TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Features/Specifications
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category feature_category NOT NULL,
    icon_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Listings
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    make_id UUID NOT NULL REFERENCES makes(id),
    model_id UUID REFERENCES models(id),
    year INT NOT NULL,
    condition vehicle_condition NOT NULL DEFAULT 'foreign_used',
    status vehicle_status DEFAULT 'draft',
    price DECIMAL(12, 2) NOT NULL,
    price_negotiable BOOLEAN DEFAULT TRUE,
    mileage INT,
    mileage_unit TEXT DEFAULT 'km',
    engine_size TEXT,
    horsepower INT,
    fuel_type_id UUID REFERENCES fuel_types(id),
    transmission_id UUID REFERENCES transmissions(id),
    drive_type_id UUID REFERENCES drive_types(id),
    body_type_id UUID REFERENCES body_types(id),
    exterior_color_id UUID REFERENCES colors(id),
    interior_color_id UUID REFERENCES colors(id),
    vin TEXT,
    registration_number TEXT,
    first_registration_date DATE,
    缸数 INT,
    door_count INT DEFAULT 4,
    seat_count INT DEFAULT 5,
    fuel_efficiency TEXT,
    emission_standard TEXT,
    description TEXT,
    short_description TEXT,
    highlights JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    location TEXT,
    city TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_top_sale BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    inquiry_count INT DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    assigned_dealer_id UUID REFERENCES profiles(id),
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Images
CREATE TABLE vehicle_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    public_id TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Features (Many-to-Many)
CREATE TABLE vehicle_features (
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (vehicle_id, feature_id)
);

-- =============================================================================
-- ENQUIRIES & COMMUNICATIONS
-- =============================================================================

-- Enquiries
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'website',
    status enquiry_status DEFAULT 'new',
    assigned_to UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Contact Messages (General)
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    department TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- BLOG / CONTENT MANAGEMENT
-- =============================================================================

-- Blog Categories
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES blog_categories(id),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
 TIMESTAMPT    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    featured_image_public_id TEXT,
    category_id UUID REFERENCES blog_categories(id),
    author_id UUID REFERENCES profiles(id),
    tags TEXT[] DEFAULT '{}',
    status blog_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Comments
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    parent_id UUID REFERENCES blog_comments(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CMS - PAGES
-- =============================================================================

-- Static Pages
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    meta_title TEXT,
    meta_description TEXT,
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    template TEXT DEFAULT 'default',
    display_order INT DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Categories
CREATE TABLE faq_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category_id UUID REFERENCES faq_categories(id),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- USER ENGAGEMENT
-- =============================================================================

-- Favorites / Wishlist
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- Vehicle Reviews
CREATE TABLE vehicle_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    reviewer_name TEXT NOT NULL,
    reviewer_email TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    pros TEXT[],
    cons TEXT[],
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    company TEXT,
    position TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ANALYTICS
-- =============================================================================

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    vehicle_id UUID REFERENCES vehicles(id),
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    page_url TEXT,
    referrer_url TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Views (Detailed)
CREATE TABLE vehicle_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    referrer TEXT,
    device_type TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search History
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    search_query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    results_count INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Analytics Summary (for reporting)
CREATE TABLE daily_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    unique_visitors INT DEFAULT 0,
    page_views INT DEFAULT 0,
    vehicle_views INT DEFAULT 0,
    enquiries INT DEFAULT 0,
    new_listings INT DEFAULT 0,
    vehicles_sold INT DEFAULT 0,
    search_queries INT DEFAULT 0,
    top_searches JSONB DEFAULT '[]',
    top_vehicles JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SETTINGS & CONFIGURATION
-- =============================================================================

-- Site Settings
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    value_type TEXT DEFAULT 'string',
    description TEXT,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Templates
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- DEALERSHIP SPECIFIC
-- =============================================================================

-- Dealers
CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    dealer_type TEXT DEFAULT 'independent',
    license_number TEXT,
    showrooms JSONB DEFAULT '[]',
    operating_hours JSONB DEFAULT '{}',
    certifications TEXT[],
    payment_methods TEXT[],
    delivery_areas TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Inquiries for Dealers
CREATE TABLE dealer_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    response_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Profile indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Vehicle indexes
CREATE INDEX idx_vehicles_make_id ON vehicles(make_id);
CREATE INDEX idx_vehicles_model_id ON vehicles(model_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_mileage ON vehicles(mileage);
CREATE INDEX idx_vehicles_city ON vehicles(city);
CREATE INDEX idx_vehicles_is_featured ON vehicles(is_featured);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_body_type ON vehicles(body_type_id);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type_id);
CREATE INDEX idx_vehicles_transmission ON vehicles(transmission_id);
CREATE INDEX idx_vehicles_created_by ON vehicles(created_by);

-- Vehicle images
CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_is_primary ON vehicle_images(is_primary);

-- Enquiries indexes
CREATE INDEX idx_enquiries_vehicle_id ON enquiries(vehicle_id);
CREATE INDEX idx_enquiries_user_id ON enquiries(user_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at);

-- Blog indexes
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);

-- Analytics indexes
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_vehicle ON analytics_events(vehicle_id);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);

CREATE INDEX idx_vehicle_views_vehicle ON vehicle_views(vehicle_id);
CREATE INDEX idx_vehicle_views_created ON vehicle_views(created_at);

CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_created ON search_history(created_at);

-- Favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_vehicle ON favorites(vehicle_id);

-- Reviews
CREATE INDEX idx_vehicle_reviews_vehicle ON vehicle_reviews(vehicle_id);
CREATE INDEX idx_vehicle_reviews_rating ON vehicle_reviews(rating);

-- =============================================================================
-- FULL TEXT SEARCH INDEXES
-- =============================================================================

-- Vehicle search index
CREATE INDEX idx_vehicles_search ON vehicles USING gin(
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(short_description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(location, '') || ' ' || coalesce(city, '')), 'D')
);

-- Blog posts search index
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'C')
);

-- =============================================================================
-- TRIGGERS & FUNCTIONS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_makes_updated_at BEFORE UPDATE ON makes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_vehicle_view_count(vehicle_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE vehicles 
    SET view_count = view_count + 1 
    WHERE id = vehicle_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to create slug
CREATE OR REPLACE FUNCTION create_slug(text_string TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(text_string, '[^\w\s-]', '', 'g'),
            '[\s-]+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, first_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', 'customer');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_inquiries ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Makes, Models, Body Types, Fuel Types, Transmissions - Public read
CREATE POLICY "Makes are viewable by everyone" ON makes FOR SELECT USING (is_active = true);
CREATE POLICY "Models are viewable by everyone" ON models FOR SELECT USING (is_active = true);
CREATE POLICY "Body types are viewable by everyone" ON body_types FOR SELECT USING (is_active = true);
CREATE POLICY "Fuel types are viewable by everyone" ON fuel_types FOR SELECT USING (is_active = true);
CREATE POLICY "Transmissions are viewable by everyone" ON transmissions FOR SELECT USING (is_active = true);
CREATE POLICY "Drive types are viewable by everyone" ON drive_types FOR SELECT USING (is_active = true);
CREATE POLICY "Colors are viewable by everyone" ON colors FOR SELECT USING (is_active = true);
CREATE POLICY "Features are viewable by everyone" ON features FOR SELECT USING (is_active = true);

-- Vehicle policies
CREATE POLICY "Active vehicles are viewable by everyone" ON vehicles
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert own vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.uid() = created_by OR auth.uid() = assigned_dealer_id);

CREATE POLICY "Users can update vehicles" ON vehicles
    FOR UPDATE USING (
        auth.uid() = created_by OR 
        auth.uid() = assigned_dealer_id OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

CREATE POLICY "Admins can delete vehicles" ON vehicles
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Vehicle images
CREATE POLICY "Vehicle images are viewable by everyone" ON vehicle_images FOR SELECT USING (true);
CREATE POLICY "Users can manage vehicle images" ON vehicle_images FOR ALL USING (
    EXISTS (SELECT 1 FROM vehicles v 
            JOIN profiles p ON p.id = auth.uid() 
            WHERE v.id = vehicle_id AND (v.created_by = p.id OR p.role IN ('admin', 'super_admin')))
);

-- Enquiries policies
CREATE POLICY "Enquiries are viewable by owners" ON enquiries
    FOR SELECT USING (
        user_id = auth.uid() OR
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

CREATE POLICY "Anyone can create enquiry" ON enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update assigned enquiries" ON enquiries FOR UPDATE USING (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Contact messages
CREATE POLICY "Anyone can create contact message" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact messages viewable by admins" ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Blog posts
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage own posts" ON blog_posts
    FOR ALL USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Blog comments
CREATE POLICY "Approved comments are viewable by everyone" ON blog_comments
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage own comments" ON blog_comments
    FOR ALL USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Pages
CREATE POLICY "Published pages are viewable by everyone" ON pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage pages" ON pages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- FAQs
CREATE POLICY "Active FAQs are viewable by everyone" ON faqs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" ON faqs
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Favorites
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (user_id = auth.uid());

-- Reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON vehicle_reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON vehicle_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own reviews" ON vehicle_reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all reviews" ON vehicle_reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Testimonials
CREATE POLICY "Active testimonials are viewable by everyone" ON testimonials
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Analytics (only admins can view)
CREATE POLICY "Admins can view analytics" ON analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Anyone can create analytics events" ON analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view vehicle views" ON vehicle_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Anyone can create vehicle views" ON vehicle_views FOR INSERT WITH CHECK (true);

-- Search history
CREATE POLICY "Users can manage own search history" ON search_history
    FOR ALL USING (user_id = auth.uid());

-- Daily analytics
CREATE POLICY "Admins can view daily analytics" ON daily_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Site settings
CREATE POLICY "Public settings are viewable by everyone" ON site_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage settings" ON site_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Email templates
CREATE POLICY "Admins can manage email templates" ON email_templates
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- Dealers
CREATE POLICY "Verified dealers are viewable by everyone" ON dealers
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Users can manage own dealer profile" ON dealers
    FOR ALL USING (profile_id = auth.uid());

-- Dealer inquiries
CREATE POLICY "Dealer inquiries viewable by participants" ON dealer_inquiries
    FOR SELECT USING (
        dealer_id IN (SELECT id FROM dealers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

CREATE POLICY "Anyone can create dealer inquiry" ON dealer_inquiries FOR INSERT WITH CHECK (true);

-- =============================================================================
-- SEED DATA - Reference Tables
-- =============================================================================

-- Seed Makes (Popular car brands in Kenya)
INSERT INTO makes (name, slug, country_of_origin, is_featured, display_order) VALUES
('Toyota', 'toyota', 'Japan', true, 1),
('Mercedes-Benz', 'mercedes-benz', 'Germany', true, 2),
('BMW', 'bmw', 'Germany', true, 3),
('Honda', 'honda', 'Japan', true, 4),
('Nissan', 'nissan', 'Japan', true, 5),
('Volkswagen', 'volkswagen', 'Germany', true, 6),
('Audi', 'audi', 'Germany', true, 7),
('Land Rover', 'land-rover', 'UK', true, 8),
('Ford', 'ford', 'USA', false, 9),
('Hyundai', 'hyundai', 'South Korea', false, 10),
('Kia', 'kia', 'South Korea', false, 11),
('Mazda', 'mazda', 'Japan', false, 12),
('Suzuki', 'suzuki', 'Japan', false, 13),
('Mitsubishi', 'mitsubishi', 'Japan', false, 14),
('Lexus', 'lexus', 'Japan', true, 15),
('Porsche', 'porsche', 'Germany', false, 16),
('Subaru', 'subaru', 'Japan', false, 17),
('Jeep', 'jeep', 'USA', false, 18),
('Peugeot', 'peugeot', 'France', false, 19),
('Renault', 'renault', 'France', false, 20)
ON CONFLICT (name) DO NOTHING;

-- Seed Body Types
INSERT INTO body_types (name, slug, display_order) VALUES
('SUV', 'suv', 1),
('Sedan', 'sedan', 2),
('Hatchback', 'hatchback', 3),
('Pickup', 'pickup', 4),
('Station Wagon', 'station-wagon', 5),
('Coupe', 'coupe', 6),
('Convertible', 'convertible', 7),
('Van', 'van', 8),
('Mini Van', 'mini-van', 9),
('Truck', 'truck', 10),
('Bus', 'bus', 11)
ON CONFLICT (name) DO NOTHING;

-- Seed Fuel Types
INSERT INTO fuel_types (name, slug) VALUES
('Petrol', 'petrol'),
('Diesel', 'diesel'),
('Electric', 'electric'),
('Hybrid', 'hybrid'),
('Plug-in Hybrid', 'plug-in-hybrid'),
('LPG', 'lpg')
ON CONFLICT (name) DO NOTHING;

-- Seed Transmissions
INSERT INTO transmissions (name, slug) VALUES
('Automatic', 'automatic'),
('Manual', 'manual'),
('Semi-Automatic', 'semi-automatic'),
('CVT', 'cvt')
ON CONFLICT (name) DO NOTHING;

-- Seed Drive Types
INSERT INTO drive_types (name, slug) VALUES
('2WD', '2wd'),
('4WD', '4wd'),
('AWD', 'awd'),
('RWD', 'rwd')
ON CONFLICT (name) DO NOTHING;

-- Seed Colors
INSERT INTO colors (name, hex_code) VALUES
('White', '#FFFFFF'),
('Silver', '#C0C0C0'),
('Black', '#000000'),
('Grey', '#808080'),
('Blue', '#0000FF'),
('Red', '#FF0000'),
('Green', '#008000'),
('Brown', '#A52A2A'),
('Gold', '#FFD700'),
('Orange', '#FFA500'),
('Beige', '#F5F5DC'),
('Yellow', '#FFFF00'),
('Burgundy', '#800020'),
('Navy', '#000080')
ON CONFLICT (name) DO NOTHING;

-- Seed Features
INSERT INTO features (name, slug, category) VALUES
-- Safety
('Airbags', 'airbags', 'safety'),
('ABS', 'abs', 'safety'),
('EBD', 'ebd', 'safety'),
('Traction Control', 'traction-control', 'safety'),
('Stability Control', 'stability-control', 'safety'),
('Reverse Camera', 'reverse-camera', 'safety'),
('Parking Sensors', 'parking-sensors', 'safety'),
('Lane Departure Warning', 'lane-departure-warning', 'safety'),
('Blind Spot Monitoring', 'blind-spot-monitoring', 'safety'),
('Collision Warning', 'collision-warning', 'safety'),
('Emergency Brake Assist', 'emergency-brake-assist', 'safety'),
('Child Seat Anchors', 'child-seat-anchors', 'safety'),
('Driver Attention Alert', 'driver-attention-alert', 'safety'),
-- Comfort
('Air Conditioning', 'air-conditioning', 'comfort'),
('Climate Control', 'climate-control', 'comfort'),
('Heated Seats', 'heated-seats', 'comfort'),
('Cooled Seats', 'cooled-seats', 'comfort'),
('Leather Seats', 'leather-seats', 'comfort'),
('Power Steering', 'power-steering', 'comfort'),
('Power Windows', 'power-windows', 'comfort'),
('Power Mirrors', 'power-mirrors', 'comfort'),
('Sunroof', 'sunroof', 'comfort'),
('Panoramic Roof', 'panoramic-roof', 'comfort'),
('Cruise Control', 'cruise-control', 'comfort'),
('Adaptive Cruise Control', 'adaptive-cruise-control', 'comfort'),
('Keyless Entry', 'keyless-entry', 'comfort'),
('Keyless Start', 'keyless-start', 'comfort'),
('Push Start', 'push-start', 'comfort'),
('Electric Tailgate', 'electric-tailgate', 'comfort'),
('Wireless Charging', 'wireless-charging', 'comfort'),
-- Entertainment
('Touchscreen Display', 'touchscreen-display', 'entertainment'),
('Apple CarPlay', 'apple-carplay', 'entertainment'),
('Android Auto', 'android-auto', 'entertainment'),
('Bluetooth', 'bluetooth', 'entertainment'),
('USB Port', 'usb-port', 'entertainment'),
('Aux Port', 'aux-port', 'entertainment'),
('Navigation System', 'navigation-system', 'entertainment'),
('Premium Sound System', 'premium-sound-system', 'entertainment'),
('Rear Entertainment', 'rear-entertainment', 'entertainment'),
('Wi-Fi Hotspot', 'wi-fi-hotspot', 'entertainment'),
-- Performance
('Sport Mode', 'sport-mode', 'performance'),
('Eco Mode', 'eco-mode', 'performance'),
('Turbocharger', 'turbocharger', 'performance'),
('Supercharger', 'supercharger', 'performance'),
('All-Wheel Drive', 'all-wheel-drive', 'performance'),
('Limited Slip Differential', 'limited-slip-differential', 'performance'),
('Adaptive Suspension', 'adaptive-suspension', 'performance'),
('Drive Mode Select', 'drive-mode-select', 'performance'),
-- Exterior
('Fog Lights', 'fog-lights', 'exterior'),
('LED Headlights', 'led-headlights', 'exterior'),
('Xenon Headlights', 'xenon-headlights', 'exterior'),
('Daytime Running Lights', 'daytime-running-lights', 'exterior'),
('Roof Rails', 'roof-rails', 'exterior'),
('Tow Hook', 'tow-hook', 'exterior'),
('Alloy Wheels', 'alloy-wheels', 'exterior'),
('Privacy Glass', 'privacy-glass', 'exterior'),
('Rain Sensing Wipers', 'rain-sensing-wipers', 'exterior'),
-- Interior
('Multi-function Steering', 'multi-function-steering', 'interior'),
('Digital Instrument Cluster', 'digital-instrument-cluster', 'interior'),
('Heads-Up Display', 'heads-up-display', 'interior'),
('Ambient Lighting', 'ambient-lighting', 'interior'),
('Cargo Cover', 'cargo-cover', 'interior'),
('Foldable Rear Seats', 'foldable-rear-seats', 'interior')
ON CONFLICT (name) DO NOTHING;

-- Seed FAQ Categories
INSERT INTO faq_categories (name, slug, display_order) VALUES
('Buying a Car', 'buying-a-car', 1),
('Selling a Car', 'selling-a-car', 2),
('Financing', 'financing', 3),
('Insurance', 'insurance', 4),
('Delivery & Returns', 'delivery-returns', 5),
('General', 'general', 6)
ON CONFLICT (name) DO NOTHING;

-- Seed Site Settings
INSERT INTO site_settings (key, value, value_type, category, description, is_public) VALUES
('site_name', 'CarStore Kenya', 'string', 'general', 'The name of the website', true),
('site_tagline', 'Your Trusted Car Marketplace', 'string', 'general', 'Website tagline', true),
('site_logo', '', 'string', 'general', 'URL to site logo', true),
('contact_email', 'info@carstore.co.ke', 'string', 'contact', 'Primary contact email', true),
('contact_phone', '+254 700 000 000', 'string', 'contact', 'Primary contact phone', true),
('contact_address', 'Nairobi, Kenya', 'string', 'contact', 'Physical address', true),
('default_currency', 'KES', 'string', 'general', 'Default currency code', true),
('currency_symbol', 'KSh', 'string', 'general', 'Currency symbol', true),
('featured_vehicles_limit', '10', 'number', 'general', 'Number of featured vehicles on homepage', true),
('latest_vehicles_limit', '20', 'number', 'general', 'Number of latest vehicles on homepage', true),
('per_page', '12', 'number', 'general', 'Items per page in listings', true),
('enable_reviews', 'true', 'boolean', 'general', 'Enable vehicle reviews', true),
('enable_wishlist', 'true', 'boolean', 'general', 'Enable wishlist feature', true),
('enable_instant_whatsapp', 'true', 'boolean', 'general', 'Enable WhatsApp contact option', true),
('enable_financing', 'true', 'boolean', 'general', 'Enable financing calculator', true),
('facebook_url', '', 'string', 'social', 'Facebook page URL', true),
('twitter_url', '', 'string', 'social', 'Twitter profile URL', true),
('instagram_url', '', 'string', 'social', 'Instagram profile URL', true),
('youtube_url', '', 'string', 'social', 'YouTube channel URL', true),
('google_analytics_id', '', 'string', 'analytics', 'Google Analytics Measurement ID', false),
('facebook_pixel_id', '', 'string', 'analytics', 'Facebook Pixel ID', false),
('cloudinary_cloud_name', '', 'string', 'media', 'Cloudinary cloud name', false),
('cloudinary_api_key', '', 'string', 'media', 'Cloudinary API key', false),
('cloudinary_api_secret', '', 'string', 'media', 'Cloudinary API secret', false),
('mailgun_api_key', '', 'string', 'email', 'Mailgun API key', false),
('mailgun_domain', '', 'string', 'email', 'Mailgun domain', false),
('admin_email', 'admin@carstore.co.ke', 'string', 'email', 'Admin notification email', false),
('enquiry_notification_email', 'enquiries@carstore.co.ke', 'string', 'email', 'Enquiry notification email', false)
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- STORAGE BUCKETS (Supabase Storage)
-- =============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('vehicles', 'vehicles', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('blog', 'blog', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('documents', 'documents', false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Vehicles images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'vehicles');

CREATE POLICY "Anyone can upload vehicle images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'vehicles');

CREATE POLICY "Owners can delete vehicle images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'vehicles' AND 
        EXISTS (SELECT 1 FROM vehicles v 
                JOIN vehicle_images vi ON vi.vehicle_id = v.id 
                WHERE vi.public_id = storage.objects.name)
    );

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars');

CREATE POLICY "Blog images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog');

CREATE POLICY "Anyone can upload blog images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'blog');

CREATE POLICY "Admins can delete blog images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog' AND 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- =============================================================================
-- COMPLETION
-- =============================================================================
