# Portfolio Refresh Brainstorm

## Identity & Positioning

**One-sentence summary:** Leffin is a multidisciplinary artist-engineer who builds immersive, interactive installations that use AI and the human body to ask deeply introspective questions.

### Ten Identity Words (Ranked)

1. **Multidisciplinary** — Aerospace engineering (IIT Bombay) → Data Science (Citibank) → New Media Art (Parsons MFA with Honors). Unique trajectory, primary differentiator.
2. **Interactive** — Almost every piece demands participation. Body segmentation mirrors, conversation sculptures, digital clones. Art doesn't exist without the viewer.
3. **Technologist** — Builds the tech, doesn't borrow it. Custom ML models, real-time body segmentation, quantum computing visualizations, GAN training.
4. **Introspective** — Thematic north star. "Notes to Self" (talking to your clone), "Insecurity Mirror" (inner critic on your body), "Palimpsest" (conversations as physical form). Every piece turns the viewer inward.
5. **Embodied** — Pose detection, body segmentation, performance art, projection onto silhouettes. The body is the canvas.
6. **Immersive** — LUMA projections at 30,000-person festivals, 3-hour performances, mist-filled rooms (Ephemera). Work envelops.
7. **Experimental** — Quantum computing as art medium, GANs discovering fire, Markov chains writing fairy tales, ML-generated Unicode characters 3D printed. Territory nobody else is in.
8. **Human** — Despite all tech, every piece is about anxiety, self-perception, impermanence, meaning. Tech serves the human question.
9. **Storyteller** — Four-act narratives in "Notes to Self", Radiohead's lyrics driving performance, conversation as sculptural material. Emotional arcs, not just visual ones.
10. **Builder** — 250g surveillance drone at IIT → 6x6ft kinetic thesis → enterprise AI at Citi → B2B SaaS with 19 clients. Ships things into the real world.

### Dual Audience Problem

Two distinct audiences need different things:
- **Product design recruiters** — Want to see UX thinking, product work, systematic design
- **Creative tech / art director recruiters** — Want to see installations, experimental work, technical depth

The selected projects on the landing page addresses this with a deliberate split (see Site Structure below).

---

## Site Structure (Decided)

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page — hero doodle, news/upcoming, selected projects |
| `/projects` | Full project grid with tag-based filtering |
| `/projects/[slug]` | Individual project case study pages |
| `/about` | Story, exhibitions, press, speaking, teaching — all in one page |
| `/lab` | Interactive prototypes (external apps proxied via Vercel rewrites) |

### Landing Page (`/`) — Three Sections

**Section 1: Hero Doodle**
- Creative renditions of "Leffin" that rotate/shuffle (like Google Doodles)
- Visitors can cycle through them (click/tap the name to get a new one)
- Ideas include: dictionary definition, rectangles-to-name animation (current version), interactive treatments
- Each visit could show a randomly selected doodle
- Short description / one-liner beneath the name
- This is a growing collection — new treatments get added over time

**Section 2: News / Upcoming**
- 2-3 bullet points max about what's happening now
- Examples: "Preparing for Currents 2026", "New lab experiment: [link]", "Recently showed at [venue]"
- IMPORTANT: If this goes stale (last update 6+ months ago), it hurts more than it helps. Either commit to updating it or build it so it gracefully disappears when empty.
- Signals that the artist is active and evolving

**Section 3: Selected Projects (4 curated)**
- 4 featured projects: ~2 new media art, ~2 product design
- Addresses the dual audience problem directly — tells both audiences "I have work for you"
- Ratio should be flexible/configurable (e.g., 3 product + 1 art when job hunting for creative technologist roles, flip it when applying to festivals)
- Implementation: `featured` flag or `featuredOrder` field in project JSON, so swapping requires no code changes
- These link to individual project pages (`/projects/[slug]`)

### Projects Page (`/projects`)

- Full grid of all 22+ projects
- Tag-based filtering with AND logic (multi-select narrows results)
- URL support for filters (e.g., `?tags=design,interactive`)
- Strong thumbnails — the thumbnail IS the pitch
- Tags/categories visible on grid cards for self-filtering

### About Page (`/about`)

