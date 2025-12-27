# KAUSHAL KUMAR — ELITE PORTFOLIO ARCHITECTURE

## System Overview

This is a **post-disciplinary digital artifact**. Not a website. A constructed system.

### File Structure

```
kaushal-vault/
├── index.html                    (entry point)
├── manifest.json                 (PWA config)
│
├── css/
│   ├── 00-reset.css             (CSS reset, darkness defaults)
│   ├── 01-variables.css         (color, typography, spacing tokens)
│   ├── 02-darkness.css          (core dark theme, no light)
│   ├── 03-metals.css            (platinum, gold, silver shaders)
│   ├── 04-typography.css        (scale, weight, hierarchy)
│   ├── 05-layout.css            (grid, flex, container logic)
│   ├── 06-components.css        (buttons, cards, panels)
│   ├── 07-3d-elements.css       (canvas, 3D sections)
│   ├── 08-animations.css        (keyframes, transitions)
│   └── 09-responsive.css        (mobile, tablet, desktop)
│
├── js/
│   ├── config.js                (constants, magic numbers)
│   ├── core.js                  (app state, lifecycle)
│   ├── input.js                 (mouse, keyboard, touch)
│   ├── three-world.js           (Three.js scene setup)
│   ├── three-objects.js         (3D geometry creation)
│   ├── three-interactions.js    (3D event handlers)
│   ├── scroll-depth.js          (scroll as camera travel)
│   ├── animations.js            (GSAP timelines)
│   ├── ui-system.js             (DOM helpers, utilities)
│   └── main.js                  (orchestration)
│
├── lib/
│   ├── three.min.js             (Three.js CDN)
│   ├── gsap.min.js              (GSAP CDN)
│   └── vendor.js                (other dependencies)
│
├── data/
│   ├── projects.json            (project data)
│   ├── skills.json              (skills/proof data)
│   ├── timeline.json            (experience timeline)
│   └── content.json             (copy, bios, CTAs)
│
├── assets/
│   ├── fonts/                   (custom typefaces)
│   ├── images/                  (optimized images)
│   ├── icons/                   (SVG icons)
│   └── models/                  (3D models if needed)
│
└── README.md                    (deployment guide)
```

## Implementation Philosophy

1. **Separation of Concerns**: CSS, JS, Data, 3D are isolated. No touching.
2. **Performance First**: GPU animations, no main-thread blocking.
3. **Accessibility**: ARIA, keyboard nav, semantic HTML.
4. **Dark Obsession**: Every pixel earned, nothing wasted.
5. **3D as Signal**: Not decoration. Means something.

## Color System (Immutable)

```
Void Black:       #050507
Obsidian:         #0B0B10
Gunmetal:         #111118
Carbon:           #1A1A22

Platinum:         #E6E9F0  (identity, core)
Gold:             #D4AF37  (authority, CTA)
Silver:           #C9CCD6  (structure, dividers)

Cyan (Ion):       #00F5FF  (energy, interaction)
Violet (Spectral):#7B2FF7  (depth, secondary)
```

## Performance Targets

- **Lighthouse**: 95+ across all metrics
- **First Contentful Paint**: <1.2s
- **Time to Interactive**: <2.5s
- **Cumulative Layout Shift**: <0.05
- **60fps animations**: GPU-accelerated only

## Deployment

**Vercel** (recommended for this build)
```bash
vercel
```

**Build Time**: <500ms
**Bundle Size**: <200KB (gzipped)
**3D Assets**: Procedural only (no downloads)

---

END OF ARCHITECTURE DOCUMENT

