# AI Іздеу — Design System (MVP)

## Product context

**AI Іздеу** is a Kazakhstan local-commerce search MVP. Pilot: Almaty flower shops. Users describe what they want in natural language (KZ/RU); AI matches catalog offers with real prices only; handoff is WhatsApp (`wa.me`) — no on-site checkout, courier, order accept/reject, or 500 ₸ fee collection.

**JTBD:** Find a flower offer in Almaty fast, then message the shop on WhatsApp with a clear draft.

**Key screens (mobile 390×844):**
1. **Home** — brand hero + natural-language search
2. **Results** — ranked offers with prices (hide if price missing)
3. **WhatsApp preview** — editable draft + open WhatsApp
4. **Shop cabinet** — stub for shop catalog / WhatsApp number (no order inbox)

## Brand

- Name: **AI Іздеу** (hero-level brand signal on Home)
- Locale UI: Kazakh primary, Russian secondary (labels bilingual where space allows)
- Tone: calm, local, trustworthy — not marketplace-checkout chrome

## Visual direction (adapted from Nature Inspired Style)

Earthy “Forest & Sage” story for flowers, mobile-first app chrome (not a marketing landing). Avoid purple gradients, terracotta-on-cream editorial, and dark-mode-first looks.

### Color

| Token | Hex | Use |
|-------|-----|-----|
| `--forest` | `#01472E` | Primary text, primary CTA fill, strong accents |
| `--sage` | `#CCD5AE` | Soft section backgrounds, chips |
| `--olive` | `#E9EDC9` | Secondary surfaces |
| `--moss` | `#A3B18A` | Borders, muted icons |
| `--mist` | `#F3F5EF` | App background (cool off-white, not cream) |
| `--surface` | `#FFFFFF` | Offer rows / input surfaces |
| `--muted` | `#5C6B5A` | Secondary copy |
| `--danger` | `#9B2C2C` | Errors only |

Do **not** invent prices with decorative “from ₸…” placeholders when price is unknown — omit the offer.

### Typography

- Display / brand: **Manrope** 700–800 (expressive sans; not Inter/Roboto/Arial)
- Body / UI: **Manrope** 400–600
- Labels: 11–12px uppercase tracking `0.12em` for meta (city, category)
- Search input: 16px+ (mobile comfort)
- Brand wordmark on Home: large, dominant, above the headline

### Layout & components

- Mobile viewport ~390×844, single column, generous 16–20px horizontal padding
- **No cards in hero.** Results use simple list rows (subtle divider or light surface) — not heavy card chrome
- Search: full-width field + forest primary button “Іздеу / Найти”
- Offer row: shop name, product title, real price `₸`, short match reason, CTA “WhatsApp”
- Preview: message textarea, shop phone hint, primary “WhatsApp-қа жіберу”, secondary copy
- Shop cabinet: shop name, WhatsApp number field, product list stub — **no** order accept/reject UI
- Corners: 12–16px on inputs/buttons; avoid extreme 5rem blobs on app screens
- Soft forest-tinted shadow only on floating bottom bar if used: `0 8px 24px rgba(1,71,46,0.12)`
- Optional light SVG noise overlay ≤4% opacity — keep subtle on mobile

### Motion (2–3 intentional)

1. Home: brand + search fade/slide up on load (`cubic-bezier(0.16, 1, 0.3, 1)`, ~600–800ms)
2. Results: staggered row reveal (40–60ms delay)
3. Preview: soft pulse on primary WhatsApp CTA once

### Content rules for mock UI

- Sample city: Алматы / Алматы
- Sample query: «Анама қызғылт раушан, 15000 теңгеге дейін»
- Sample shops: local flower names (e.g. Gül Almaty, FloraHome)
- Prices only when known; never invent
- Never show checkout, cart, courier map, or 500 ₸ commission UI

## Architecture note (for implementers)

Nuxt routes: `/`, `/results`, `/preview`, `/shop`. API: search + products + whatsapp-preview. Handoff via `wa.me`.
