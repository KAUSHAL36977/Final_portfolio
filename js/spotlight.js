// ===== SPOTLIGHT.JS =====
// Cursor ambient spotlight — slow-lerp radial glow that follows mouse.

class CursorSpotlight {
    constructor() {
        this.el      = null;
        this.mouseX  = -500;
        this.mouseY  = -500;
        this.curX    = -500;
        this.curY    = -500;
        this.rafId   = null;
    }

    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.el = document.getElementById('cursor-spotlight');
        if (!this.el) return;

        document.addEventListener('mousemove',  (e) => { this.mouseX = e.clientX; this.mouseY = e.clientY; }, { passive: true });
        document.addEventListener('mouseleave', ()  => { this.mouseX = -500; this.mouseY = -500; });

        this._animate();
    }

    _animate() {
        const ease = 0.07;
        this.curX += (this.mouseX - this.curX) * ease;
        this.curY += (this.mouseY - this.curY) * ease;

        if (this.el) {
            this.el.style.left = this.curX + 'px';
            this.el.style.top  = this.curY + 'px';
        }
        this.rafId = requestAnimationFrame(() => this._animate());
    }

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }
}

const cursorSpotlight = new CursorSpotlight();
