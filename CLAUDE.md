# CLAUDE.md — react-portfolio-2025

## Project Overview
Personal portfolio for Leffin, a multidisciplinary New Media Artist. Deployed at **leff.in** on Vercel.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: CSS Modules, Tailwind CSS, CSS custom properties
- **Animation**: framer-motion, GSAP, Lenis (smooth scroll)
- **Analytics**: Umami (website ID: `836b2b5c-a53a-48d3-88d4-06959b33b93d`)
- **Fonts**: Neuzeit Grotesk (Adobe Typekit), Times New Roman italic

## Branching Strategy
- `master` → leff.in (production)
- `2025` → 2025.leff.in (archived version)
- `refresh` → active development branch for the new version

## Content System
- **Single source of truth**: `src/projects/[slug].json` — unified metadata + content per project
- **`src/data/projects.ts`**: AUTO-GENERATED from JSON files. **Never edit manually.**
- **Generation script**: `node scripts/generate-projects-array.mjs`
- Client components import `projectsArray` from `data/projects.ts` (static, bundleable)
- Server components can use `src/lib/projects.ts` (fs-based loader with Zod validation)
- Zod schema at `src/lib/projectSchema.ts`

## Key Architecture Decisions
- `projectsArray` is used in client components (Hero.tsx, ShapesLayer.tsx) — cannot use `fs` in `data/projects.ts`
- The `[source]` catch-all route handles tracking redirects (/cv, /li, /gm)
- Light mode is the default theme (warm cream editorial palette)
- CSS custom properties: `--background: rgb(235, 232, 224)`, `--foreground: rgb(39, 39, 38)`, `--accent: #da1f26`

## Landing Page — Glyphins
The hero section uses a system called **Glyphins** (glyph + Leffin): shuffleable visual identity cards.
- Located in `src/components/glyphins/`
- `GlyphinHost.tsx` manages the shuffle cycle (earmark button in bottom-right corner)
- `glyphinRegistry.ts` registers all glyphins
- Always starts with **ShapesGlyphin** (animated rectangles forming "LEFFIN.")
- 4 glyphins: Shapes, Dictionary, Museum, Terminal
- Umami tracks shuffles as `glyphin-cycle`

## Site Structure
- `/` — Landing page (GlyphinHost → NewsSection → FeaturedProjects)
- `/projects` — Projects grid
- `/projects/[slug]` — Individual project pages (SSG from JSON)
- `/about` — Bio, exhibitions, speaking, press
- `/lab` — p5.js sketches and interactive experiments
- `/lab/dinoRevenge` — Proxied via Vercel rewrite

## Commands
- `npm run dev` — Start dev server
- `npx next build` — Production build
- `node scripts/generate-projects-array.mjs` — Regenerate projects.ts from JSON files

## Style Guidelines
- Editorial/newspaper aesthetic with warm cream background
- Neuzeit Grotesk for headings and UI (uppercase, tight tracking)
- Times New Roman italic for body/descriptive text
- Red accent (`#da1f26`) for highlights and interactive elements
- Minimal, clean layouts with generous whitespace
