# CLAUDE.md — Crescent Academy Frontend Upgrade Master Specification

## Project Identity
- **Project**: Crescent Academy Website — World-Class Frontend Upgrade
- **Live URL**: https://crescent-academy-frontend.vercel.app/
- **Framework**: Next.js (App Router, route group `app/(public)/` for public pages)
- **Styling**: Tailwind CSS v4 (`tailwind.config.mjs`)
- **Animation**: Framer Motion (already installed)
- **Icons**: @tabler/icons-react + lucide-react (already installed)
- **Constraint**: Frontend-only. Do NOT modify backend, API routes (`app/api/`), database logic (`lib/db*`, `lib/mongodb*`, `models/`), server actions, auth (`auth.ts`, `middleware.ts`), or `.env` files.

---

## Route Structure (Important)
All public marketing pages live under `app/(public)/` (route group, no URL segment):
- Home: `app/(public)/page.tsx`
- About: `app/(public)/about/page.tsx`
- Admissions: `app/(public)/admissions/page.tsx`
- Gallery: `app/(public)/gallery/page.tsx`
- Achievements: `app/(public)/achievements/page.tsx`
- Leadership: `app/(public)/leadership/page.tsx`
- Fees: `app/(public)/fees/page.tsx`
- Contact: `app/(public)/contact/page.tsx`
- News: `app/(public)/news/page.tsx`
- etc.

Public layout: `app/(public)/layout.tsx`
Root layout: `app/layout.tsx` (wraps everything including portals — do not break SessionProvider here)

---

## Design System

### Color Tokens — `app/globals.css`
```css
:root {
  --ca-green: #1B4332;
  --ca-green-mid: #2D6A4F;
  --ca-green-light: #52B788;
  --ca-gold: #C9A84C;
  --ca-gold-light: #E9C46A;
  --ca-navy: #0A1628;
  --ca-navy-mid: #112240;
  --ca-cream: #F8F5F0;
  --ca-white: #FFFFFF;
  --ca-text-primary: #0A1628;
  --ca-text-secondary: #3D5166;
  --ca-text-muted: #7A8FA6;
  --ca-border: rgba(27, 67, 50, 0.12);
  --ca-border-gold: rgba(201, 168, 76, 0.3);
  --section-padding: clamp(4rem, 8vw, 7rem) 0;
  --container-max: 1200px;
  --type-display: clamp(2.5rem, 6vw, 5rem);
  --type-h1: clamp(2rem, 4vw, 3.5rem);
  --type-h2: clamp(1.5rem, 3vw, 2.25rem);
  --type-h3: clamp(1.125rem, 2vw, 1.5rem);
}
[data-theme="dark"] {
  --ca-text-primary: #F0EDE8;
  --ca-text-secondary: #A8B8C8;
  --ca-text-muted: #6A7A8A;
  --ca-cream: #0A1628;
  --ca-white: #112240;
  --ca-border: rgba(201, 168, 76, 0.15);
}
```

### Typography
- **Display/Headlines**: `Playfair Display` (Google Fonts, weights 400/500/700) — all H1, H2, section titles
- **Body/UI**: `DM Sans` (Google Fonts, weights 300/400/500) — body, nav, buttons, captions
- **Arabic**: `Amiri` — Quranic text on hero
- Load via `next/font/google` in `app/layout.tsx`, NOT via `<link>` tags

### Tailwind Config Extensions (`tailwind.config.mjs`)
```js
theme: {
  extend: {
    colors: {
      ca: {
        green: '#1B4332', 'green-mid': '#2D6A4F', 'green-light': '#52B788',
        gold: '#C9A84C', 'gold-light': '#E9C46A',
        navy: '#0A1628', 'navy-mid': '#112240', cream: '#F8F5F0',
      }
    },
    fontFamily: {
      display: ['Playfair Display', 'Georgia', 'serif'],
      sans: ['DM Sans', 'system-ui', 'sans-serif'],
    },
  }
}
```

---

## Packages to Install
```bash
npm install @tabler/icons-react clsx tailwind-merge class-variance-authority
```
(framer-motion already at v12.34.3)

---

## Component Architecture

### Global Layout Components
- `components/layout/Navbar.tsx` — full rebuild (transparent→solid on scroll, mega menu, mobile overlay, dark mode toggle)
- `components/layout/Footer.tsx` — full rebuild (prayer times API, newsletter, fixed social links)
- `components/layout/PageTransition.tsx` — Framer Motion AnimatePresence wrapper

