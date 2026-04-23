// ===== GRAIN.JS =====
// Animated film-grain noise overlay for cinematic texture.

class GrainOverlay {
    constructor() {
        this.canvas  = null;
        this.ctx     = null;
        this.animId  = null;
        this.frame   = 0;
        this.refresh = 2;        // re-draw every N frames
        this.alpha   = 18;       // 0-255 per-pixel alpha cap
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        this.canvas = document.getElementById('grain-canvas');
        if (!this.canvas) return;

        if (this.reduceMotion) {
            this.alpha   = 8;
            this.refresh = 30;
        }

        // Lower refresh rate on mobile for perf
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.alpha   = 10;
            this.refresh = 6;
        }

        this.ctx = this.canvas.getContext('2d');
        this._resize();
        this._animate();
        window.addEventListener('resize', () => this._resize(), { passive: true });
    }

    _resize() {
        if (!this.canvas) return;
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _generate() {
        const ctx = this.ctx;
        const { width, height } = ctx.canvas;
        const imageData = ctx.createImageData(width, height);
        const buf = new Int32Array(imageData.data.buffer);
        const alpha = this.alpha;

        for (let i = 0; i < buf.length; i++) {
            if (Math.random() < 0.5) {
                // white noise pixel with variable alpha
                buf[i] = ((Math.floor(Math.random() * alpha)) << 24) | 0xffffff;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    _animate() {
        this.frame++;
        if (this.frame % this.refresh === 0 && this.ctx) {
            this._generate();
        }
        this.animId = requestAnimationFrame(() => this._animate());
    }

    destroy() {
        if (this.animId) cancelAnimationFrame(this.animId);
    }
}

const grainOverlay = new GrainOverlay();
