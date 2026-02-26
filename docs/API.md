# CarStore API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this structure:

### Success Response
```json
{
  "data": { ... }
}
```

Or with pagination:
```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### Success Message Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

---

## Endpoints

---

## 1. Vehicles

### 1.1 List Vehicles
**GET** `/vehicles`

Query Parameters:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | Items per page | 12 |
| sortBy | string | Sort field (created_at, price, year, mileage) | created_at |
| sortOrder | string | Sort order (asc, desc) | desc |
| make | string | Filter by make ID | - |
| model | string | Filter by model ID | - |
| bodyType | string | Filter by body type ID | - |
| fuelType | string | Filter by fuel type ID | - |
| transmission | string | Filter by transmission ID | - |
| minPrice | number | Minimum price | - |
| maxPrice | number | Maximum price | - |
| minYear | number | Minimum year | - |
| maxYear | number | Maximum year | - |
| minMileage | number | Minimum mileage | - |
| maxMileage | number | Maximum mileage | - |
| condition | string | Vehicle condition (new, foreign_used, locally_used, refurbished) | - |
| city | string | Filter by city | - |
| featured | boolean | Filter featured vehicles | - |
| status | string | Vehicle status (active, sold, etc.) | active |

**Example Request:**
```
GET /api/vehicles?page=1&limit=12&make=uuid&minPrice=500000&maxPrice=5000000
```

**Response:**
```json
{
  "data": {
    "vehicles": [
      {
        "id": "uuid",
        "title": "Toyota Prado TXL",
        "slug": "toyota-prado-txl-2024",
        "year": 2024,
        "price": 4500000,
        "mileage": 15000,
        "condition": "foreign_used",
        "city": "Nairobi",
        "make": { "id": "uuid", "name": "Toyota", "slug": "toyota" },
        "model": { "id": "uuid", "name": "Prado", "slug": "prado" },
        "primary_image": { "url": "https://...", "is_primary": true }
      }
    ],
    "pagination": { "page": 1, "limit": 12, "total": 50, "totalPages": 5, "hasMore": true }
  }
}
```

---

### 1.2 Create Vehicle
**POST** `/vehicles`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request Body:
```json
{
  "title": "Toyota Prado TXL",
  "make_id": "uuid",
  "model_id": "uuid",
  "year": 2024,
  "condition": "foreign_used",
  "price": 4500000,
  "price_negotiable": true,
  "mileage": 15000,
  "engine_size": "2.8L",
  "fuel_type_id": "uuid",
  "transmission_id": "uuid",
  "body_type_id": "uuid",
  "exterior_color_id": "uuid",
  "description": "Excellent condition...",
  "location": "Nairobi",
  "city": "Nairobi",
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "message": "Vehicle created successfully",
  "data": { ...vehicle }
}
```

---

### 1.3 Get Single Vehicle
**GET** `/vehicles/[slug]`

**Example:**
```
GET /api/vehicles/toyota-prado-txl-2024
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Toyota Prado TXL",
    "slug": "toyota-prado-txl-2024",
    "year": 2024,
    "price": 4500000,
    "mileage": 15000,
    "condition": "foreign_used",
    "description": "...",
    "specifications": { "engine": "2.8L", "horsepower": 177 },
    "make": { "name": "Toyota" },
    "model": { "name": "Prado" },
    "body_type": { "name": "SUV" },
    "fuel_type": { "name": "Diesel" },
    "transmission": { "name": "Automatic" },
    "images": [...],
    "features": [
      { "name": "Airbags", "category": "safety", "value": "6" },
      { "name": "Sunroof", "category": "comfort" }
    ],
    "reviews": [...],
    "rating": 4.5,
    "review_count": 12,
    "similar_vehicles": [...],
    "seller": { "first_name": "John", "phone": "+254..." }
  }
}
```

---

### 1.4 Update Vehicle
**PUT** `/vehicles/[slug]`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request Body (partial updates supported):
```json
{
  "title": "Updated Title",
  "price": 4200000,
  "status": "active"
}
```

**Response:** `200 OK`
```json
{
  "message": "Vehicle updated successfully",
  "data": { ...updated_vehicle }
}
```

---

### 1.5 Delete Vehicle
**DELETE** `/vehicles/[slug]`

Headers:
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Vehicle deleted successfully"
}
```

---

