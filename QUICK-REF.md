# KAUSHAL VAULT — QUICK REFERENCE CARD

## 30-Second Setup

```bash
# Clone
git clone <repo> kaushal-vault && cd kaushal-vault

# Serve locally
python -m http.server 8000

# Open browser
http://localhost:8000
```

## File Locations (Quick Edit)

| What | Where | Edit |
|------|-------|------|
| **Colors** | `css/01-variables.css` | Lines 8-20 |
| **Typography** | `css/01-variables.css` | Lines 22-35 |
| **Hero Title** | `index.html` | Line ~145 |
| **Email** | `index.html` | Line ~180 |
| **Projects** | `data/projects.json` | All content |
| **Skills** | `data/skills.json` | All content |
| **Timeline** | `data/timeline.json` | All content |
| **3D Object** | `js/config.js` | Lines 20-32 |
| **Boot Duration** | `js/config.js` | Line 63 |
| **Particles** | `js/config.js` | Lines 43-50 |
| **Animations** | `js/animations.js` | All timelines |
| **Button Behavior** | `js/input.js` | All event listeners |

## Deploy Commands

```bash
# Vercel
vercel

# Netlify
netlify deploy

# GitHub Pages
git push origin main
# Then enable Pages in repo settings
```

## Performance Testing

```bash
# Lighthouse (local)
chrome://inspect -> Lighthouse

# PageSpeed Insights
https://pagespeed.web.dev

# Web Vitals
https://web.dev/vitals/
```

## Color Palette (Copy-Paste)

```
Void Black:       #050507
Obsidian:         #0B0B10
Gunmetal:         #111118
Platinum:         #E6E9F0
Gold:             #D4AF37
Silver:           #C9CCD6
Cyan:             #00F5FF
Violet:           #7B2FF7
```

## CSS Classes (Use These)

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-gold">Gold</button>
<button class="btn btn-outline">Outline</button>

<!-- Text -->
<p class="text-muted">Muted text</p>
<p class="text-dim">Dim text</p>
<p class="text-platinum">Platinum text</p>
<p class="text-gold">Gold text</p>
<p class="text-mono">Monospace text</p>

<!-- Cards -->
<div class="metal-panel">Content</div>
<div class="skill-vault">Skill card</div>
<div class="operation-card">Project card</div>
<div class="doctrine-card">Doctrine card</div>
```

## Common Customizations

### Change Hero Title
```html
<h1 class="hero-title">Your Title Here</h1>
```

### Change Email
```html
<a href="mailto:your.email@domain.com">
```

### Add Project
```json
{
  "title": "Project Name",
  "icon": "🔥",
  "problem": "What you solved",
  "impact": [{ "value": "100%", "label": "Success" }],
  "stack": ["Tech1", "Tech2"]
}
```

### Change Accent Color
```css
:root {
  --color-cyan: #YOUR_COLOR;
}
```

### Change 3D Object
```javascript
// In js/three-world.js, line ~180
const geometry = new THREE.BoxGeometry(8, 8, 8);
// Options: BoxGeometry, SphereGeometry, OctahedronGeometry
```

### Adjust Boot Duration
```javascript
// In js/config.js, line 63
BOOT_DURATION: 3000, // milliseconds
```

### Lower Particle Count (Mobile)
```javascript
// In js/config.js, line 44
COUNT: 100, // Down from 200
```

## Debug Commands

```javascript
// In browser console
console.log(CONFIG); // View all config
console.log(threeWorld); // Check 3D scene
console.log(app); // Check app state
console.log(scrollDepth.getProgress()); // Check scroll
```

## Common Errors

```
Error: Cannot find THREE
→ Three.js CDN not loaded. Check index.html

Error: GSAP is not defined
→ GSAP CDN not loaded. Check index.html

WebGL is not supported
→ Browser doesn't support WebGL. Try Chrome/Firefox

Fetch failed for data/projects.json
→ Check file path, or use fallback data

Animations are laggy
→ Reduce PARTICLES.COUNT or check GPU
```

## Browser DevTools Tips

```
F12 → Console
→ Check for errors

F12 → Performance
→ Record, scroll, check FPS

F12 → Lighthouse
→ Run performance audit

F12 → Network
→ Check file sizes and load times

F12 → Elements
→ Inspect HTML structure
```

## Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Elite portfolio"

# After changes
git add .
git commit -m "Update projects"
git push origin main

# Create GitHub Pages branch
git branch -b gh-pages
git push origin gh-pages
```

## Domain Setup

```
1. Buy domain (Namecheap, GoDaddy, Vercel)
2. For Vercel:   vercel domains add kaushal.dev
3. For Netlify:  Domain settings → Custom domain
4. For GitHub:   Create CNAME file, update DNS
```

## Fonts (Google Fonts)

Currently using:
- **Space Grotesk** (headings, body)
- **JetBrains Mono** (code, technical text)

To change:
```html
<!-- In index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

## CDN Resources

```html
<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js"></script>

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet">
```

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | 95+ | 95 |
| Lighthouse SEO | 100 | 100 |
| First Contentful Paint | <1.2s | ~1.0s |
| Cumulative Layout Shift | <0.05 | ~0.02 |
| Time to Interactive | <2.5s | ~2.0s |

## File Size Budget

| Component | Budget | Actual |
|-----------|--------|--------|
| HTML | <30KB | ~25KB |
| CSS | <50KB | ~45KB |
| JS (excluding CDN) | <50KB | ~30KB |
| Total (excluding CDN) | <130KB | ~100KB |

## Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

## SEO Essentials

```html
<!-- Title -->
<title>Kaushal Kumar — Digital Architect</title>

<!-- Description -->
<meta name="description" content="Elite full-stack engineer...">

<!-- OG Tags -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">

<!-- Favicon -->
<link rel="icon" href="favicon.ico">

<!-- Sitemap -->
robots.txt + sitemap.xml
```

## Monitoring

```
Uptime: UptimeRobot.com
Performance: web.dev/measure
Analytics: Google Analytics
Errors: Sentry or Rollbar
```

## Final Launch Checklist

- [ ] All links working
- [ ] All images optimized
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Lighthouse 95+
- [ ] Custom domain live
- [ ] SSL/TLS enabled
- [ ] Analytics setup
- [ ] Backups enabled

---

## YOU'RE READY

Copy commands above. Deploy. Dominate.

**Questions? You know what to do.**

