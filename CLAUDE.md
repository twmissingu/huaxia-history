# CLAUDE.md — Huaxia History (华夏志)

## Project Overview

A cinematic-grade immersive Chinese history visualization website built with Next.js 15. Features movie-like hero screen with ink transition animations, interactive timeline, dynamic maps with historical territory changes, and rich dynasty/figure detail pages.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Maps**: Mapbox GL JS
- **Visualizations**: D3.js
- **Animations**: Framer Motion, GSAP
- **Data**: Static JSON files

## Key Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Generate AI images
npm run generate-images

# Build geo data
npm run build:geo
```

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx             # Hero/Home page
  timeline/            # Timeline page
  map/                 # Interactive map
  dynasty/[id]/        # Dynasty detail pages
  figure/[id]/        # Figure detail pages
  event/[id]/         # Event detail pages
  search/             # Search page

components/            # React components
  ink-transition/     # Ink drop animation
  timeline/           # Timeline components
  map/                # Map components
  hero/               # Hero components
  dynasty/            # Dynasty components
  figure/             # Figure components

data/                  # Static JSON data
  dynasties.json      # Dynasty data
  events.json         # Historical events
  figures.json        # Historical figures
  geo/                # Map geojson data
```

## Important Patterns

### Ink Transition
- Used for page transitions (hero → content)
- 1.2s duration: 0.4s drop + 0.8s spread
- Located in components/ink-transition/

### Context-Aware Navigation
- Navigation shows current context (dynasty/time/location)
- Not a generic menu, shows "where you are in history"

### Data Architecture
- JSON files use `richness` field: `thin` / `medium` / `rich`
- Pages automatically adapt content density based on this field
- Future API integration will just replace dataLoader

## Design Guidelines

### Colors
- Hero: Dark cinematic scene
- Content pages: Light rice paper texture
- Dynasty-specific atmosphere colors (Tang golden, Song cyan, etc.)
- Primary accent: `#c9372c` (Qin/Han cinnabar red)
- Secondary: `#d4af37` (Tang/Song gold)

### Fonts
- Headlines: Source Han Serif (思源宋体)
- Body: Source Han Serif Regular
- Numbers: JetBrains Mono
- Decorative: ZCOOL XiaoWei (minimal use)

### Responsive
- Mobile-first design
- Hero: Full-screen cinematic, swipe up for title (TikTok-style)
- Timeline: Vertical scroll, horizontal dynasty cards
- Map: Standard pinch-zoom (Baidu/AMap style)

## Data Files

All data in `data/` folder - static JSON designed for future API migration:
- `dynasties.json` - 16+ Chinese dynasties with metadata
- `events.json` - 200+ historical events
- `figures.json` - 500+ historical figures
- `geo/` - Mapbox-compatible geojson for territories, rivers, cities

## Dependencies

Key packages:
- `next`: ^15.1.0
- `react`: ^19.0.0
- `mapbox-gl`: ^3.9.0
- `d3`: ^7.9.0
- `framer-motion`: ^12.0.0
- `gsap`: ^3.12.0
- `lucide-react`: ^0.469.0
- `@tanstack/react-virtual`: ^3.11.0

## API Keys Required

- Mapbox access token: Create `.env.local` with `NEXT_PUBLIC_MAPBOX_TOKEN=your_token`

## Documentation

- `docs/CONTEXT.md` - Detailed design specifications
- `docs/development-plan.md` - Project roadmap
- `docs/ai-image-prompts.md` - AI image generation prompts