### UI Primitives
- `components/ui/SectionHeader.tsx` — eyebrow + title + subtitle + gold underline
- `components/ui/GoldButton.tsx` — variants: primary/secondary/ghost, rounded-full, hover lift
- `components/ui/Card.tsx` — variants: feature/news/achievement/testimonial/stat
- `components/ui/IslamicPattern.tsx` — SVG 8-pointed star, variants: full/corner/strip
- `components/ui/AnimatedCounter.tsx` — Intersection Observer, counts 0→target
- `components/ui/ScrollReveal.tsx` — whileInView wrapper, direction: up/left/right/none
- `components/ui/StaggerContainer.tsx` — staggerChildren Framer Motion wrapper
- `components/ui/Lightbox.tsx` — full-screen, keyboard nav, touch swipe, focus trap
- `components/ui/PrayerTimes.tsx` — Aladhan API client component, graceful fallback
- `components/ui/FeeCalculator.tsx` — client-side fee calculator
- `components/ui/WhatsAppButton.tsx` — fixed bottom-right, expands on hover
- `components/ui/AnnouncementBar.tsx` — dismissable top bar (sessionStorage)

### Providers
- `components/providers/ThemeProvider.tsx` — localStorage `ca-theme`, sets `data-theme` on `<html>`

---

## Critical Bugs to Fix First

1. **Animated counters broken** — Stats show "0+" forever. Implement `AnimatedCounter.tsx` with IntersectionObserver.
2. **Footer social links → "#"** — Replace with real URLs or remove. Never ship dead links.
3. **Admissions page is a dead-end** — Add mailto-based enquiry form.
4. **Mobile nav** — Verify hamburger closes on link click; lock body scroll when open.
5. **Font loading** — Move to `next/font/google` if using `<link>` tags.
6. **Missing meta tags** — Use `generateMetadata` per page for unique title + description.

---

## Homepage Sections (Rebuild Order)

1. Hero — 100dvh, dark overlay + IslamicPattern, staggered entrance, floating stat cards, scroll indicator
2. Stats Bar — AnimatedCounter ×4 (16+ yrs, 150+ prizes, 30+ awards, 3 sections), dark green bg
3. Proprietor Message — two-column, gold quote mark, scroll entrance animation
4. Mission/Vision/Philosophy — 3 cards, gold top border, Islamic corner, hover lift
5. Why Choose Crescent — 6 cards, filter tabs (All/Academic/Spiritual/Holistic), AnimatePresence
6. Gallery Preview — masonry grid, hover caption overlay, opens Lightbox
7. History Timeline — horizontal scroll on desktop, vertical on mobile, gold nodes
8. Testimonials — auto-playing carousel, pause on hover, dot indicators
9. News Preview — 3 cards, category tabs
10. Prayer Times Strip — PrayerTimes component, Hijri date, current prayer highlighted
11. CTA Banner — dark navy, IslamicPattern, split layout, crescent SVG watermark
12. Newsletter — inline form, success animation

---

## Page Specifications

### Admissions (`/admissions`)
- Hero with breadcrumb
- 5-step visual indicator bar (decorative)
- Each step as horizontal card (step number decorative, icon, title, description, action)
- **Enquiry form**: Name, Phone, Email, Child Name, Age select, Section select, Referral select, Message → `mailto:` action
- Requirements checklist (visual)
- Fee overview teaser → link to /fees

### Gallery (`/gallery`)
- Filter bar: All/Classroom/Assembly/Sports/Qur'anic Studies/Science Lab/Awards/Events
- CSS Grid masonry (3 cols desktop, 2 tablet, 1 mobile)
- Lightbox with keyboard, touch swipe, focus trap, body scroll lock

### Achievements (`/achievements`)
- Gold hero banner with animated total prize counter
- Filter by category + year, sort controls
- Achievement cards: color-coded top border, trophy icon, award name, competition, year, position badge
- Highlight Reel — 3 featured cards with images

### Leadership (`/leadership`)
- Proprietor: large 60/40 two-column, gold ring portrait, biography, personal vision quote
- Team grid: photo/initials avatar, name (Playfair), title, bio, hover gold border, qualifications

