// ===== CURSOR.JS =====
// Custom two-layer magnetic cursor with mix-blend-mode inversion.

class MagneticCursor {
    constructor() {
        this.dot   = null;
        this.ring  = null;
        this.mouseX = -200;
        this.mouseY = -200;
        this.ringX  = -200;
        this.ringY  = -200;
        this.isVisible = false;
        this.currentMagnetEl = null;
        this.rafId = null;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        // Only on pointer-precise (non-touch) devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (this.reduceMotion) return;

        this.dot  = document.getElementById('cursor-dot');
        this.ring = document.getElementById('cursor-ring');
        if (!this.dot || !this.ring) return;

        document.body.classList.add('custom-cursor-active');
        this._bindEvents();
        this._tick();
    }

    _bindEvents() {
        document.addEventListener('mousemove',  (e) => this._onMove(e),  { passive: true });
        document.addEventListener('mouseleave', ()  => this._onLeave());
        document.addEventListener('mouseenter', ()  => this._onEnter());

        // Hover state for interactive elements
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, [data-cursor]');
            if (target) {
                this.ring.classList.add('cursor-hover');
                const type = target.getAttribute('data-cursor');
                if (type === 'drag') this.ring.classList.add('cursor-drag');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, [data-cursor]');
            if (target) {
                this.ring.classList.remove('cursor-hover', 'cursor-drag');
            }
        });
    }

    _onMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        if (!this.isVisible) this._onEnter();

        // Dot follows exactly (magnet-adjusted)
        this._handleMagnet(e.clientX, e.clientY);
    }

    _handleMagnet(mx, my) {
        const RADIUS = 80;
        let pulled = false;

        document.querySelectorAll('.btn, .nav-link, .view-btn').forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dist = Math.hypot(mx - cx, my - cy);

            if (dist < RADIUS) {
                const strength = (1 - dist / RADIUS) * 0.4;
                const px = (cx - mx) * strength;
                const py = (cy - my) * strength;
                this.dot.style.transform = `translate(${mx + px - 4}px, ${my + py - 4}px)`;

                if (el !== this.currentMagnetEl) {
                    this.currentMagnetEl = el;
                }
                if (typeof gsap !== 'undefined') {
                    gsap.to(el, { x: px * 0.5, y: py * 0.5, duration: 0.3, ease: 'power2.out', overwrite: true });
                }
                pulled = true;
            }
        });

        if (!pulled) {
            this.dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
            if (this.currentMagnetEl) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.currentMagnetEl, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)', overwrite: true });
                }
                this.currentMagnetEl = null;
            }
        }
    }

    _onLeave() {
        this.isVisible = false;
        this.dot.classList.add('cursor-hidden');
        this.ring.classList.add('cursor-hidden');
    }

    _onEnter() {
        this.isVisible = true;
        this.dot.classList.remove('cursor-hidden');
        this.ring.classList.remove('cursor-hidden');
    }

    _tick() {
        // Ring lerps towards mouse with lag
        const ease = 0.11;
        this.ringX += (this.mouseX - this.ringX) * ease;
        this.ringY += (this.mouseY - this.ringY) * ease;

        if (this.ring) {
            this.ring.style.transform = `translate(${this.ringX - 20}px, ${this.ringY - 20}px)`;
        }
        this.rafId = requestAnimationFrame(() => this._tick());
    }

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        document.body.classList.remove('custom-cursor-active');
    }
}

const magneticCursor = new MagneticCursor();
