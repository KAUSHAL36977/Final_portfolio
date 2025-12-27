# KAUSHAL VAULT — MASTER PLAYBOOK
## The Complete System Implementation Guide

---

## PART 1: UNDERSTANDING THE ARCHITECTURE

### The Three Pillars

**1. Dark Luxury Aesthetic**
- Void black as default (#050507)
- Platinum (#E6E9F0) for identity and authority
- Gold (#D4AF37) for CTAs and power moments
- Cyan (#00F5FF) for energy and interactivity
- No rounded "startup SaaS" softness. Only brutal, engineered precision.

**2. Real 3D System**
- Three.js as the 3D engine
- Icosahedron hero core (rotating, responsive to mouse)
- 200-point particle field (continuous rotation)
- Background grid (perspective depth)
- 3 point lights for realistic illumination
- Camera depth changes during scroll (you move forward through layers)

**3. Obsessive JavaScript Architecture**
- **config.js**: All magic numbers live here. Change ONE place = entire behavior shifts.
- **ui-system.js**: DOM utilities. No jQuery. Pure, fast helpers.
- **input.js**: Mouse, keyboard, touch. User intention detection.
- **three-world.js**: The 3D universe. Scene, camera, renderer, geometry.
- **scroll-depth.js**: Scroll tracking as camera movement.
- **animations.js**: GSAP timelines. Orchestrated motion.
- **main.js**: Master orchestrator. Loads data, initializes subsystems, runs boot sequence.

---

## PART 2: FILE SETUP (COPY-PASTE READY)

### Step 1: Project Structure

```
kaushal-vault/
├── index.html
├── package.json
├── vercel.json
├── netlify.toml
├── robots.txt
├── sitemap.xml
├── .gitignore
│
├── css/
│   ├── 00-reset.css
│   ├── 01-variables.css
│   ├── 02-darkness.css
│   ├── 03-metals.css
│   ├── 04-typography.css
│   ├── 05-layout.css
│   ├── 06-components.css
│   ├── 07-3d-elements.css
│   ├── 08-animations.css
│   └── 09-responsive.css
│
├── js/
│   ├── config.js
│   ├── ui-system.js
│   ├── input.js
│   ├── three-world.js
│   ├── scroll-depth.js
│   ├── animations.js
│   └── main.js
│
├── data/
│   ├── projects.json
│   ├── skills.json
│   ├── timeline.json
│   └── content.json
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
│
└── README.md
```

### Step 2: Core Files (Critical Order)

1. **index.html** — Master template. Everything connects here.
2. **css/00-09** — Cascade. No conflicts. Each file one job.
3. **js/config.js** — Constants before anything else.
4. **js/ui-system.js** — Utilities. Used by everything.
5. **js/input.js** — Input tracking.
6. **js/three-world.js** — 3D engine.
7. **js/scroll-depth.js** — Scroll tracking.
8. **js/animations.js** — GSAP orchestration.
9. **js/main.js** — Master initializer.

---

## PART 3: CUSTOMIZATION MATRIX

### Color Scheme

**Location:** `css/01-variables.css` (lines 8-20)

```css
:root {
  --color-void: #050507;           /* Black. Never change. */
  --color-obsidian: #0B0B10;       /* Slightly lighter black */
  --color-gunmetal: #111118;       /* Metal gray */
  --color-carbon: #1A1A22;         /* Usable dark */
  --color-platinum: #E6E9F0;       /* Identity, authority */
  --color-gold: #D4AF37;           /* CTAs, power */
  --color-silver: #C9CCD6;         /* Structure, dividers */
  --color-cyan: #00F5FF;           /* Energy, interaction */
  --color-violet: #7B2FF7;         /* Depth, secondary */
  --color-green: #39FF14;          /* Optional third accent */
}
```

**Rule:** Only change cyan, gold, silver if you want a new feel. NEVER touch void, obsidian, gunmetal. They're the foundation.

### Typography Scale

**Location:** `css/01-variables.css` (lines 22-35)

```css
--font-size-xs: 11px;     /* Labels, fine print */
--font-size-sm: 13px;     /* Meta, small text */
--font-size-base: 15px;   /* Body, default */
--font-size-md: 17px;
--font-size-lg: 20px;     /* Subheadings */
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 40px;
--font-size-4xl: 52px;    /* Section titles */
--font-size-5xl: 64px;    /* Hero title */
```

### 3D Hero Core

**Location:** `js/config.js` (lines 20-32)

```javascript
HERO_CORE: {
    GEOMETRY: 'icosahedron',    // 'box', 'sphere', 'tetrahedron'
    RADIUS: 8,                   // Size
    DETAIL: 4,                   // Wireframe density
    COLOR_PRIMARY: 0x00F5FF,     // Cyan
    COLOR_SECONDARY: 0x7B2FF7,   // Violet
    WIREFRAME: true,             // Lines only
    OPACITY: 0.3,                // Transparency
    EMISSIVE_INTENSITY: 0.3,     // Glow strength
}
```

### Boot Sequence Duration

**Location:** `js/config.js` (line 63)

```javascript
BOOT_DURATION: 2500, // milliseconds
```

**Rule:** Longer boot = more dramatic. 2.5s is psychological sweet spot.

### Particle Count

**Location:** `js/config.js` (line 43)

```javascript
PARTICLES: {
    COUNT: 200,  // Lower = faster. 100 = mobile-friendly.
}
```

---

## PART 4: PERFORMANCE OPTIMIZATION

### Critical Rendering Path

1. **Inline critical CSS** (in <head>)
2. **Preload Three.js & GSAP** (async, defer)
3. **Load other CSS** (non-critical)
4. **Load JS** (deferred)
5. **Initialize on DOMContentLoaded**

### Performance Checklist

- [ ] Lighthouse Performance: 95+
- [ ] Lighthouse Accessibility: 95+
- [ ] Lighthouse Best Practices: 95+
- [ ] Lighthouse SEO: 100
- [ ] First Contentful Paint: <1.2s
- [ ] Largest Contentful Paint: <2.5s
- [ ] Cumulative Layout Shift: <0.05
- [ ] Time to Interactive: <2.5s

### Bundle Sizes (Gzipped)

- index.html: ~25KB
- All CSS: ~45KB
- All JS (excluding Three.js & GSAP): ~30KB
- Three.js (CDN): ~200KB
- GSAP (CDN): ~50KB

**Total: ~350KB (reasonable)**

### GPU Optimization

- Single canvas = single GPU context (efficient)
- No heavy textures = fast rendering
- Procedural geometry = no asset downloads
- GSAP uses transform/opacity = GPU accelerated

---

## PART 5: DEPLOYMENT PATHS

### Path 1: Vercel (RECOMMENDED)

**Why:** Fast, reliable, auto-HTTPS, global CDN

```bash
npm i -g vercel
vercel
```

**Custom domain:**
```bash
vercel domains add kaushal.dev
```

**Cost:** Free tier allows unlimited deployments.

### Path 2: Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=.
```

### Path 3: GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin <your-repo>
git push -u origin main
```

---

## PART 6: TROUBLESHOOTING MATRIX

| Problem | Cause | Solution |
|---------|-------|----------|
| 3D object not rendering | Three.js not loaded | Check CDN link in index.html |
| Canvas blank | WebGL disabled | Update browser or enable WebGL |
| Boot sequence stuck | Config.BOOT_DURATION too long | Reduce in config.js |
| Animations laggy | Too many particles | Lower PARTICLES.COUNT |
| Mobile looks broken | Viewport meta missing | Check meta tag in <head> |
| Data not loading | fetch() fails | Check data/ path, use fallback |
| GSAP errors | Library not loaded | Ensure GSAP CDN loaded first |
| Scroll not working | scrollTo plugin missing | Load ScrollToPlugin.js |

---

## PART 7: TESTING CHECKLIST

### Pre-Launch

- [ ] Test all 5 sections scroll smoothly
- [ ] Hero 3D renders and tilts on mouse
- [ ] Boot sequence hides after 2.5s
- [ ] All buttons are clickable
- [ ] All links work (internal and external)
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] No network errors
- [ ] Fonts load correctly
- [ ] Colors are accurate

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)

---

## FINAL WORDS

You now have a **post-disciplinary digital artifact**. Not a website. A system.

This portfolio:
- Commands respect (dark, controlled, intimidating)
- Shows mastery (no buzzwords, pure execution)
- Signals taste (metallic accents, 3D depth, smooth motion)
- Operates at founder level ("I'm selecting, not applying")

Anyone landing on this will think:
*"This person is not desperate for a job. They're selecting collaborators."*

**Deploy it. Own it. Dominate with it.**

---

**Questions? Push forward. You've got this.**