### Fees (`/fees`)
- Tab switcher: Nursery & Primary / Secondary / Vocational (AnimatePresence)
- Fee table per section: item | amount (₦), total row highlighted
- FeeCalculator widget: select section + number of children → total per term/session
- Payment info + WhatsApp CTA

### Contact (`/contact`)
- Two-column: left (address, phone, email, WhatsApp CTA, office hours) / right (contact form → mailto)
- Full-width Google Maps iframe (Panada Area, Iwo, Osun State)
- Virtual tour placeholder card

---

## Animation System

### ScrollReveal Props
```typescript
interface ScrollRevealProps {
  children: ReactNode
  delay?: number         // default 0
  direction?: 'up' | 'left' | 'right' | 'none'  // default 'up'
}
// y: 40→0, opacity: 0→1, duration 0.6s, ease [0.22, 1, 0.36, 1]
// viewport: { once: true, margin: "-100px" }
```

### Page Transition
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
>
```

### Accessibility: Reduced Motion
Wrap ALL motion with `useReducedMotion()` check — skip animations if true.

---

## Performance Requirements
- All images: `next/image` with `sizes` prop + explicit width/height
- Gallery images: lazy loaded (default for below-fold `next/image`)
- Framer Motion: use `LazyMotion` with `domAnimation` feature bundle
- Google Fonts: `display: 'swap'`
- Target: Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO) on mobile

---

## Accessibility Requirements
- Skip-to-content link as first body element
- All images: descriptive `alt` text
- Icon-only buttons: `aria-label`
- All text: WCAG AA contrast (4.5:1 body, 3:1 large)
- Focus rings: `focus-visible:ring-2 focus-visible:ring-[--ca-gold]`
- Keyboard nav: all interactive elements reachable
- Lightbox: focus trap + restore on close
- Form inputs: `<label>` for every field (not just placeholder)
- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`

---

## Do NOT Touch
- `app/api/` — all API routes
- Files with `'use server'`
- `prisma/`, `models/`, `lib/dbConnect.ts`, `lib/mongodb.ts`
- `.env`, `.env.local`
- `auth.ts`, `middleware.ts`
- `app/portals/dashboard/` — protected dashboard
- `next.config.ts` (unless adding image domains)

---

## School Constants (`lib/constants.ts`)
```typescript
export const SCHOOL = {
  name: "Crescent Academy",
  tagline: "Nurturing the Complete Child",
  phone: "+234 803 254 5074",
  whatsapp: "2348032545074",
  email: "info@crescentacademy.edu.ng",
  address: "Beside Car Wash, Along Water Works, Panada Area, Iwo, Osun State",
  city: "Iwo",
  state: "Osun State",
  country: "Nigeria",
  founded: 2010,
  prayerApiUrl: "https://api.aladhan.com/v1/timingsByCity?city=Iwo&country=Nigeria&method=3",
  whatsappUrl: "https://wa.me/2348032545074?text=Hi%2C%20I%20am%20interested%20in%20Crescent%20Academy",
  admissionsEmail: "info@crescentacademy.edu.ng",
}

export const STATS = [
  { target: 16, suffix: "+", label: "Years of Excellence" },
  { target: 150, suffix: "+", label: "Prizes & Awards" },
  { target: 30, suffix: "+", label: "Distinguished Awards" },
  { target: 3, suffix: "", label: "School Sections" },
]
```

---

## Implementation Order
1. Install packages
2. Create `lib/constants.ts`
3. Update `app/globals.css` with CSS design tokens
4. Update `tailwind.config.mjs` with ca- color palette + font families
5. Update `app/layout.tsx` with Playfair Display + DM Sans fonts
6. Build ThemeProvider + wire dark mode
7. Fix critical bugs (counters, dead links, mobile nav)
8. Build UI primitives: ScrollReveal, StaggerContainer, IslamicPattern, GoldButton, SectionHeader, AnimatedCounter
9. Rebuild Navbar (layout component)
10. Rebuild Footer (layout component, prayer times)
11. Add WhatsAppButton + AnnouncementBar to `app/(public)/layout.tsx`
12. Rebuild homepage section by section
13. Rebuild Admissions + enquiry form
14. Rebuild Gallery + Lightbox
15. Build Achievement wall
16. Rebuild Leadership, Fees (+ calculator), Contact
17. Add PageTransition to `app/(public)/layout.tsx`
18. Audit accessibility + performance
