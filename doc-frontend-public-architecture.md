CarSite – Public Frontend Architecture

Professional Grade A Automotive Ecommerce Interface

1. Branding & Design System
1.1 Brand Positioning

CarSite is a premium automotive ecommerce platform.
The design must communicate:

Trust

Precision

Structure

Professionalism

Automotive authority

No exaggerated marketing language.
No emojis.
No inflated AI-sounding phrases.
No clutter.

Tone: Confident, clean, structured.

1.2 Visual Inspiration Reference

Branding inspiration:

Carstore Kenya

Carsoko

The visual direction should resemble Carstore’s clean dealership layout:

Dark header

Strong hero search

Professional grid-based vehicle cards

Clear price emphasis

Minimal distractions

1.3 Color System

Primary: Deep automotive blue or charcoal
Secondary: Neutral greys
Accent: Professional red or subtle gold for highlights
Background: White or very light grey

Avoid:

Bright playful colors

Gradient-heavy sections

Overuse of shadows

1.4 Typography

Primary Font:

Inter or similar modern sans-serif

Typography Rules:

Large bold vehicle titles

Clear price hierarchy

Consistent spacing system

No decorative fonts

2. Layout Architecture (Next.js App Router)
Directory Structure (Public Side)
src/app/(public)/

├── page.tsx                  (Homepage)
├── inventory/ ( SHOULD BE ABLE TO TAKE CARE OF NEW CARS, USED CARS, AND ALL CARS)
│   ├── page.tsx              (Vehicle Listing Page)
│
├── vehicle/
│   ├── [slug]/page.tsx       (Vehicle Detail Page)
│
├── about/page.tsx
├── contact/page.tsx
├── blog/
│   ├── page.tsx
│   ├── [slug]/page.tsx
│
├── get-financed/page.tsx
├── sell-your-car/page.tsx
├── privacy-policy/page.tsx
├── terms/page.tsx
3. Global Layout Structure
3.1 Header (Persistent)
Structure:

Left:

Logo (CarSite)

Primary Navigation

Center:

Main Navigation Links:

New Cars

Used Cars   

Get Financed

Sell Your Car

Blog

About

Contact

Right:

Call button

WhatsApp button

“Enquire Now” CTA

Header Behavior:

Sticky on scroll

Shrinks slightly on scroll

Mobile collapsible menu

3.2 Footer
Structure:

Column 1:

Logo

Short brand statement

Column 2:

Quick Links

Inventory

Financing

Sell

Blog

Column 3:

Contact Information

Phone

Email

Location

Column 4:

Newsletter form

Bottom Bar:

Copyright

Privacy Policy

Terms

4. Homepage Architecture
4.1 Hero Section

Full-width background. - CLEAN sleek professional carousel of cars ,collections ,just a well clean hero.
Overlaid search module.

Search Fields:

Make

Model

Year

Price Range

Body Type

Search Button

This is the primary interaction zone.

4.2 Featured Vehicles Section

Grid layout:

3–4 vehicles per row (desktop)

Image

Title (Make Model Year)

Price

Mileage

Transmission

Fuel Type

CTA: View Details

No unnecessary badges unless featured.

4.3 Browse by Brand

Grid of manufacturer logos.

4.4 Why Choose CarSite

Minimal icons.
Short structured points:

Verified Inventory

Transparent Pricing

Professional Support

4.5 Latest Listings

Dynamic grid (latest 8 vehicles).

5. Inventory Page (/inventory) - cars - inventory seems too generic, and ambiguous , we are dealing with cars
Layout:

Top Sticky Filters

Make

Model

Price

Year

Body Type

Fuel

Transmission

Condition

Reset Filters

Right Section:

Result count

Sort dropdown (Newest, Price Low-High, High-Low)

Grid/List toggle

Vehicle Cards:

Large image

Title

Price

Specs

Short summary

View Details button

Pagination at bottom.

6. Vehicle Detail Page (/vehicle/[slug])

This is the most critical conversion page.

Top Section:

Left:

Large image gallery (carousel)

Thumbnail strip

Right:

Vehicle Title

Price

Quick specs grid

Call CTA

WhatsApp CTA

Enquiry Form

Specifications Section

Two-column structured grid:

Engine

Transmission

Fuel

Drive

Mileage

Condition

VIN (if available)

Features Section

Grouped categories:

Safety

Interior

Exterior

Technology

Description Section

Structured paragraphs.
No AI-generated fluff.

Similar Vehicles Section

Carousel of related listings.

7. Get Financed Page

Structured page:

Financing introduction

Requirements

Benefits

Application form

Clear CTA

8. Sell Your Car Page

Simple submission form

Upload images

Basic vehicle details

Contact info

Clear disclaimer

9. Blog Page

Grid of articles.

Each blog card:

Featured image

Title

Short excerpt

Read More link

10. About Page

Company introduction

Mission

Why choose us

Trust elements

11. Contact Page

Contact form

Phone

WhatsApp

Location

Map embed

12. UI Component Modularity

Components should be separated into:

src/components/

├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│
├── vehicles/
│   ├── VehicleCard.tsx
│   ├── VehicleGallery.tsx
│   ├── VehicleSpecs.tsx
│   ├── VehicleFeatures.tsx
│
├── filters/
│   ├── InventoryFilters.tsx
│
├── forms/
│   ├── EnquiryForm.tsx
│   ├── FinanceForm.tsx
│   ├── SellCarForm.tsx

Each section must be reusable.

13. Interaction Standards

Smooth hover transitions

Image zoom on vehicle gallery

Clean dropdown animations

Skeleton loading states

Optimized images

Accessibility compliance

14. What Must Be Avoided

Emojis

Inflated marketing language

Overly dramatic headings

Overuse of animation

Template-like layouts

Inconsistent spacing

Generic stock imagery