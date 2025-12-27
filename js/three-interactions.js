// ===== THREE-INTERACTIONS.JS =====
// 3D event handlers and interaction management.
// Handles mouse, touch, and scroll interactions with 3D objects.

class ThreeInteractions {
    constructor(threeWorldInstance) {
        this.world = threeWorldInstance;
        this.raycaster = null;
        this.mouseVector = null;
        this.hoveredObject = null;
        this.isEnabled = true;
    }
    
    init() {
        if (typeof THREE !== 'undefined') {
            this.raycaster = new THREE.Raycaster();
            this.mouseVector = new THREE.Vector2();
        }
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('touchstart', (e) => this.onTouchStart(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e));
    }
    
    onMouseMove(e) {
        if (!this.isEnabled || !this.world) return;
        
        // Update mouse vector for raycasting
        if (this.mouseVector) {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }
        
        // Check for hoverable objects
        this.checkHover();
    }
    
    onClick(e) {
        if (!this.isEnabled || !this.world) return;
        
        // Update mouse vector
        if (this.mouseVector) {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }
        
        // Check for clickable objects
        this.checkClick();
    }
    
    onTouchStart(e) {
        if (!this.isEnabled || e.touches.length === 0) return;
        
        const touch = e.touches[0];
        if (this.mouseVector) {
            this.mouseVector.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onTouchMove(e) {
        if (!this.isEnabled || e.touches.length === 0) return;
        
        const touch = e.touches[0];
        
        // Update world mouse position for tilt effect
        if (this.world) {
            this.world.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.world.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            if (this.world.heroCore && this.world.isActive) {
                this.world.targetRotation.x = this.world.mouse.y * CONFIG.MOUSE.TILT_STRENGTH;
                this.world.targetRotation.y = this.world.mouse.x * CONFIG.MOUSE.TILT_STRENGTH;
            }
        }
    }
    
    checkHover() {
        if (!this.raycaster || !this.world || !this.world.scene || !this.world.camera) return;
        
        this.raycaster.setFromCamera(this.mouseVector, this.world.camera);
        
        // Check heroCore for hover
        if (this.world.heroCore) {
            const intersects = this.raycaster.intersectObject(this.world.heroCore, true);
            
            if (intersects.length > 0) {
                if (!this.hoveredObject) {
                    this.onHeroHoverStart();
                }
                this.hoveredObject = this.world.heroCore;
            } else if (this.hoveredObject) {
                this.onHeroHoverEnd();
                this.hoveredObject = null;
            }
        }
    }
    
    checkClick() {
        if (!this.raycaster || !this.world || !this.world.scene || !this.world.camera) return;
        
        this.raycaster.setFromCamera(this.mouseVector, this.world.camera);
        
        if (this.world.heroCore) {
            const intersects = this.raycaster.intersectObject(this.world.heroCore, true);
            
            if (intersects.length > 0) {
                this.onHeroClick();
            }
        }
    }
    
    onHeroHoverStart() {
        if (this.world.heroCore && typeof gsap !== 'undefined') {
            gsap.to(this.world.heroCore.scale, {
                x: CONFIG.HERO_CORE.SCALE_HOVER.x,
                y: CONFIG.HERO_CORE.SCALE_HOVER.y,
                z: CONFIG.HERO_CORE.SCALE_HOVER.z,
                duration: 0.3,
                ease: 'back.out',
            });
        }
        document.body.style.cursor = 'pointer';
    }
    
    onHeroHoverEnd() {
        if (this.world.heroCore && typeof gsap !== 'undefined') {
            gsap.to(this.world.heroCore.scale, {
                x: CONFIG.HERO_CORE.SCALE_IDLE.x,
                y: CONFIG.HERO_CORE.SCALE_IDLE.y,
                z: CONFIG.HERO_CORE.SCALE_IDLE.z,
                duration: 0.3,
                ease: 'back.out',
            });
        }
        document.body.style.cursor = 'default';
    }
    
    onHeroClick() {
        // Pulse effect on click
        if (this.world.heroCore && typeof gsap !== 'undefined') {
            gsap.to(this.world.heroCore.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
            });
        }
        console.log('[3D] Hero core clicked');
    }
    
    enable() {
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
    }
}

// Will be initialized after threeWorld is ready
let threeInteractions = null;

