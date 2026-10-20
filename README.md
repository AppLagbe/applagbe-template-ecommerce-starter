# App Lagbe Commerce Starter (`applagbe-commerce-starter`)

A production-grade, reusable e-commerce starter built for **App Lagbe** using **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

Designed specifically for launching high-converting, mobile-first Bangladeshi D2C landing pages and direct Cash on Delivery (COD) storefronts from a single codebase.

---

## 📊 System Architecture & Summary Diagram

```mermaid
flowchart TD
    subgraph Repo["Master Repository (Single Maintainable Codebase)"]
        MasterCode["applagbe-commerce-starter\n(Next.js 14 App Router + TypeScript + Tailwind)"]
        SharedTokens["Dynamic Theme Engine\n(:root CSS Variables per client)"]
        SharedUI["Brand-Agnostic UI Library\n(Buttons, Badges, Inputs, Cards)"]
    end

    subgraph Deployments["Client Deployments (Independent DB & Env)"]
        direction LR
        ClientA["Client A (e.g. Organic Food Store)\nDATABASE_URL_A"]
        ClientB["Client B (e.g. Health & Beauty Store)\nDATABASE_URL_B"]
    end

    MasterCode --> ClientA
    MasterCode --> ClientB

    subgraph StorefrontFlow["Storefront Customer Journey"]
        direction TB
        Visitor["Mobile Shopper"] --> Landing["Single-Product Landing Page"]
        Landing --> Sections["Dynamic Reorderable Sections\n(Hero, Gallery, Benefits, Steps, Bundles, Reviews, FAQ)"]
        Sections --> Checkout["Embedded BD Guest Checkout\n(Name, 01XXXXXXXXX, 64 Districts, Cash on Delivery)"]
    end

    subgraph BackendEngine["Server Validation & Integrity Engine"]
        direction TB
        Checkout --> ServerAction["Server Action: placeOrder()"]
        ServerAction --> Idempotency["Duplicate Order Prevention\n(SHA-256 Hash Guard)"]
        ServerAction --> PriceCheck["Server Price Validation\n(Database Pricing Only)"]
        ServerAction --> StockCheck["Atomic Stock Decrement\n(Prisma Transaction)"]
    end

    subgraph Database["Client Database (Prisma ORM)"]
        direction TB
        DB_Settings[("SiteSetting & Tokens")]
        DB_Catalog[("Products, Variants & Bundles")]
        DB_Orders[("Orders, Items & Delivery Details")]
        DB_Sections[("Section Drafts & Published Layouts")]
    end

    Idempotency --> DB_Orders
    PriceCheck --> DB_Catalog
    StockCheck --> DB_Catalog
    SharedTokens --> DB_Settings

    subgraph AdminPortal["Admin Control Center (/admin)"]
        direction TB
        AdminUser["Store Admin / Manager"]
        AdminUser --> OrderMgr["Order Pipeline\n(PENDING -> CONFIRMED -> SHIPPED -> DELIVERED)"]
        AdminUser --> SectionMgr["Visual Section Editor\n(Reorder, Hide/Show, Edit Draft, Live Preview, Publish)"]
        AdminUser --> BrandMgr["Theme Customizer\n(Colors, Fonts, Contact, Top Banner)"]
        AdminUser --> DeliveryMgr["Delivery Rates\n(Inside/Outside Dhaka)"]
    end

    OrderMgr --> DB_Orders
    SectionMgr --> DB_Sections
    BrandMgr --> DB_Settings
    DeliveryMgr --> DB_Settings
```

### 🔄 End-to-End Order Lifecycle

```mermaid
flowchart LR
    A["Customer Submits Guest Checkout"] --> B["Duplicate Hash Guard (3-min window)"]
    B -->|Passed| C["Server Price & Stock Validation"]
    C -->|Valid| D["Order Status: PENDING\nPayment: PENDING_COD"]
    D --> E["Admin Phone Call Verification\nStatus: CONFIRMED"]
    E --> F["Packaging & Courier Booking\nStatus: SHIPPED\n(Steadfast / Pathao Tracking)"]
    F --> G["Customer Inspects Parcel & Pays Cash\nStatus: DELIVERED\nPayment: PAID"]
```

---

## 🏗️ Architecture & Philosophy

