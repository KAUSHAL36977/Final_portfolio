// ===== CORE.JS =====
// App state management and lifecycle.

class AppCore {
    constructor() {
        this.state = {
            isBooted: false,
            isReady: false,
            currentSection: 'hero',
            scrollProgress: 0,
            isMobile: false,
        };
        
        this.data = null;
        this.bootSequence = null;
    }
    
    init() {
        this.bootSequence = UISystem.querySelector('#boot-sequence');
        this.checkDevice();
        this.bindGlobalEvents();
    }
    
    checkDevice() {
        this.state.isMobile = window.innerWidth < CONFIG.BREAKPOINT_TABLET;
    }
    
    bindGlobalEvents() {
        window.addEventListener('resize', () => {
            this.checkDevice();
        });
        
        // Visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
    }
    
    onPageHidden() {
        console.log('[CORE] Page hidden - reducing activity');
    }
    
    onPageVisible() {
        console.log('[CORE] Page visible - resuming activity');
    }
    
    setState(key, value) {
        this.state[key] = value;
    }
    
    getState(key) {
        return this.state[key];
    }
    
    updateSection(sectionId) {
        this.state.currentSection = sectionId;
        console.log(`[CORE] Current section: ${sectionId}`);
    }
    
    runBootSequence() {
        console.log('[CORE] Boot sequence initiated...');
        this.state.isBooted = false;
        
        setTimeout(() => {
            if (this.bootSequence) {
                this.bootSequence.classList.add('hidden');
            }
            document.body.classList.remove('boot-mode');
            document.body.classList.add('ready');
            this.state.isBooted = true;
            this.state.isReady = true;
            console.log('[CORE] System online. Ready for interaction.');
        }, CONFIG.ANIMATION.BOOT_DURATION);
    }
}

const appCore = new AppCore();

