// ===== INPUT.JS =====
// Mouse, keyboard, touch tracking. User intention detection.

class InputTracker {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };
        this.isMoving = false;
        this.moveTimeout = null;
    }
    
    init() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseleave', () => this.onMouseLeave());
        window.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.isMoving = true;
        
        clearTimeout(this.moveTimeout);
        this.moveTimeout = setTimeout(() => {
            this.isMoving = false;
        }, 100);
    }
    
    onMouseLeave() {
        this.isMoving = false;
    }
    
    onClick(e) {
        const el = e.target.closest('[data-action]');
        if (el) {
            const action = el.getAttribute('data-action');
            this.executeAction(action);
        }
    }
    
    onKeyDown(e) {
        // ESC to close modals (if any)
        if (e.key === 'Escape') {
            document.body.classList.remove('modal-open');
        }
    }
    
    executeAction(action) {
        console.log(`Action executed: ${action}`);
    }
}

const inputTracker = new InputTracker();