- **Single Codebase, Client-Specific Deployments:** Keep one master codebase. Deploy each client with their own independent database (`DATABASE_URL`) and environment configuration (`.env`).
- **Brand Agnostic Design Tokens:** Shared components do NOT hardcode client colors or brand names. Dynamic CSS variables (`--brand-primary`, `--brand-accent`, `--brand-bg`, `--font-brand`, `--brand-radius`) are injected at runtime via database settings.
- **Strict Separation of Concerns:**
  - `Product` & `ProductVariant` handle catalog and SKU pricing.
  - `Order` & `OrderItem` capture point-in-time pricing snapshots.
  - `DeliveryDetail` manages recipient locations, zones, and courier tracking.
  - `PaymentTransaction` handles Cash on Delivery and digital payment records.
  - `OrderStatusHistory` tracks audit trails for every pipeline transition.
- **Server-Side Integrity:**
  - Prices are calculated strictly server-side from database records (client-provided prices are ignored).
  - Stock is checked and decremented atomically in a database transaction.
  - Duplicate order prevention via cryptographic idempotency hashing (phone + product + time window).
- **Extensibility:** Built so small-brand websites and multi-product catalog storefronts can be added later without refactoring the core order, checkout, or admin engines.

---

## 📁 Folder Structure

```
applagbe-commerce-starter/
├── prisma/
│   ├── schema.prisma            # Prisma schema (Models for settings, catalog, orders, sections)
│   └── seed.js                  # Database seed script with rich Bangladeshi demo content
├── src/
│   ├── app/
│   │   ├── (dashboard)/         # Authenticated admin layout & dashboard pages
│   │   │   ├── admin/
│   │   │   │   ├── branding/    # Client theme tokens, colors, logo, and announcement bar
│   │   │   │   ├── delivery/    # Inside/Outside Dhaka delivery rates & timelines
│   │   │   │   ├── orders/      # Order pipeline, status changes, & courier tracking
│   │   │   │   ├── products/    # Inventory levels, pricing, & bundle offers
│   │   │   │   ├── sections/    # Visual drag/reorder, visibility toggle, draft vs publish
│   │   │   │   └── page.tsx     # KPI analytics dashboard
│   │   ├── admin/
│   │   │   └── login/           # Admin authentication portal
│   │   ├── preview/             # Live draft preview mode for unreleased section copy
│   │   ├── globals.css          # Tailwind base & CSS token declarations
│   │   ├── layout.tsx           # Dynamic HTML root with token injector & fonts
│   │   └── page.tsx             # Mobile-first single-product landing page
│   ├── components/
│   │   └── ui/                  # Shared brand-agnostic design system components
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── features/
│   │   ├── admin/               # Admin actions & client components
│   │   │   ├── auth-actions.ts
│   │   │   ├── branding-actions.ts
│   │   │   ├── BrandingEditor.tsx
│   │   │   ├── delivery-actions.ts
│   │   │   ├── DeliveryEditor.tsx
│   │   │   ├── order-actions.ts
│   │   │   ├── OrdersTable.tsx
│   │   │   ├── product-actions.ts
│   │   │   ├── ProductEditor.tsx
│   │   │   ├── section-actions.ts
│   │   │   └── SectionEditor.tsx
│   │   ├── checkout/            # Server actions & validation
│   │   │   └── actions.ts       # Server-side price validation, stock check & idempotency
│   │   ├── storefront/          # Modular landing page sections
│   │   │   ├── AnnouncementBar.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── BundleOfferSection.tsx
│   │   │   ├── CheckoutSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── LandingPageRenderer.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── StickyMobileBar.tsx
│   │   │   └── UsageStepsSection.tsx
│   │   └── theme/
│   │       └── ThemeTokens.tsx  # Injects dynamic client CSS variables into :root
│   └── lib/
│       ├── auth.ts              # JWT signing & HTTP-only cookie session manager
│       ├── db.ts                # PrismaClient singleton
│       ├── districts.ts         # All 64 Bangladesh districts mapped to delivery zones
│       └── utils.ts             # Currency formatter (BDT ৳), phone sanitizer & regex
├── .env                         # Local environment variables
├── .env.example                 # Example template for client deployments
├── package.json
├── tailwind.config.ts           # Tailwind configured with brand design tokens
└── tsconfig.json
```

---

## 🗄️ Database Model Overview

