// ===== NAV.JS =====
// Advanced sticky navigation: transparent → frosted glass.
// Mobile full-screen overlay with GSAP stagger reveal.

class AdvancedNav {
    constructor() {
        this.nav         = null;
        this.underliner  = null;
        this.activeLink  = null;
        this.mobileOpen  = false;
        this.sections    = ['hero', 'proof', 'projects', 'philosophy', 'timeline', 'github', 'contact'];
    }

    init() {
        this._createNav();
        this._bindEvents();
        this._initSectionObserver();
        this._onScroll(); // set initial state
    }

    _createNav() {
        const nav = document.createElement('nav');
        nav.id        = 'main-nav';
        nav.className = 'main-nav';
        nav.setAttribute('aria-label', 'Main navigation');

        nav.innerHTML = `
            <div class="nav-container">
                <a href="#hero" class="nav-brand" aria-label="Kaushal Kumar — Home">
                    <span class="nav-brand-text">K.K.</span>
                    <span class="nav-brand-sub">SYSTEM CORE</span>
                </a>

                <div class="nav-links" role="list">
                    <a href="#hero"       class="nav-link" data-section="hero"       role="listitem">HOME</a>
                    <a href="#proof"      class="nav-link" data-section="proof"      role="listitem">SKILLS</a>
                    <a href="#projects"   class="nav-link" data-section="projects"   role="listitem">WORK</a>
                    <a href="#philosophy" class="nav-link" data-section="philosophy" role="listitem">DOCTRINE</a>
                    <a href="#timeline"   class="nav-link" data-section="timeline"   role="listitem">TIMELINE</a>
                    <a href="#contact"    class="nav-link" data-section="contact"    role="listitem">CONTACT</a>
                    <div class="nav-underline" id="nav-underline" aria-hidden="true"></div>
                </div>

                <div class="nav-actions">
                    <button class="theme-toggle" id="theme-toggle" aria-label="Cycle theme">
                        <span class="theme-icon" aria-hidden="true">●</span>
                    </button>
                    <button class="nav-mobile-toggle" id="nav-mobile-toggle"
                            aria-label="Open navigation menu" aria-expanded="false"
                            aria-controls="nav-mobile-overlay">
                        <div class="hamburger" aria-hidden="true">
                            <span></span><span></span><span></span>
                        </div>
                    </button>
                </div>
            </div>

            <div class="nav-mobile-overlay" id="nav-mobile-overlay"
                 role="dialog" aria-label="Navigation menu" aria-hidden="true">
                <div class="nav-mobile-links">
                    <a href="#hero"       class="nav-mobile-link" data-section="hero">HOME</a>
                    <a href="#proof"      class="nav-mobile-link" data-section="proof">SKILLS</a>
                    <a href="#projects"   class="nav-mobile-link" data-section="projects">WORK</a>
                    <a href="#philosophy" class="nav-mobile-link" data-section="philosophy">DOCTRINE</a>
                    <a href="#timeline"   class="nav-mobile-link" data-section="timeline">TIMELINE</a>
                    <a href="#contact"    class="nav-mobile-link" data-section="contact">CONTACT</a>
                </div>
            </div>
        `;

        // Insert after skip-link (first child of body)
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) skipLink.after(nav);
        else document.body.prepend(nav);

        this.nav       = nav;
        this.underliner = nav.querySelector('#nav-underline');
    }

    _bindEvents() {
        window.addEventListener('scroll', () => this._onScroll(), { passive: true });

        // Smooth-scroll nav links
        this.nav.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id     = link.getAttribute('data-section');
                const target = document.getElementById(id);
                if (!target) return;

                if (window.lenis) {
                    window.lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                this._closeMobile();
            });
        });

        // Brand logo → top
        this.nav.querySelector('.nav-brand').addEventListener('click', (e) => {
            e.preventDefault();
            if (window.lenis) window.lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Mobile toggle
        const toggle = this.nav.querySelector('#nav-mobile-toggle');
        toggle && toggle.addEventListener('click', () => this._toggleMobile());

        // Underline hover
        this.nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => this._moveUnderline(link));
        });
        const linkContainer = this.nav.querySelector('.nav-links');
        linkContainer && linkContainer.addEventListener('mouseleave', () => {
            if (this.activeLink) this._moveUnderline(this.activeLink);
            else this.underliner && (this.underliner.style.opacity = '0');
        });

        // ESC closes mobile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileOpen) this._closeMobile();
        });
    }

    _onScroll() {
        if (!this.nav) return;
        this.nav.classList.toggle('nav-scrolled', window.scrollY > 40);
    }

    _initSectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this._setActive(entry.target.id);
            });
        }, { threshold: 0.25, rootMargin: '-72px 0px -40% 0px' });

        this.sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    }

    _setActive(sectionId) {
        this.nav.querySelectorAll('.nav-link').forEach(link => {
            const isActive = link.getAttribute('data-section') === sectionId;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
            if (isActive) {
                this.activeLink = link;
                this._moveUnderline(link);
            }
        });
    }

    _moveUnderline(link) {
        if (!this.underliner || !link) return;
        const rect  = link.getBoundingClientRect();
        const pRect = link.parentElement.getBoundingClientRect();
        this.underliner.style.width   = rect.width + 'px';
        this.underliner.style.left    = (rect.left - pRect.left) + 'px';
        this.underliner.style.opacity = '1';
    }

    _toggleMobile() {
        this.mobileOpen ? this._closeMobile() : this._openMobile();
    }

    _openMobile() {
        this.mobileOpen = true;
        const overlay = this.nav.querySelector('#nav-mobile-overlay');
        const toggle  = this.nav.querySelector('#nav-mobile-toggle');
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation menu');
        this.nav.classList.add('mobile-open');
        document.body.style.overflow = 'hidden';

        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.nav-mobile-link',
                { opacity: 0, y: 28 },
                { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' }
            );
        }
    }

    _closeMobile() {
        this.mobileOpen = false;
        const overlay = this.nav.querySelector('#nav-mobile-overlay');
        const toggle  = this.nav.querySelector('#nav-mobile-toggle');
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        this.nav.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }
}

const advancedNav = new AdvancedNav();
