# Shruhi Collections 2.0 — Headless Next.js 15 Storefront

Official headless digital flagship for **Shruhi Collections Surat** (`shruhicollections.in`), engineered with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## Architecture Overview

```mermaid
flowchart TD
    A["catalog.json (59 Loom Editions)"] --> B["lib/catalog.ts (Typed Domain Model)"]
    B --> C["app/page.tsx (SSG Lookbook Homepage)"]
    B --> D["app/products/[slug]/page.tsx (59 Dynamic SSG Product Pages)"]
    B --> E["app/collections/[slug]/page.tsx (Curvy, Festive, Menswear Hubs)"]
    C --> F["components/CurvyFitEngine.tsx (Interactive S–6XL Precision Sizing)"]
    C --> G["components/WhatsAppConciergeDock.tsx (Mobile Floating Concierge)"]
```

---

## Key Features

1. **Curvy Couture Precision Sizing Engine (`CurvyFitEngine.tsx`):**
   - Interactive Bust, Waist, and Hip body measurement calculator.
   - Computes tailored comfort ease from **S (36)** to **6XL (52)** with 99% fit confidence scoring.
   - 1-click lookbook filtering to the user's computed size.

2. **59 Static-Site Generated (SSG) Canonical Product Pages:**
   - Pre-rendered at build time with `generateStaticParams()` for sub-80ms First Contentful Paint.
   - Embedded Google-compliant **Schema.org `Product` & `Offer` JSON-LD** structured data for rich snippet authority.

3. **Mobile-Native Sticky WhatsApp Concierge Dock:**
   - Persistent bottom dock with live atelier weaver status.
   - 1-click **Video Call Fabric Inspection** and **Direct Loom WhatsApp Purchasing**.

4. **Multi-Platform Deployment Ready:**
   - Native support for **Vercel** (`vercel.json`), **Cloudflare Pages** (`@cloudflare/next-on-pages`), and Docker containers.

---

## Local Development & Setup

```bash
# 1. Navigate to the storefront directory
cd storefront-nextjs

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# Accessible at http://localhost:3000

# 4. Production build
npm run build
npm start
```

---

## Production Deployment to Vercel

```bash
# Deploy to Vercel Edge
npx vercel --prod
```
