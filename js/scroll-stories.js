// ===== SCROLL-STORIES.JS =====
// GSAP ScrollTrigger-powered scroll animations:
//   • Hero parallax
//   • Section title clip-path reveals
//   • Horizontal project cards
//   • Timeline SVG draw + card slide-in
//   • Card stagger entrance

class ScrollStories {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.warn('[SCROLL-STORIES] GSAP not loaded.');
            return;
        }

        // ScrollTrigger must be registered
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        } else {
            console.warn('[SCROLL-STORIES] ScrollTrigger not loaded.');
            return;
        }

        // Sync Lenis with ScrollTrigger
        if (window.lenis) {
            window.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => window.lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        this._heroParallax();
        this._sectionTitles();
        this._cardStagger();
        this._timelineReveal();
        this._horizontalProjects();
        this._buttonRipple();

        this.initialized = true;
    }

    /* ——— Hero text + canvas parallax ——— */
    _heroParallax() {
        gsap.to('.hero-text', {
            y: -70,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        gsap.to('#three-canvas', {
            y: -35,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.8,
            },
        });
    }

    /* ——— Clip-path curtain reveal for section titles ——— */
    _sectionTitles() {
        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.fromTo(el,
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                }
            );
        });

        gsap.utils.toArray('.section-subtitle').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 18,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
        });
    }

    /* ——— Generic card / panel entrance ——— */
    _cardStagger() {
        gsap.utils.toArray('.skill-vault, .doctrine-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 32,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 84%', once: true },
            });
        });
    }

    /* ——— Timeline SVG line draw + card slides ——— */
    _timelineReveal() {
        const line = document.querySelector('.timeline-svg-line');
        if (line) {
            const len = line.getTotalLength ? line.getTotalLength() : 600;
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(line, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top 65%',
                    end: 'bottom 65%',
                    scrub: 1,
                },
            });
        }

        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            const body = item.querySelector('.timeline-body');
            const dot  = item.querySelector('.timeline-dot');
            const fromLeft = i % 2 === 0;

            if (body) {
                gsap.from(body, {
                    opacity: 0,
                    x: fromLeft ? -50 : 50,
                    duration: 0.65,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: item, start: 'top 82%', once: true },
                });
            }
            if (dot) {
                gsap.from(dot, {
                    scale: 0,
                    duration: 0.35,
                    delay: 0.15,
                    ease: 'back.out(2)',
                    scrollTrigger: { trigger: item, start: 'top 82%', once: true },
                });
            }
        });
    }

    /* ——— Horizontal scroll track for projects ——— */
    _horizontalProjects() {
        const container = document.querySelector('.h-scroll-container');
        const track     = document.querySelector('.h-scroll-track');
        if (!container || !track) return;

        // On mobile, use native scroll — skip GSAP pin
        if (window.innerWidth <= 768) return;

        const getShift = () => track.scrollWidth - container.clientWidth;

        const tween = gsap.to(track, {
            x: () => -getShift(),
            ease: 'none',
        });

        const st = ScrollTrigger.create({
            trigger: container,
            pin: true,
            start: 'top top',
            end: () => `+=${getShift()}`,
            scrub: 1.2,
            animation: tween,
            invalidateOnRefresh: true,
        });

        // Progress dots
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${getShift()}`,
            scrub: true,
            onUpdate: (self) => {
                const dots  = document.querySelectorAll('.h-scroll-dot');
                const total = dots.length;
                if (!total) return;
                const active = Math.round(self.progress * (total - 1));
                dots.forEach((d, i) => d.classList.toggle('active', i === active));
            },
        });

        // Card entrance
        gsap.utils.toArray('.operation-card').forEach((card) => {
            gsap.from(card, {
                opacity: 0,
                scale: 0.92,
                rotateY: 12,
                duration: 0.55,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: st,
                    start: 'left 92%',
                    once: true,
                },
            });
        });
    }

    /* ——— Button click ripple ——— */
    _buttonRipple() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const rect   = btn.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height) * 2;
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            ripple.style.cssText = `
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size / 2}px;
                top:${e.clientY - rect.top  - size / 2}px;
            `;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }
}

const scrollStories = new ScrollStories();
