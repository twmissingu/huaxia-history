[![English](https://img.shields.io/badge/-English-blue?style=flat-square)](README.md)
[![中文](https://img.shields.io/badge/-中文-red?style=flat-square)](README_zh.md)

---

# Huaxia History (华夏志)

Explore 5,000 years of Chinese history through an immersive cinematic experience. From the Xia dynasty to the Qing Empire, discover dynasties, events, and figures in a beautifully designed web application.

## Why This Project?

Traditional history websites feel like academic databases—dry, cluttered, and disconnected. Huaxia History reimagines the experience:

- **Cinematic first impression** — Hero screen with movie-like animations that draw you in immediately
- **Spatial understanding** — Interactive maps show where history happened, not just when
- **Rich data, clean design** — 16+ dynasties, 200+ events, 500+ figures with thoughtful filtering
- **Poetic transitions** — Ink-bleeding animations connect screens like a Chinese scroll painting unrolling

## Features

- 🎬 Movie-grade hero screen with ink drop transitions
- 📜 Interactive timeline spanning 5,000 years (Xia to Qing)
- 🗺️ Dynamic map with territory changes and historical routes
- 👥 Dynasty and figure detail pages with relationship graphs
- 🔍 Spacetime search — find events and jump to the right time and place
- 📱 Mobile-first design with native touch interactions

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/twmissingu/huaxia-history.git
cd huaxia-history

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file for Mapbox (optional, map will show without it):

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### Run

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to explore.

## For AI Agents

This project is designed for seamless AI agent interaction:

1. **Clone and install**
   ```bash
   git clone https://github.com/twmissingu/huaxia-history.git
   cd huaxia-history
   npm install
   ```

2. **Configure** (optional)
   ```bash
   # Create .env.local for Mapbox
   echo 'NEXT_PUBLIC_MAPBOX_TOKEN=your_token' > .env.local
   ```

3. **Run**
   ```bash
   npm run dev
   ```

4. **Build for deployment**
   ```bash
   npm run build
   npm run start
   ```

## Project Structure

```
huaxia-history/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Hero/Home
│   ├── timeline/           # Timeline view
│   ├── map/                # Interactive map
│   ├── dynasty/[id]/       # Dynasty details
│   ├── figure/[id]/        # Figure details
│   ├── event/[id]/         # Event details
│   └── search/             # Search page
├── components/             # React components
│   ├── ink-transition/     # Ink animation
│   ├── timeline/           # Timeline components
│   ├── map/                # Map components
│   └── hero/               # Hero components
├── data/                   # Static JSON data
│   ├── dynasties.json      # 16+ dynasties
│   ├── events.json         # 200+ events
│   └── figures.json         # 500+ figures
└── docs/                   # Documentation
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Maps**: Mapbox GL JS
- **Visualizations**: D3.js
- **Animations**: Framer Motion, GSAP

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

_华夏五千年，尽在此卷_