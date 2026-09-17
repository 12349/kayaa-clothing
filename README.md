# Kayaa Clothing — Atelier & Custom Indian Womenswear Pitch Prototype

A pitch-ready, bespoke e-commerce prototype tailored for **Kayaa Clothing**, a one-woman Indian womenswear label run from a New Delhi home studio (85,000 Instagram followers).

---

## The Two Core Operational Problems Solved

1. **The Impersonation Crisis**: Scammers reply to her Instagram comments with fake WhatsApp numbers, demand advance UPI/GPay transfers, and vanish. This site establishes a single canonical, verified official channel with cryptographic order numbers (`KY-YYMM-XXXX`), pre-filled `wa.me` deep links, and a public `/verify` authenticity lookup.
2. **Order Chaos**: Sizing preferences, custom sleeve lengths, lehenga floor drops, fall-and-pico finishing, event dates, and payment proofs were scattered across WhatsApp chats. This platform unifies all specs into a single studio ledger with an interactive Kanban production board, print-ready A4/A5 packing slips, and studio cutting worksheets.

---

## Design System & Token Architecture

The aesthetic explicitly rejects generic "cream + serif + terracotta" e-commerce templates in favor of a quiet, craft-grounded material language derived from the tailor's atelier:

- **Jamun Ink** (`#231628`): Deep aubergine-black structural ground and garment label typography.
- **Kora Silk** (`#FBF8F4`): Raw unbleached mulberry silk canvas.
- **Gulab Madder** (`#C87A74`): Running stitch rules, tailoring callouts, and measuring highlights.
- **Panna Jade** (`#115E59`): *Strictly reserved* for official verification badges, WhatsApp authenticity confirmation, and honest in-stock counters.
- **Chalk Buff** (`#EDE5D8`): Soft tailor’s chalk surfaces and selvedge seams.

### Typography
- **Fraunces** (Google Fonts): Garment label-feel display headings and price tags.
- **Albert Sans** (Google Fonts): Crisp, tabular tailor’s ledger notation and measurement charts.

### Zero Remote Images (Procedural SVG Textiles)
Garment imagery is rendered via inline vector generators mathematically derived from each product's natural dye colour pair:
- **Buti**: Scattered almond / mango floral motifs on fine weave.
- **Jaal**: Interlocking diamond lattice vines with rosette centers.
- **Bandhani**: Traditional clustered 5-dot tie-and-dye ring dots.
- **Leheriya**: Fluid diagonal ripple waves.
- **Stripe**: Tailor’s fine warp-faced zari thread lines.

---

## Key Routes & Capabilities

| Route | Functionality |
| :--- | :--- |
| `/` | Editorial atelier hero, quiet craftsmanship pillars, featured pieces, canonical WhatsApp panel. |
| `/shop` | Full catalogue with category filters (Anarkali, Lehenga, Saree & Blouse, Kurta Set, Co-ord, Dupatta), M2M filter, and in-stock filter. |
| `/product/:slug` | Bold cutting room: interactive procedural fabric swatch, honest stock counters (struck-through "none left", "only 3 left" scarcity badge, "made to order"), inline bespoke measurement form with range validation, and exact arrival date calculation. |
| `/size-guide` | Complete standard measurement chart (Inches/CM persistent toggle), interactive 6-point dress form SVG, and Find-My-Size recommendation calculator. |
| `/bag` | Cart overview with expandable custom measurement inspection and clear surcharge breakdown. |
| `/checkout` | Seamless guest checkout (no signup wall), country-driven transit calculation, prominent UPI payment simulation, COD rules (restricted to India, disabled for M2M > ₹4,000), and attribution questionnaire. |
| `/order/:id` | Official confirmation, 6-stage production stepper, pre-filled WhatsApp deep link, and post-delivery fit review form unlock. |
| `/order/:id/receipt` | Print-optimized A4/A5 packing slip with full measurements and tear-off shipping label block. |
| `/order/:id/worksheet` | Studio cutting worksheet (measurements, fabric, notes, due date only; no prices) for pinning to the fabric table. |
| `/verify` | Public anti-impersonation registry to verify genuine order numbers and detect scam reference codes. |
| `/admin` | PIN-gated (`1984`) owner console: 7-stage Kanban board with amber/red urgency alerts, Pieces table with &lt;60s Instagram Quick-Add, Capacity Calendar, Customer CRM with fit-feedback flags, and analytics. |
| `/about` | Kayaa’s studio story, natural handloom philosophy, and textile care instructions. |

---

## Technical Architecture

- **Framework**: Vite + React 18/19 + TypeScript + Tailwind CSS
- **Routing**: `react-router-dom`
- **Data Boundary**: Single async module `src/data/repository.ts` backed by `localStorage` and seeded from `src/data/seed.ts` on initial load.
- **Icons**: `lucide-react` + custom SVG icons
- **Formatting**: `Intl.NumberFormat` and `Intl.DateTimeFormat` (zero hand-rolled formatting).

---

## Production Readiness: Simulated vs. Real Backend

This pitch prototype is architected with a strict repository boundary (`src/data/repository.ts`) so that a real backend can be swapped in without altering frontend components.

| Component | In This Prototype | What Production Requires |
| :--- | :--- | :--- |
| **Data Storage** | `localStorage` behind async repository functions | PostgreSQL / Supabase / MongoDB behind a REST or GraphQL API. |
| **Payments** | Simulated UPI QR mockup, simulated card tokenization, simulated COD | Razorpay or Cashfree Payment Gateway (supporting instant UPI intents, credit/debit cards, and COD verification via OTP). |
| **Authentication** | Client-side 4-digit PIN gate (`1984`) | Session JWT / OAuth2 provider with role-based access control (RBAC). |
| **Image Hosting** | Procedural inline SVG textile motifs | Cloudinary or AWS S3 CDN for user/studio photo uploads with image optimization. |
| **WhatsApp Integration**| Prefilled `wa.me` deep links | WhatsApp Business Cloud API for automated dispatch webhooks and tracking notifications. |
| **Shipping Logistics** | Config-driven transit days (India: 2–4d, US/UK: 7–12d, UAE: 4–7d) | Shiprocket / Delhivery / DHL Express API integration for automated AWB generation and live pickup scheduling. |

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev

# 3. Build production bundle
npm run build
```
