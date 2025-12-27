// ===== THREE-WORLD.JS =====
// Three.js scene initialization. The 3D universe.

class ThreeWorld {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.heroCore = null;
        this.particles = null;
        this.grid = null;
        this.lights = [];
        
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.scrollProgress = 0;
        
        this.isActive = false;
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.createBackground();
        this.createHeroCore();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
        this.isActive = true;
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.THREE.BG_COLOR);
        this.scene.fog = new THREE.Fog(
            CONFIG.THREE.FOG_COLOR,
            CONFIG.THREE.FOG_NEAR,
            CONFIG.THREE.FOG_FAR
        );
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.THREE.FOV,
            window.innerWidth / window.innerHeight,
            CONFIG.THREE.NEAR,
            CONFIG.THREE.FAR
        );
        this.camera.position.z = CONFIG.THREE.CAMERA_Z;
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    setupLighting() {
        // AMBIENT LIGHT
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // MAIN POINT LIGHT
        const pointLight = new THREE.PointLight(0x00F5FF, 1.2, 100);
        pointLight.position.set(20, 20, 20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);
        this.lights.push(pointLight);
        
        // SECONDARY LIGHT
        const secondaryLight = new THREE.PointLight(0x7B2FF7, 0.8, 80);
        secondaryLight.position.set(-20, 10, 15);
        this.scene.add(secondaryLight);
        this.lights.push(secondaryLight);
    }
    
    createBackground() {
        const geometry = new THREE.BufferGeometry();
        const size = CONFIG.GRID.SIZE;
        const divisions = CONFIG.GRID.DIVISIONS;
        const step = size / divisions;
        const points = [];
        
        for (let i = -size / 2; i <= size / 2; i += step) {
            points.push(-size / 2, 0, i);
            points.push(size / 2, 0, i);
            points.push(i, 0, -size / 2);
            points.push(i, 0, size / 2);
        }
        
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(points), 3)
        );
        
        const material = new THREE.LineBasicMaterial({
            color: CONFIG.GRID.COLOR,
            transparent: true,
            opacity: CONFIG.GRID.OPACITY,
        });
        
        this.grid = new THREE.LineSegments(geometry, material);
        this.grid.position.y = -20;
        this.scene.add(this.grid);
    }
    
    createHeroCore() {
        const config = CONFIG.HERO_CORE;
        
        // MAIN ICOSAHEDRON
        const geometry = new THREE.IcosahedronGeometry(config.RADIUS, config.DETAIL);
        const material = new THREE.MeshPhongMaterial({
            color: config.COLOR_PRIMARY,
            wireframe: config.WIREFRAME,
            transparent: true,
            opacity: config.OPACITY,
            emissive: config.COLOR_PRIMARY,
            emissiveIntensity: config.EMISSIVE_INTENSITY,
            side: THREE.DoubleSide,
        });
        
        this.heroCore = new THREE.Mesh(geometry, material);
        this.scene.add(this.heroCore);
        
        // INNER GLOW SPHERE
        const innerGeometry = new THREE.IcosahedronGeometry(config.RADIUS * 0.95, 3);
        const innerMaterial = new THREE.MeshPhongMaterial({
            color: config.COLOR_SECONDARY,
            wireframe: config.WIREFRAME,
            transparent: true,
            opacity: config.OPACITY * 0.7,
            emissive: config.COLOR_SECONDARY,
            emissiveIntensity: 0.2,
            side: THREE.DoubleSide,
        });
        
        const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        this.heroCore.add(innerCore);
        
        // CORE LIGHT
        const coreLight = new THREE.PointLight(config.COLOR_PRIMARY, 0.8, 60);
        coreLight.position.set(0, 0, 0);
        this.heroCore.add(coreLight);
    }
    
    createParticles() {
        const config = CONFIG.PARTICLES;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.COUNT * 3);
        
        for (let i = 0; i < config.COUNT * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 120;
            positions[i + 1] = (Math.random() - 0.5) * 120;
            positions[i + 2] = (Math.random() - 0.5) * 120;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: config.COLOR,
            size: config.SIZE,
            sizeAttenuation: true,
            transparent: true,
            opacity: config.OPACITY,
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // ROTATE PARTICLES
        gsap.to(this.particles.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: config.ROTATION_SPEED,
            repeat: -1,
            ease: 'none',
        });
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', (e) => this.onScroll(e));
        window.addEventListener('resize', (e) => this.onResize(e));
    }
    
    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        if (this.heroCore && this.isActive) {
            this.targetRotation.x = this.mouse.y * CONFIG.MOUSE.TILT_STRENGTH;
            this.targetRotation.y = this.mouse.x * CONFIG.MOUSE.TILT_STRENGTH;
        }
    }
    
    onScroll(e) {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        this.scrollProgress = scrollPercent;
        
        // CAMERA MOVES FORWARD DURING SCROLL
        if (this.camera) {
            const targetZ = CONFIG.THREE.CAMERA_Z - (scrollPercent * (CONFIG.THREE.CAMERA_Z - CONFIG.THREE.CAMERA_Z_SCROLL));
            gsap.to(this.camera.position, {
                z: targetZ,
                duration: 0.3,
                ease: 'power1.out',
            });
        }
    }
    
    onResize(e) {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.heroCore) {
            // SMOOTH ROTATION TOWARDS TARGET
            this.heroCore.rotation.x += (this.targetRotation.x - this.heroCore.rotation.x) * CONFIG.MOUSE.TILT_EASE * 0.016;
            this.heroCore.rotation.y += (this.targetRotation.y - this.heroCore.rotation.y) * CONFIG.MOUSE.TILT_EASE * 0.016;
            
            // IDLE ROTATION WHEN MOUSE NOT MOVED
            if (Math.abs(this.mouse.x) < 0.01 && Math.abs(this.mouse.y) < 0.01) {
                this.heroCore.rotation.x += 0.0005;
                this.heroCore.rotation.y += 0.0008;
            }
        }
        
        if (this.grid) {
            this.grid.rotation.x += 0.00005;
        }
        
        this.renderer.render(this.scene, this.camera);
    };
}

// EXPORT
const threeWorld = new ThreeWorld();

