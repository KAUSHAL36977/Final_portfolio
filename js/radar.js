// ===== RADAR.JS =====
// Animated SVG radar/spider chart for skills section.

class SkillsRadar {
    constructor() {
        this.skills = [
            { label: 'Full-Stack',  value: 0.92 },
            { label: 'AI / ML',     value: 0.85 },
            { label: 'Blockchain',  value: 0.78 },
            { label: 'Mobile',      value: 0.80 },
            { label: 'Cloud Infra', value: 0.82 },
            { label: 'Robotics',    value: 0.72 },
        ];
        this.observer     = null;
        this.animated     = false;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        const wrapper = document.querySelector('.skills-chart-wrapper');
        if (!wrapper) return;

        const svg = this._build();
        wrapper.innerHTML = '';
        wrapper.appendChild(svg);

        // Animate on scroll entry
        this._observe(wrapper);
    }

    _build() {
        const size   = 320;
        const cx     = size / 2;
        const cy     = size / 2;
        const R      = 120;   // outer radius
        const levels = 4;
        const n      = this.skills.length;
        const svgNS  = 'http://www.w3.org/2000/svg';

        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.classList.add('skills-radar-svg');
        svg.setAttribute('aria-label', 'Skills proficiency radar chart');
        svg.setAttribute('role', 'img');

        const defs = document.createElementNS(svgNS, 'defs');

        // Gradient fill
        const grad = document.createElementNS(svgNS, 'radialGradient');
        grad.id = 'radarFill';
        grad.setAttribute('cx', '50%'); grad.setAttribute('cy', '50%');
        grad.setAttribute('r',  '50%');
        const s1 = document.createElementNS(svgNS, 'stop');
        s1.setAttribute('offset', '0%');   s1.setAttribute('stop-color', 'var(--color-cyan)');   s1.setAttribute('stop-opacity', '0.25');
        const s2 = document.createElementNS(svgNS, 'stop');
        s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', 'var(--color-violet)'); s2.setAttribute('stop-opacity', '0.06');
        grad.appendChild(s1); grad.appendChild(s2);
        defs.appendChild(grad);
        svg.appendChild(defs);

        // Axis angles
        const angles = this.skills.map((_, i) => (2 * Math.PI * i / n) - Math.PI / 2);

        // Grid rings
        for (let lvl = 1; lvl <= levels; lvl++) {
            const r   = R * lvl / levels;
            const pts = angles.map(a => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`).join(' ');
            const poly = document.createElementNS(svgNS, 'polygon');
            poly.setAttribute('points', pts);
            poly.classList.add('radar-grid-line');
            svg.appendChild(poly);
        }

        // Axis lines + labels
        angles.forEach((a, i) => {
            const x2 = cx + R * Math.cos(a);
            const y2 = cy + R * Math.sin(a);
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', cx); line.setAttribute('y1', cy);
            line.setAttribute('x2', x2.toFixed(2)); line.setAttribute('y2', y2.toFixed(2));
            line.classList.add('radar-axis-line');
            svg.appendChild(line);

            // Label — push out a bit further
            const labelR = R + 22;
            const lx = cx + labelR * Math.cos(a);
            const ly = cy + labelR * Math.sin(a);
            const text = document.createElementNS(svgNS, 'text');
            text.setAttribute('x', lx.toFixed(2));
            text.setAttribute('y', (ly + 4).toFixed(2));
            text.classList.add('radar-label');
            text.textContent = this.skills[i].label;
            svg.appendChild(text);
        });

        // Data polygon (starts collapsed at center)
        const dataPoints = angles.map((a, i) => {
            const r = R * this.skills[i].value;
            return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
        });

        const shape = document.createElementNS(svgNS, 'polygon');
        if (this.reduceMotion) {
            shape.setAttribute('points', dataPoints.join(' '));
        } else {
            // Start collapsed — all points at center
            shape.setAttribute('points', angles.map(() => `${cx},${cy}`).join(' '));
        }
        shape.setAttribute('fill', 'url(#radarFill)');
        shape.classList.add('radar-shape');
        svg.appendChild(shape);
        this._shape = shape;
        this._dataPoints = dataPoints;
        this._cx = cx; this._cy = cy; this._angles = angles;

        // Dots on each axis vertex
        angles.forEach((a, i) => {
            const r  = R * this.skills[i].value;
            const dx = cx + r * Math.cos(a);
            const dy = cy + r * Math.sin(a);
            const circle = document.createElementNS(svgNS, 'circle');
            circle.setAttribute('cx', dx.toFixed(2));
            circle.setAttribute('cy', dy.toFixed(2));
            circle.setAttribute('r', '5');
            circle.classList.add('radar-dot');

            if (!this.reduceMotion) {
                // Start at center, animate outward
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                this._dots = this._dots || [];
                this._dots.push({ el: circle, tx: dx.toFixed(2), ty: dy.toFixed(2) });
            }
            svg.appendChild(circle);
        });

        return svg;
    }

    _observe(wrapper) {
        if (this.reduceMotion) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !this.animated) {
                    this.animated = true;
                    this._animate();
                    io.disconnect();
                }
            });
        }, { threshold: 0.4 });
        io.observe(wrapper);
    }

    _animate() {
        if (!this._shape) return;
        const duration = 1200;
        const start    = performance.now();
        const cx = this._cx;
        const cy = this._cy;
        const angles   = this._angles;
        const dataPoints = this._dataPoints;
        const dots     = this._dots || [];

        const tick = (now) => {
            const p    = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic

            // Interpolate polygon points from center to actual values
            const pts = angles.map((_, i) => {
                const [tx, ty] = dataPoints[i].split(',').map(Number);
                const ix = cx + (tx - cx) * ease;
                const iy = cy + (ty - cy) * ease;
                return `${ix.toFixed(2)},${iy.toFixed(2)}`;
            });
            this._shape.setAttribute('points', pts.join(' '));

            // Animate dots
            dots.forEach(d => {
                const tx = parseFloat(d.tx);
                const ty = parseFloat(d.ty);
                d.el.setAttribute('cx', (cx + (tx - cx) * ease).toFixed(2));
                d.el.setAttribute('cy', (cy + (ty - cy) * ease).toFixed(2));
            });

            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
}

const skillsRadar = new SkillsRadar();