- The IIT Bombay → Citibank → Parsons → Artist arc
- Photo
- Short and magnetic "why" behind the practice
- Exhibitions & Festivals (LUMA, NYCxDesign, Currents, Parsons/LG, Grace) — venue names carry weight
- Speaking & Teaching (MIT Reality Hack, IBM Quantum Jam, Parsons, BrainStation, Chinatown.js)
- Press & Media (Korea Herald, The New School News, Panasonic, PRNewswire)
- All on one page, not split into separate sections/tabs

### Lab (`/lab`)

- Interactive prototypes, p5.js sketches, full apps
- Each prototype is an external Vercel app proxied via rewrites in `vercel.json`
- Link-only — not shown in the main project gallery
- Current: `/lab/dinoRevenge` → gemini-doodle.vercel.app
- Future: add more rewrite pairs as new prototypes are built
- Eventually could have a gallery of all name doodle treatments as a lab project itself

### Navigation

- Persistent nav bar with: Projects, About, Lab, Contact
- "Projects" link goes to `/projects` (separate page, sense of arrival)
- Contact can be a footer section rather than its own page

---

## Key UX Decisions & Reasoning

### Decision: Projects on separate page, NOT below the fold on landing
**Chosen:** `/projects` is its own dedicated page, accessed via nav click.

**Reasoning FOR separate page:**
- Recruiters/hiring managers who browse 10+ portfolios daily have a trained pattern: land → orient → click "Projects". Matching this expectation feels natural.
- Clicking "Projects" and arriving at a NEW page feels intentional — "I chose to go here, now I'm in the work." It creates a sense of arrival.
- The project grid gets the ENTIRE viewport. No hero section above it eating space. No "am I still on the landing page?" ambiguity.
- Each section (landing vs projects) can evolve independently.

**Reasoning AGAINST projects below the fold (rejected):**
- When you click "Projects" in nav and it just smooth-scrolls down the same page, it feels underwhelming — "oh it was just here." No sense of arrival.
- The hero doodle section gets scrolled past quickly and forgotten if projects are right below.
- Adding more doodle variations would increase the "distance" to projects.

### Decision: Landing page IS scrollable (not a single static screen)
**Chosen:** Landing has 3 scroll sections (hero → news → selected projects).

**Reasoning:**
- A single non-scrollable screen feels broken — people instinctively try to scroll and get frustrated when nothing happens.
- But the scroll content is NOT the full project grid — it's curated content (news + 4 selected projects) that rewards scrolling without replacing `/projects`.
- The selected projects section serves as a taste/preview, not the main gallery.

### Decision: Landing page has an intro/hero, not projects-first
**Chosen:** Hero doodle with name + description comes first.

**Reasoning FOR an intro:**
- Nobody lands on a portfolio without context (they clicked from LinkedIn, email, Instagram), but they still need a moment to orient — "whose work am I looking at?"
- An intro beat lets visitors process "okay, this is an interactive artist, I'm in the right place" before making choices.
- Without an intro, landing directly on a grid of 22 unlabeled projects is jarring.

**What to AVOID in the intro:**
- Full-screen animations that delay access to content
- Scroll-to-continue gatekeeping
- Multiple paragraphs about philosophy
- Anything that makes the visitor work before they can explore

**What the intro SHOULD be:**
- Name, one-liner, a visual that sets the tone
- A complete moment — not a gateway, not a scroll-past
- Single viewport height max

### Decision: Exhibitions/Speaking/Press all on About page, not separate sections
**Chosen:** One `/about` page contains story + exhibitions + speaking + press.

**Reasoning:**
- 9 separate nav sections is too much navigation for a portfolio
- Exhibitions, speaking, and press are all credibility signals — they belong together
- A curator doesn't need three clicks to verify legitimacy
- Resume is a downloadable PDF link on About, not its own section

### Decision: Process content lives inside project case studies, not its own section
**Chosen:** No separate "Process" or "Behind the Scenes" page.

**Reasoning:**
- Process (sketches, ML training, fabrication, iteration) has the most impact when shown alongside the finished work it produced
- A standalone process page lacks context — "what was this sketch for?"
- Each project case study can include a process section where it matters

---

## Sections/Features Considered but Rejected

### Blog
**Rejected.** Unless you'll actually write regularly, an empty or stale blog hurts more than no blog. The news/upcoming section on the landing page fills the "what's current" need without the commitment.

### Services Page
**Rejected.** Makes sense for freelancers/agencies, not an artist portfolio.

### Testimonials
**Rejected.** Feels corporate for this vibe.