### 1.6 Vehicle Images
**GET** `/vehicles/images?vehicle_id=[uuid]`

**POST** `/vehicles/images`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "vehicle_id": "uuid",
  "url": "https://cloudinary-url",
  "public_id": "cloudinary-public-id",
  "is_primary": true,
  "display_order": 0
}
```

**DELETE** `/vehicles/images?id=[image_id]`

---

## 2. Search

### 2.1 Search Vehicles
**GET** `/search?q=[query]&page=1&limit=12`

**Example:**
```
GET /api/search?q=toyota prado&minPrice=1000000&maxPrice=5000000
```

**Response:**
```json
{
  "data": {
    "vehicles": [...],
    "suggestions": {
      "makes": [{ "id": "uuid", "name": "Toyota", "slug": "toyota" }],
      "models": [...]
    },
    "pagination": { ... }
  }
}
```

---

## 3. Authentication

### 3.1 Register (Signup)
**POST** `/auth/signup`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+254700000000",
  "role": "customer"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "data": { "user_id": "uuid" }
}
```

---

### 3.2 Login
**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "customer",
      "avatar_url": "https://..."
    },
    "session": {
      "access_token": "...",
      "refresh_token": "...",
      "expires_at": 1234567890
    }
  }
}
```

---

### 3.3 Logout
**POST** `/auth/logout`

Headers:
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Logout successful"
}
```

---

### 3.4 Get Current User
**GET** `/auth/me`

Headers:
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+254700000000",
      "role": "customer",
      "avatar_url": "https://...",
      "company_name": "...",
      "is_verified": false
    }
  }
}
```

---

### 3.5 Update Current User Profile
**PUT** `/auth/me`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+254700000000",
  "company_name": "My Company",
  "bio": "Car enthusiast",
  "address": "123 Main St",
  "city": "Nairobi"
}
```

---

## 4. Enquiries

### 4.1 List Enquiries
**GET** `/enquiries`

