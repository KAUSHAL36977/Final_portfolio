// ===== ANIMATIONS.JS =====
// GSAP timelines, Lenis smooth scroll integration, orchestrated motion.

class AnimationEngine {
    constructor() {
        this.timelines     = {};
        this.isInitialized = false;
        this.lenis         = null;
    }

    init() {
        this._initLenis();
        this._registerButtonAnimations();
        this._registerMetricAnimations();
        this.isInitialized = true;
    }

    /* ── Lenis smooth scroll ─────────────────────────────────────────── */
    _initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('[ANIM] Lenis not available — using native scroll.');
            return;
        }

        this.lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        window.lenis = this.lenis; // expose globally for nav.js etc.

        // Integrate with GSAP ticker
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => {
                this.lenis && this.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback RAF loop
            const raf = (time) => {
                this.lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        }
    }

    /* ── Button hover scale ─────────────────────────────────────────── */
    _registerButtonAnimations() {
        document.addEventListener('mouseover', (e) => {
            const btn = e.target.closest('.btn');
            if (btn && typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: CONFIG.ANIMATION.BUTTON_SCALE, duration: 0.25, ease: 'back.out(1.5)', overwrite: 'auto' });
            }
        });
        document.addEventListener('mouseout', (e) => {
            const btn = e.target.closest('.btn');
            if (btn && typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1, duration: 0.25, ease: 'back.out(1.5)', overwrite: 'auto' });
            }
        });
        document.addEventListener('mousedown', (e) => {
            const btn = e.target.closest('.btn');
            if (btn && typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 0.96, duration: 0.12, overwrite: 'auto' });
            }
        });
        document.addEventListener('mouseup', (e) => {
            const btn = e.target.closest('.btn');
            if (btn && typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1, duration: 0.25, ease: 'back.out(1.5)', overwrite: 'auto' });
            }
        });
    }

    /* ── Metric items initial fade ──────────────────────────────────── */
    _registerMetricAnimations() {
        if (typeof gsap === 'undefined') return;
        const bootDelay = CONFIG.ANIMATION.BOOT_DURATION / 1000;
        gsap.from('.metric-item', {
            opacity: 0,
            y: 20,
            stagger: 0.12,
            duration: 0.6,
            delay: bootDelay + 0.5,
            ease: 'power2.out',
        });
    }
}

const animationEngine = new AnimationEngine();


