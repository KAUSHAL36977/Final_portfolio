// ===== KONAMI.JS =====
// Konami-code Easter egg: full-screen HACKER MODE with Matrix rain.

class KonamiEgg {
    constructor() {
        this.seq     = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                        'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
        this.buffer  = [];
        this.active  = false;
        this.animId  = null;
        this.drops   = [];
    }

    init() {
        document.addEventListener('keydown', (e) => this._onKey(e));

        const exitBtn = document.getElementById('hacker-exit');
        exitBtn && exitBtn.addEventListener('click', () => this._deactivate());
    }

    _onKey(e) {
        this.buffer.push(e.key);
        if (this.buffer.length > this.seq.length) {
            this.buffer.shift();
        }
        if (this.buffer.join(',') === this.seq.join(',')) {
            this.active ? this._deactivate() : this._activate();
        }
        if (e.key === 'Escape' && this.active) {
            this._deactivate();
        }
    }

    _activate() {
        this.active = true;
        const overlay = document.getElementById('hacker-overlay');
        if (!overlay) return;

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('hacker-mode');

        const canvas = overlay.querySelector('#matrix-canvas');
        if (canvas) this._startMatrix(canvas);

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        }

        // Announce to screen readers
        const hint = document.querySelector('.hacker-ascii');
        if (hint) hint.setAttribute('aria-live', 'polite');

        console.log('%c[HACKER MODE] Easter egg activated! Press ESC or click EXIT.', 'color:#39FF14;font-family:monospace;font-size:13px');
    }

    _deactivate() {
        this.active = false;
        document.body.classList.remove('hacker-mode');
        if (this.animId) cancelAnimationFrame(this.animId);

        const overlay = document.getElementById('hacker-overlay');
        if (!overlay) return;

        if (typeof gsap !== 'undefined') {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    overlay.classList.remove('active');
                    overlay.setAttribute('aria-hidden', 'true');
                },
            });
        } else {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    _startMatrix(canvas) {
        const ctx      = canvas.getContext('2d');
        canvas.width   = window.innerWidth;
        canvas.height  = window.innerHeight;
        const fontSize = 14;
        const cols     = Math.floor(canvas.width / fontSize);
        this.drops     = Array.from({ length: cols }, () => Math.random() * canvas.height / fontSize);

        const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*!?';

        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            this.drops.forEach((y, x) => {
                const bright = Math.random() > 0.95;
                ctx.fillStyle = bright ? '#ffffff' : '#39FF14';
                ctx.font      = `${fontSize}px "JetBrains Mono", monospace`;
                ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x * fontSize, y * fontSize);

                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    this.drops[x] = 0;
                }
                this.drops[x] += 1;
            });
            this.animId = requestAnimationFrame(draw);
        };
        draw();
    }
}

const konamiEgg = new KonamiEgg();
