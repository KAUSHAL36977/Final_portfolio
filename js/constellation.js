// ===== CONSTELLATION.JS =====
// Interactive skill node graph on <canvas> with spring physics.
// Click a node to highlight related skills; mouse proximity creates repulsion.

class SkillConstellation {
    constructor() {
        this.canvas        = null;
        this.ctx           = null;
        this.nodes         = [];
        this.rafId         = null;
        this.mouse         = { x: -999, y: -999 };
        this.hoveredNode   = null;
        this.selectedNode  = null;
        this.visible       = false;
        this.reduceMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        this.canvas = document.getElementById('constellation-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this._resize();
        this._bindEvents();

        // Only animate when in viewport
        const io = new IntersectionObserver((entries) => {
            this.visible = entries[0].isIntersecting;
            if (this.visible && !this.rafId) this._animate();
        }, { threshold: 0.05 });
        io.observe(this.canvas);
    }

    setSkills(skills) {
        if (!this.canvas) return;
        const cx = this.canvas.width  / 2;
        const cy = this.canvas.height / 2;
        const r  = Math.min(cx, cy) * 0.52;

        this.nodes = skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
            const tx = cx + Math.cos(angle) * r;
            const ty = cy + Math.sin(angle) * r;
            return {
                id: i, label: skill.title, icon: skill.icon,
                tags: skill.tags || [], x: tx, y: ty,
                tx, ty, vx: 0, vy: 0, radius: 28, opacity: 1,
                isCenter: false,
            };
        });

        // Central "identity" node
        this.nodes.push({
            id: -1, label: 'K.K.', icon: '⚡', tags: [],
            x: cx, y: cy, tx: cx, ty: cy, vx: 0, vy: 0,
            radius: 36, opacity: 1, isCenter: true,
        });
    }

    _resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        const w = parent ? parent.clientWidth : window.innerWidth;
        this.canvas.width  = w;
        this.canvas.height = Math.min(480, window.innerHeight * 0.6);

        // Reposition nodes on resize
        if (this.nodes.length) {
            const cx  = this.canvas.width  / 2;
            const cy  = this.canvas.height / 2;
            const rc  = Math.min(cx, cy) * 0.52;
            const outer = this.nodes.filter(n => !n.isCenter);
            outer.forEach((n, i) => {
                const a = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
                n.tx = cx + Math.cos(a) * rc;
                n.ty = cy + Math.sin(a) * rc;
            });
            const center = this.nodes.find(n => n.isCenter);
            if (center) { center.x = cx; center.y = cy; center.tx = cx; center.ty = cy; }
        }
    }

    _bindEvents() {
        window.addEventListener('resize', () => this._resize(), { passive: true });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this._findHovered();
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse    = { x: -999, y: -999 };
            this.hoveredNode = null;
            this.canvas.style.cursor = 'default';
        });

        this.canvas.addEventListener('click', () => {
            this.selectedNode = (this.hoveredNode && this.hoveredNode !== this.selectedNode)
                ? this.hoveredNode
                : null;
        });
    }

    _findHovered() {
        this.hoveredNode = null;
        for (const n of this.nodes) {
            if (Math.hypot(this.mouse.x - n.x, this.mouse.y - n.y) < n.radius + 8) {
                this.hoveredNode = n;
                break;
            }
        }
        this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'default';
    }

    _update() {
        if (this.reduceMotion) return;
        this.nodes.forEach(n => {
            if (n.isCenter) return;

            // Spring to target
            n.vx += (n.tx - n.x) * 0.06;
            n.vy += (n.ty - n.y) * 0.06;

            // Mouse repulsion
            const dx = n.x - this.mouse.x;
            const dy = n.y - this.mouse.y;
            const d  = Math.hypot(dx, dy);
            if (d < 100 && d > 0) {
                const f = ((100 - d) / 100) * 2.5;
                n.vx += (dx / d) * f;
                n.vy += (dy / d) * f;
            }

            n.vx *= 0.84; n.vy *= 0.84;
            n.x  += n.vx;  n.y  += n.vy;

            // Opacity based on selection
            const target = this.selectedNode
                ? (n === this.selectedNode || (this.selectedNode.tags.some(t => n.tags.includes(t))) ? 1 : 0.2)
                : 1;
            n.opacity += (target - n.opacity) * 0.1;
        });
    }

    _draw() {
        const ctx    = this.ctx;
        const center = this.nodes.find(n => n.isCenter);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw edges
        if (center) {
            this.nodes.forEach(n => {
                if (n.isCenter) return;
                ctx.beginPath();
                ctx.moveTo(center.x, center.y);
                ctx.lineTo(n.x, n.y);
                ctx.strokeStyle = `rgba(0,245,255,${n.opacity * 0.18})`;
                ctx.lineWidth   = n === this.selectedNode ? 2 : 1;
                ctx.stroke();
            });
        }

        // Draw nodes
        this.nodes.forEach(n => {
            ctx.save();
            ctx.globalAlpha = n.opacity;

            const hovered  = n === this.hoveredNode;
            const selected = n === this.selectedNode;

            if (hovered || selected || n.isCenter) {
                ctx.shadowBlur  = 22;
                ctx.shadowColor = n.isCenter ? '#D4AF37' : '#00F5FF';
            }

            // Circle fill
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = n.isCenter
                ? 'rgba(212,175,55,0.18)'
                : (hovered || selected)
                    ? 'rgba(0,245,255,0.14)'
                    : 'rgba(0,245,255,0.07)';
            ctx.fill();

            // Circle stroke
            ctx.strokeStyle = n.isCenter ? '#D4AF37' : '#00F5FF';
            ctx.lineWidth   = selected ? 2 : 1;
            ctx.stroke();
            ctx.shadowBlur  = 0;

            // Icon
            ctx.font         = `${n.isCenter ? 17 : 14}px serif`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = '#ffffff';
            ctx.fillText(n.icon, n.x, n.y - 7);

            // Label
            ctx.font         = `600 9px "Space Grotesk", sans-serif`;
            ctx.fillStyle    = n.isCenter ? '#D4AF37' : '#C9CCD6';
            ctx.fillText(n.label.split(' ')[0].toUpperCase(), n.x, n.y + 9);

            ctx.restore();
        });

        // Tooltip
        if (this.selectedNode && !this.selectedNode.isCenter) {
            this._drawTooltip(this.selectedNode);
        }
    }

    _drawTooltip(n) {
        const ctx = this.ctx;
        const txt = n.tags.join(' · ');
        if (!txt) return;

        ctx.font = '500 10px "JetBrains Mono", monospace';
        const tw  = ctx.measureText(txt).width;
        const pad = 10;
        const w   = tw + pad * 2;
        const h   = 26;
        let tx = n.x - w / 2;
        let ty = n.y - n.radius - h - 8;

        tx = Math.max(4, Math.min(this.canvas.width - w - 4, tx));
        ty = Math.max(4, ty);

        ctx.fillStyle   = 'rgba(11,11,16,0.92)';
        ctx.strokeStyle = 'rgba(0,245,255,0.35)';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        this._roundRect(ctx, tx, ty, w, h, 5);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle    = '#00F5FF';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, tx + pad, ty + h / 2);
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
    }

    _animate() {
        if (!this.visible) { this.rafId = null; return; }
        this._update();
        this._draw();
        this.rafId = requestAnimationFrame(() => this._animate());
    }
}

const skillConstellation = new SkillConstellation();
