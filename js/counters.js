// ===== COUNTERS.JS =====
// Animated metric counters + SVG circular progress rings.

class AnimatedCounters {
    constructor() {
        this.observer     = null;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        const items = document.querySelectorAll('.metric-item');
        if (!items.length) return;

        items.forEach(item => this._setupItem(item));
    }

    _setupItem(item) {
        const numEl = item.querySelector('.metric-number');
        if (!numEl) return;

        const raw    = numEl.textContent.trim();
        const parsed = this._parse(raw);

        // Inject SVG ring
        item.insertAdjacentHTML('afterbegin', this._ringHTML());

        if (this.reduceMotion || parsed.isText) return;

        // Reset display to zero before animating
        numEl.textContent = parsed.prefix + '0' + parsed.suffix;

        this._observe(item, () => this._animateItem(item, numEl, parsed));
    }

    _parse(text) {
        // Handles: "100+", "1000+", "99.8%", "<200ms", "Real-Time", "E2E"
        const m = text.match(/^([^\d]*)(\d+\.?\d*)(.*)$/);
        if (!m) return { isText: true, original: text };
        return {
            isText: false,
            value:  parseFloat(m[2]),
            prefix: m[1],
            suffix: m[3],
        };
    }

    _ringHTML() {
        const r = 40;
        const c = 2 * Math.PI * r;
        return `
            <svg class="metric-ring" width="90" height="90" aria-hidden="true">
                <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stop-color="var(--color-cyan)"   />
                        <stop offset="100%" stop-color="var(--color-violet)" />
                    </linearGradient>
                </defs>
                <circle class="metric-ring-bg" cx="45" cy="45" r="${r}" />
                <circle class="metric-ring-progress" cx="45" cy="45" r="${r}"
                        stroke-dasharray="${c.toFixed(2)}"
                        stroke-dashoffset="${c.toFixed(2)}" />
            </svg>`;
    }

    _observe(item, cb) {
        if (!this.observer) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting && e.target._counterCb) {
                        e.target._counterCb();
                        this.observer.unobserve(e.target);
                    }
                });
            }, { threshold: 0.6 });
        }
        item._counterCb = cb;
        this.observer.observe(item);
    }

    _animateItem(item, numEl, parsed) {
        const ring      = item.querySelector('.metric-ring-progress');
        const r         = 40;
        const circ      = 2 * Math.PI * r;
        const duration  = 2000;
        const start     = performance.now();
        const target    = parsed.value;
        const isDecimal = target % 1 !== 0;

        const step = (now) => {
            const p    = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
            const cur  = target * ease;

            numEl.textContent = parsed.prefix
                + (isDecimal ? cur.toFixed(1) : Math.floor(cur))
                + parsed.suffix;

            if (ring) {
                ring.style.strokeDashoffset = (circ - ease * circ * 0.82).toFixed(2);
            }

            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
}

const animatedCounters = new AnimatedCounters();