Headers:
```
Authorization: Bearer <token>
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by status (new, in_progress, completed, cancelled) |

**Response:**
```json
{
  "data": {
    "enquiries": [
      {
        "id": "uuid",
        "vehicle_id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+254700000000",
        "subject": "Interested in Toyota Prado",
        "message": "Is this still available?",
        "status": "new",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 4.2 Create Enquiry
**POST** `/enquiries`

```json
{
  "vehicle_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "subject": "Interested in Toyota Prado",
  "message": "Is this still available?",
  "source": "website"
}
```

**Response:** `201 Created`
```json
{
  "message": "Enquiry submitted successfully",
  "data": { ...enquiry }
}
```

---

## 5. Contact

### 5.1 Submit Contact Form
**POST** `/contact`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "subject": "General Inquiry",
  "message": "I have a question about...",
  "department": "sales"
}
```

**Response:** `201 Created`
```json
{
  "message": "Message sent successfully",
  "data": { ... }
}
```

---

### 5.2 Get Contact Messages (Admin)
**GET** `/contact`

Headers:
```
Authorization: Bearer <admin-token>
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| is_read | boolean | Filter by read status |

---

## 6. Upload

### 6.1 Upload File
**POST** `/upload`

Headers:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form Data:
| Field | Type | Description |
|-------|------|-------------|
| file | File | Image file |
| folder | string | Folder name (vehicles, avatars, blog) |

**Response:** `201 Created`
```json
{
  "message": "File uploaded successfully",
  "data": {
    "public_id": "carstore/vehicles/abc123",
    "url": "https://res.cloudinary.com/.../image/upload/...",
    "width": 1920,
    "height": 1080,
    "format": "jpg"
  }
}
```

---

### 6.2 Delete File
**DELETE** `/upload?public_id=[public-id]`

Headers:
```
Authorization: Bearer <token>
```

---

## 7. Blog

### 7.1 List Blog Posts
**GET** `/blog`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | Items per page |
| category | string | Filter by category ID |
| featured | boolean | Filter featured posts |

**Response:**
```json
{
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Best SUVs in Kenya 2024",
        "slug": "best-suvs-kenya-2024",
        "excerpt": "...",
        "featured_image_url": "https://...",
        "category": { "name": "Car Reviews", "slug": "car-reviews" },
        "published_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 7.2 Get Single Blog Post
**GET** `/blog/[slug]`

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Best SUVs in Kenya 2024",
    "slug": "best-suvs-kenya-2024",
    "content": "<p>Full HTML content...</p>",
    "featured_image_url": "https://...",
    "category": { "id": "uuid", "name": "Car Reviews" },
    "author": { "first_name": "Jane", "last_name": "Smith" },
    "tags": ["suv", "kenya", "2024"],
    "view_count": 150,
    "comments": [...],
    "related_posts": [...]
  }
}
```

---

### 7.3 Create Blog Post (Admin)
**POST** `/blog`

Headers:
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "title": "Best SUVs in Kenya 2024",
  "excerpt": "A comprehensive guide...",
  "content": "<p>Full HTML content...</p>",
  "featured_image_url": "https://...",
  "category_id": "uuid",
  "tags": ["suv", "kenya"],
  "status": "published"
}
```

---

### 7.4 Blog Categories
**GET** `/blog/categories`

**Response:**
```json
{
  "data": [
    { "id": "uuid", "name": "Car Reviews", "slug": "car-reviews", "post_count": 15 },
    { "id": "uuid", "name": "Buying Guide", "slug": "buying-guide", "post_count": 8 }
  ]
}
```

---

### 7.5 Blog Comments
**GET** `/blog/comments?post_id=[uuid]`

**POST** `/blog/comments`

```json
{
  "post_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "content": "Great article!",
  "parent_id": "uuid" // For replies
}
```

---

## 8. Favorites

### 8.1 Get User Favorites
**GET** `/favorites`

Headers:
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "added_at": "2024-01-15T10:00:00Z",
      "vehicle": {
        "id": "uuid",
        "title": "Toyota Prado TXL",
        "slug": "toyota-prado-txl",
        "price": 4500000,
        "primary_image": { "url": "https://..." }
      }
    }
  ]
}
```

---

### 8.2 Add to Favorites
**POST** `/favorites`

Headers:
```
Authorization: Bearer <token>
```

```json
{
  "vehicle_id": "uuid"
}
```

---

### 8.3 Remove from Favorites
**DELETE** `/favorites?vehicle_id=[uuid]`

or

**DELETE** `/favorites?id=[favorite-id]`

---

## 9. Reviews

### 9.1 Get Vehicle Reviews
**GET** `/reviews?vehicle_id=[uuid]`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| vehicle_id | string | Required vehicle ID |
| page | number | Page number |
| limit | number | Items per page |

**Response:**
```json
{
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "title": "Great car!",
        "content": "I love this car...",
        "reviewer_name": "John Doe",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "stats": {
      "average_rating": 4.5,
      "total_reviews": 12,
      "distribution": { "1": 0, "2": 1, "3": 2, "4": 3, "5": 6 }
    },
    "pagination": { ... }
  }
}
```

---

### 9.2 Add Review
**POST** `/reviews`

```json
{
  "vehicle_id": "uuid",
  "rating": 5,
  "title": "Great car!",
  "content": "I love this car...",
  "pros": ["Comfort", "Performance"],
  "cons": ["Fuel consumption"],
  "reviewer_name": "John Doe",
  "reviewer_email": "john@example.com"
}
```

---

## 10. Makes & Models

### 10.1 List Makes
**GET** `/makes`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| featured | boolean | Filter featured makes |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Toyota",
      "slug": "toyota",
      "logo_url": "https://...",
      "country_of_origin": "Japan",
      "vehicle_count": 150
    }
  ]
}
```

---

### 10.2 Create Make (Admin)
**POST** `/makes`

Headers:
```
Authorization: Bearer <admin-token>
```

```json
{
  "name": "Toyota",
  "logo_url": "https://...",
  "country_of_origin": "Japan",
  "description": "Japanese automotive manufacturer",
  "is_featured": true,
  "display_order": 1
}
```

---

### 10.3 List Models
**GET** `/models`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| make_id | string | Filter by make |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Prado",
      "slug": "prado",
      "make": { "id": "uuid", "name": "Toyota", "slug": "toyota" },
      "year_from": 2000,
      "year_to": 2024,
      "body_type": "SUV"
    }
  ]
}
```

---

## 11. Filters

### 11.1 Get All Filter Options
**GET** `/filters`

