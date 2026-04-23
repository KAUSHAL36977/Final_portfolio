// ===== KINETIC-TEXT.JS =====
// SplitType character entrance animation + scramble role cycling.

class KineticText {
    constructor() {
        this.roles = [
            'FULL-STACK ENGINEER',
            'AI SYSTEMS BUILDER',
            'PROBLEM SOLVER',
            'PRODUCT ARCHITECT',
            'OPEN SOURCE DEV',
        ];
        this.currentRole   = 0;
        this.scrambleTimer = null;
        this.isAnimating   = false;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
        this.reduceMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        const title   = document.querySelector('.hero-title');
        const scramble = document.querySelector('.hero-role-scramble');

        if (scramble) {
            scramble.textContent = this.roles[0];
            if (!this.reduceMotion) {
                setInterval(() => this._cycleRole(scramble), 3200);
            }
        }

        if (!title || this.reduceMotion) {
            // Simple fade-in fallback
            if (title && typeof gsap !== 'undefined') {
                gsap.from(title, { opacity: 0, y: 16, duration: 0.7, delay: 2.8 });
            }
            return;
        }

        this._initSplit(title);
    }

    _initSplit(el) {
        if (typeof SplitType === 'undefined') {
            // Fallback without SplitType
            if (typeof gsap !== 'undefined') {
                gsap.from(el, { opacity: 0, y: 20, duration: 0.8, delay: 2.9 });
            }
            return;
        }

        const split = new SplitType(el, { types: 'chars,words' });

        // Set initial state
        if (typeof gsap !== 'undefined') {
            gsap.set(split.chars, {
                opacity: 0,
                y: 50,
                rotateX: -90,
                transformOrigin: '0% 50% -30px',
            });

            const bootDelay = (CONFIG && CONFIG.ANIMATION ? CONFIG.ANIMATION.BOOT_DURATION : 3000) / 1000;

            gsap.to(split.chars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.7,
                stagger: { amount: 0.6, from: 'start' },
                ease: 'back.out(1.5)',
                delay: bootDelay + 0.2,
            });
        }

        // Proximity hover
        el.addEventListener('mousemove', (e) => {
            if (this.reduceMotion || !split.chars) return;
            split.chars.forEach(char => {
                const rect = char.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
                const MAX  = 90;

                if (typeof gsap !== 'undefined') {
                    if (dist < MAX) {
                        const s = 1 - dist / MAX;
                        gsap.to(char, { y: -s * 10, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
                    } else {
                        gsap.to(char, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                    }
                }
            });
        });

        el.addEventListener('mouseleave', () => {
            if (!split.chars) return;
            if (typeof gsap !== 'undefined') {
                gsap.to(split.chars, { y: 0, duration: 0.4, ease: 'power2.out' });
            }
        });
    }

    _cycleRole(el) {
        this.currentRole = (this.currentRole + 1) % this.roles.length;
        this._scrambleTo(el, this.roles[this.currentRole]);
    }

    _scrambleTo(el, target) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        let iteration = 0;
        clearInterval(this.scrambleTimer);

        this.scrambleTimer = setInterval(() => {
            el.textContent = target
                .split('')
                .map((char, i) => {
                    if (char === ' ')       return ' ';
                    if (i < iteration)     return char;
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');

            if (iteration >= target.length) {
                clearInterval(this.scrambleTimer);
                el.textContent  = target;
                this.isAnimating = false;
            }
            iteration += 0.6;
        }, 28);
    }
}

const kineticText = new KineticText();
