# Eschenbach Studio — Portfolio & Archive Concept

## Original Notes
- vibe of the site very image focused 
- big pictures and maybe videos that blend in to each other/ get overlayed by text 
- eventhough i want to advocate my it skills very much design kind of vibe for the site big nature images scrolling will overlay with text
- first just a scroll down page images and text in a fluid kind of way 
- then as the second part i want to have kind of an archive of all projects i did in the past and a visuilasation of them in a space kind of like in obsidian so they are free floating and grouped in a way by tags etc and by clicking ether i get to a sub site of my site or for now maybe just linked to my github profile

---

## Finalized Concept & Architecture

### 1. Brand & Aesthetic Direction
- **Identity**: **Eschenbach Studio** — Linus Eschenbach (Full-Stack Web Development & Modern Frontend/UI).
- **Visual Mood**: Dark, moody & atmospheric nature (deep forest greens, mist, dark water, alpine night sky).
- **Color Palette**:
  - Deep Obsidian / Night (`#080c0a` – `#0d1411`)
  - Forest Mist / Pine (`#182620` – `#2c4237`)
  - High-Contrast Warm Ivory Text (`#f0ede6`) & Muted Sage/Stone Secondary (`#9aab9f`)
  - Subtle Bioluminescent / Moss Accent (`#7ba888`) for interactive nodes & highlights
- **Typography**: Editorial pairing — expressive high-contrast Serif for poetic headlines paired with clean geometric Sans/Mono for technical metadata and navigation.

### 2. Part 1 — The Fluid Scroll Narrative (`/`)
A full-viewport scrollytelling experience where pinned, full-bleed atmospheric nature scenes (high-res photography & subtle ambient video loops) crossfade smoothly as poetic, design-forward text floats past:
1. **Scene I — Emergence (Misty Canopy / Dawn)**: Intro to **Eschenbach Studio** & Linus Eschenbach. Framing software like natural ecosystems—quiet, resilient, and intentional.
2. **Scene II — Philosophy (Dark Flowing Water / Stone)**: How you work—bridging rigorous full-stack engineering with tactile, modern frontend craft.
3. **Scene III — Craft & Capabilities (Deep Forest / Light Rays)**: Subtle editorial showcase of core strengths (Full-Stack Architecture, Modern UI/UX, Performance & Web Systems) woven into the atmosphere without feeling like a corporate agency template.
4. **Scene IV — Transition & Contact (Alpine Night Sky)**:
   - A prominent portal/CTA leading into **The Project Archive (`/archive`)**.
   - A dedicated final beat with direct email CTA / contact form for sole-proprietorship inquiries.

### 3. Part 2 — The Obsidian Project Space (`/archive`)
A dedicated interactive route (`/archive`) accessible from the persistent minimal top navigation and the end of the home scroll:
- **Hub-and-Spoke Force Graph**: Interactive HTML5 Canvas / SVG physics simulation where central **Category/Tag Hubs** (e.g., *Frontend & UI*, *Full-Stack Apps*, *Design Systems*, *Experiments & Open Source*) act as gravity wells with project nodes orbiting and connected to them.
- **Interactions**:
  - Pan, zoom, and drag nodes freely with organic spring physics.
  - Filter pills at the top to highlight specific tag clusters.
  - **Hover**: Displays a sleek floating preview tooltip (project title, brief summary, tech stack tags, year).
  - **Click**: Navigates directly to the project's GitHub repository or dedicated subpage (`/archive/[slug]`).
