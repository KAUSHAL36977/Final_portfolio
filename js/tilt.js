// ===== TILT.JS =====
// CSS perspective 3D tilt for .metal-panel cards with specular highlight.

class CardTilt {
    constructor() {
        this.maxTilt    = 10;       // degrees
        this.scale      = 1.025;
        this.perspective = 1000;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (this.reduceMotion) return;

        this._attachAll();
        // Re-scan after dynamic content renders
        document.addEventListener('content-rendered', () => this._attachAll());
    }

    _attachAll() {
        document.querySelectorAll('.metal-panel:not([data-tilt])').forEach(card => {
            card.setAttribute('data-tilt', 'true');
            this._initCard(card);
        });
    }

    _initCard(card) {
        // Inject specular highlight overlay
        const hl = document.createElement('div');
        hl.className = 'tilt-highlight';
        hl.setAttribute('aria-hidden', 'true');
        card.appendChild(hl);

        card.style.transformStyle = 'preserve-3d';

        const speed = '0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)';

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // instant on enter for responsiveness
        });

        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const rx     = ((y - cy) / cy) * -this.maxTilt;
            const ry     = ((x - cx) / cx) *  this.maxTilt;

            card.style.transform = [
                `perspective(${this.perspective}px)`,
                `rotateX(${rx}deg)`,
                `rotateY(${ry}deg)`,
                `scale3d(${this.scale},${this.scale},${this.scale})`,
            ].join(' ');

            // Specular: light appears at cursor position
            const lx = (x / rect.width)  * 100;
            const ly = (y / rect.height) * 100;
            hl.style.background = `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.09) 0%, transparent 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = `transform ${speed}`;
            card.style.transform  = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
            hl.style.background   = 'none';
        });
    }
}

const cardTilt = new CardTilt();
