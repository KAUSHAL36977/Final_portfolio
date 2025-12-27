// ===== SCROLL-DEPTH.JS =====
// Scroll progress tracking. Camera depth. Scroll-to-depth.

class ScrollDepth {
    constructor() {
        this.progress = 0;
        this.direction = 'down';
        this.lastScrollY = 0;
        this.depth = 0;
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateScroll());
        this.updateScroll();
    }
    
    updateScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.progress = window.scrollY / scrollHeight;
        
        // DIRECTION
        this.direction = window.scrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = window.scrollY;
        
        // UPDATE PROGRESS BAR
        const progressBar = UISystem.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.height = this.progress * 100 + '%';
        }
        
        // UPDATE DEPTH (0-100)
        this.depth = Math.round(this.progress * 100);
    }
    
    getProgress() {
        return this.progress;
    }
}

const scrollDepth = new ScrollDepth();