**Response:**
```json
{
  "data": {
    "body_types": [
      { "id": "uuid", "name": "SUV", "slug": "suv" },
      { "id": "uuid", "name": "Sedan", "slug": "sedan" }
    ],
    "fuel_types": [
      { "id": "uuid", "name": "Petrol", "slug": "petrol" },
      { "id": "uuid", "name": "Diesel", "slug": "diesel" }
    ],
    "transmissions": [
      { "id": "uuid", "name": "Automatic", "slug": "automatic" },
      { "id": "uuid", "name": "Manual", "slug": "manual" }
    ],
    "drive_types": [...],
    "colors": [...],
    "features": [...],
    "features_by_category": {
      "safety": [...],
      "comfort": [...],
      "entertainment": [...]
    },
    "conditions": [
      { "value": "new", "label": "New" },
      { "value": "foreign_used", "label": "Foreign Used" }
    ]
  }
}
```

---

## 12. Pages

### 12.1 List Pages
**GET** `/pages`

**Response:**
```json
{
  "data": [
    { "id": "uuid", "title": "About Us", "slug": "about-us", "template": "default" }
  ]
}
```

---

### 12.2 Get Single Page
**GET** `/pages?slug=[slug]`

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "About Us",
    "slug": "about-us",
    "content": "<p>Full page content...</p>",
    "meta_title": "About CarStore Kenya",
    "meta_description": "Learn more about us"
  }
}
```

---

### 12.3 Create Page (Admin)
**POST** `/pages`

Headers:
```
Authorization: Bearer <admin-token>
```

```json
{
  "title": "About Us",
  "slug": "about-us",
  "content": "<p>Full page content...</p>",
  "meta_title": "About CarStore Kenya",
  "meta_description": "Learn more about us",
  "is_published": true
}
```

---

## 13. FAQs

### 13.1 Get FAQs
**GET** `/faqs`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category ID |

**Response:**
```json
{
  "data": {
    "faqs": [
      {
        "id": "uuid",
        "question": "How do I buy a car?",
        "answer": "You can...",
        "category": { "name": "Buying a Car" }
      }
    ],
    "by_category": {
      "Buying a Car": [...],
      "Selling a Car": [...]
    }
  }
}
```

---

### 13.2 Create FAQ (Admin)
**POST** `/faqs`

Headers:
```
Authorization: Bearer <admin-token>
```

```json
{
  "question": "How do I buy a car?",
  "answer": "You can browse our inventory...",
  "category_id": "uuid"
}
```

---

## 14. Settings

### 14.1 Get Settings
**GET** `/settings`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| key | string | Get specific setting |
| category | string | Filter by category |
| public | boolean | Only public settings (default: true) |

**Response:**
```json
{
  "data": {
    "settings": [
      { "key": "site_name", "value": "CarStore Kenya", "value_type": "string" }
    ],
    "by_category": {
      "general": { "site_name": { "value": "CarStore Kenya" } },
      "contact": { "contact_email": { "value": "info@carstore.co.ke" } }
    }
  }
}
```

---

### 14.2 Update Setting (Admin)
**PUT** `/settings`

Headers:
```
Authorization: Bearer <admin-token>
```

```json
{
  "key": "site_name",
  "value": "CarStore Kenya",
  "description": "Updated site name"
}
```

---

## 15. Analytics

### 15.1 Get Analytics (Admin)
**GET** `/analytics`

Headers:
```
Authorization: Bearer <admin-token>
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | analytics type (overview, vehicles, enquiries, daily, searches) |
| start_date | string | Start date (YYYY-MM-DD) |
| end_date | string | End date (YYYY-MM-DD) |

**Example:**
```
GET /api/analytics?type=overview
GET /api/analytics?type=vehicles
GET /api/analytics?type=daily&start_date=2024-01-01&end_date=2024-01-31
```

**Response (overview):**
```json
{
  "data": {
    "total_vehicles": 150,
    "total_enquiries": 320,
    "total_users": 1200,
    "total_views": 15000
  }
}
```

**Response (vehicles):**
```json
{
  "data": {
    "top_vehicles": [
      { "title": "Toyota Prado", "view_count": 500, "price": 4500000 }
    ]
  }
}
```

---

### 15.2 Track Event
**POST** `/analytics`

```json
{
  "event_type": "vehicle_view",
  "event_category": "engagement",
  "event_action": "view",
  "vehicle_id": "uuid",
  "page_url": "https://carstore.co.ke/vehicle/toyota-prado",
  "metadata": { "source": "search" }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

API requests are rate-limited to 100 requests per minute per IP address.