```mermaid
erDiagram
    SiteSetting {
        string id PK
        string storeName
        string primaryColor
        string accentColor
        string supportPhone
        string whatsappNumber
        string announcementBar
    }

    Product ||--o{ ProductImage : has
    Product ||--o{ ProductVariant : has
    Product ||--o{ BundleOffer : has
    Product ||--o{ OrderItem : references

    Product {
        string id PK
        string slug UK
        string name
        float basePrice
        float comparePrice
        int stockQuantity
        int lowStockAlert
    }

    Order ||--|{ OrderItem : contains
    Order ||--|| DeliveryDetail : has
    Order ||--o{ PaymentTransaction : has
    Order ||--o{ OrderStatusHistory : tracks

    Order {
        string id PK
        string orderNumber UK
        string customerName
        string customerPhone
        float subtotal
        float deliveryCharge
        float totalAmount
        string orderStatus
        string paymentStatus
        string paymentMethod
    }

    PageLayout ||--|{ SectionConfig : contains
    SectionConfig {
        string id PK
        string sectionKey
        string title
        boolean isEnabled
        int sortOrder
        string publishedContent
        string draftContent
        boolean hasUnpublishedChanges
    }

    IdempotencyRecord {
        string id PK
        string keyHash UK
        string orderId
    }
```

---

## 🚀 Implementation Phases

| Phase | Scope | Status |
| :--- | :--- | :--- |
| **Phase 1: Foundation & Tokens** | Design token system, dynamic CSS variables, Prisma schema, SQLite/Postgres compatibility, and seed data. | ✅ Completed |
| **Phase 2: Mobile-First Landing Storefront** | Reusable sections (Hero, Gallery, Benefits, Steps, Bundles, Reviews, FAQ, Sticky Mobile Bar). | ✅ Completed |
| **Phase 3: Bangladesh Checkout Engine** | 64 districts lookup, BD phone validation (`01[3-9]XXXXXXXX`), auto delivery rate calculation, server price validation, stock reduction & duplicate prevention. | ✅ Completed |
| **Phase 4: Admin Portal** | Order pipeline management (Pending, Confirmed, Shipped, Delivered), product stock manager, delivery zone rates, and branding customizer. | ✅ Completed |
| **Phase 5: Visual Section Editor** | Section reordering (Up/Down), toggle visibility, draft copy editor, live draft preview mode (`/preview`), and atomic publish workflow. | ✅ Completed |

---

## ⚡ Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd applagbe-commerce-starter
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```env
DATABASE_URL="file:./dev.db" # Default SQLite for local development
JWT_SECRET="super-secret-key-at-least-32-characters"
NODE_ENV="development"
```

### 3. Setup Database & Seed
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Draft Preview:** [http://localhost:3000/preview](http://localhost:3000/preview)
- **Admin Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Demo Credentials & External Credentials Guide

### Demo Credentials (Zero Setup Required)
- **Admin Portal URL:** `/admin/login`
- **Email:** `admin@applagbe.com`
- **Password:** `admin123`

### Out-of-the-Box Local Features (No External Credentials Needed)
- **Database:** Local SQLite (`dev.db`). No database server setup needed.
- **Payment:** 100% Cash on Delivery (COD) workflow with server-side calculation and order receipts.
- **Authentication:** Self-contained secure JWT session cookies with `jose` and `bcryptjs`.
- **Duplicate Prevention:** In-database idempotency hash records preventing double submissions.

### Production Credentials (When Ready to Integrate External Vendors)
| Integration | Environment Variables | Purpose |
| :--- | :--- | :--- |
| **PostgreSQL** | `DATABASE_URL="postgresql://user:pass@host:5432/db"` | Production database (change `provider = "postgresql"` in `prisma/schema.prisma`). |
| **Steadfast Courier API** | `STEADFAST_API_KEY`, `STEADFAST_SECRET_KEY` | Automated one-click consignment creation from `/admin/orders`. |
| **Pathao Courier API** | `PATHAO_CLIENT_ID`, `PATHAO_CLIENT_SECRET` | Auto dispatch parcel booking. |
| **bKash Merchant Checkout** | `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME` | Digital advance delivery charge payments. |
| **Transactional SMS** | `SMS_API_KEY`, `SMS_SENDER_ID` (e.g. Greenweb, BulkSMS BD) | Order confirmation SMS sent to customer mobile. |