### Separate Resume Page
**Rejected.** A downloadable PDF link on the About page is sufficient. Doesn't warrant its own section.

### Projects as smooth-scroll anchor on landing page
**Rejected.** See "Key UX Decisions" above. Separate page provides better sense of arrival.

### Non-scrollable single-screen landing
**Rejected.** People instinctively scroll and feel stuck when nothing happens. Landing needs scroll depth.

### "Start Here" / forced walkthrough
**Rejected.** People want agency — they engage more when they choose what to explore. A forced linear order ("here's my best project, then my second best...") feels like a slideshow.

---

## Visual Direction (Still Open)

### Two core philosophies to choose between:
1. **The work dominates** — Dark/clean background, projects are the visual spectacle, site stays out of the way. (Olafur Eliasson, MoMA collection, Gagosian)
2. **The site is the work** — Generative backgrounds, interactive elements, the portfolio itself demonstrates your skills. (Your own "Notes to Self" philosophy)

### Recommended approach:
Lean toward #2 but restrained. A subtle generative background or one interactive moment on the landing (the doodle hero) that proves craft, then get out of the way for actual projects. Going full "site as installation" risks competing with the work. A small taste is better.

### 10 Aesthetic Concepts (from earlier brainstorm):
1. **"The Dark Gallery"** — Black background, full-bleed imagery, minimal UI. Like walking into a darkened gallery.
2. **"The Interactive Canvas"** — Website itself is a piece of work. Mouse/webcam effects on landing.
3. **"Split Worlds"** — Two modes: "Engineer" and "Artist" toggled by user. Risky but memorable.
4. **"The Archive"** — Museum catalog feel. White space, Helvetica, institutional. Won't date.
5. **"Cinematic Scroll"** — Full-screen video sections, parallax, ambient sound. Film-like.
6. **"Brutalist Code"** — Monospace, raw edges, terminal UI. Anti-polish.
7. **"The Bento Grid"** — Modern asymmetric grid, mixed content blocks. Current design language.
8. **"Organic Machine"** — Generative Perlin noise background. Warm tones. Tech rendered as nature.
9. **"Projection Mapped"** — Content projected onto 3D surfaces. Tied to signature medium.
10. **"The Dual-Layer Folio"** — Clean top layer + toggleable "deeper layer" with raw process. Rewards curiosity. Most interesting structurally but high content maintenance cost.

No concept chosen yet — still deciding.

---

## Hero Doodle Concepts (Growing Collection)

Ideas for the rotating name treatments:
1. **Dictionary entry** — Define "Leffin" with personality
2. **Rectangles-to-name** — Current version, animated shapes resolving into name
3. **Terminal/CLI** — Name types out like a command prompt
4. **Boarding pass / event ticket** — Name on a ticket
5. **Newspaper masthead** — Editorial typography
6. **Recipe card** — "Ingredients: 1 part design, 2 parts code, a pinch of chaos"
7. **Museum placard** — Gallery label format
8. **Interactive/generative** — p5.js or canvas-based treatments that respond to mouse/touch

These can be added incrementally. Each visit shows one (randomly or sequentially). Users can shuffle through them.

---

## Technical Decisions (Already Implemented)

### `/lab` route prefix
- Prototypes live under `/lab/<name>` via Vercel rewrites in `vercel.json`
- External apps proxied transparently — URL stays on `leff.in`

### Content system
- Single source of truth: `src/projects/[slug].json`
- `src/data/projects.ts` auto-generated from JSON files (do not edit manually)
- Featured projects can be driven by a `featured` field in JSON (to be added)

---

## Open Questions

1. **Visual direction** — Which aesthetic concept? Leaning toward restrained interactive (#2/#8) but not decided.
2. **Doodle implementation** — How to architect the rotating hero treatments? Separate components loaded dynamically? A registry/config?
3. **News section data source** — Hardcoded in a JSON file? A simple markdown file? Part of the CMS?
4. **Featured projects configurability** — Add `featured` and `featuredOrder` fields to the Zod schema and project JSONs?
5. **Page transitions** — Should navigating between pages have transitions (framer-motion page animations)?
6. **Mobile nav** — Hamburger menu? Bottom tab bar? How does the nav work on mobile?
7. **"Now" section staleness** — How to handle when there's nothing upcoming? Hide the section? Show a default?
