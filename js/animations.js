// ===== ANIMATIONS.JS =====
// GSAP timelines. Orchestrated motion. Obsessive control.

class AnimationEngine {
    constructor() {
        this.timelines = {};
        this.scrollTimeline = null;
        this.isInitialized = false;
    }
    
    init() {
        this.registerScrollAnimations();
        this.registerButtonAnimations();
        this.registerSectionAnimations();
        this.isInitialized = true;
    }
    
    registerScrollAnimations() {
        // HERO FADE IN
        gsap.to('.hero-text', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
            },
            opacity: 0.7,
            y: -30,
        });
        
        // SECTION CARDS STAGGER
        const cards = gsap.utils.toArray('.skill-vault, .operation-card, .doctrine-card');
        cards.forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
            });
        });
    }
    
    registerButtonAnimations() {
        document.querySelectorAll('.btn').forEach((btn) => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'back.out',
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out',
                });
            });
        });
    }
    
    registerSectionAnimations() {
        // STAGGER HERO METRICS
        gsap.from('.metric-item', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            delay: 2.7, // After boot sequence
            ease: 'power2.out',
        });
    }
}

const animationEngine = new AnimationEngine();

