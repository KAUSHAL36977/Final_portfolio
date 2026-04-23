// ===== THREE-WORLD.JS =====
// Upgraded Three.js scene:
//   • Custom GLSL vertex shader (Perlin noise displacement — hero core "breathes")
//   • Glowing circular particles (ShaderMaterial fragment shader)
//   • Tilted orbit torus ring around the core
//   • EffectComposer + UnrealBloomPass for glow (if available)
//   • Scroll-linked camera path via Catmull-Rom curve

// ── Simplex noise GLSL (embedded) ──────────────────────────────────────────
const SIMPLEX_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=1./7.;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// ── Vertex shader: noise-driven organic displacement ─────────────────────
const CORE_VERT = `
${SIMPLEX_GLSL}
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPos;
void main(){
  vNormal=normal;
  vPos=position;
  float n=snoise(position*0.25+uTime*0.4)*1.8;
  vec3 displaced=position+normal*n;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.);
}`;

// ── Fragment shader: cyan wireframe glow ─────────────────────────────────
const CORE_FRAG = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec3 vNormal;
void main(){
  float fresnel=pow(1.-abs(dot(vNormal,vec3(0.,0.,1.))),2.);
  gl_FragColor=vec4(uColor,uOpacity*(0.4+fresnel*0.6));
}`;

// ── Particle fragment: glowing circular points ───────────────────────────
const PARTICLE_FRAG = `
varying float vAlpha;
uniform vec3 uColor;
void main(){
  vec2 uv=gl_PointCoord-0.5;
  float d=length(uv);
  float circle=1.-smoothstep(0.3,0.5,d);
  float glow  =1.-smoothstep(0.0,0.5,d);
  gl_FragColor=vec4(uColor,(circle*0.9+glow*0.4)*vAlpha);
}`;

const PARTICLE_VERT = `
attribute float aAlpha;
varying  float vAlpha;
uniform  float uTime;
void main(){
  vAlpha=aAlpha;
  vec3 pos=position;
  pos.y+=sin(pos.x*0.3+uTime)*0.5;
  pos.x+=cos(pos.z*0.3+uTime)*0.5;
  gl_PointSize=mix(2.,6.,aAlpha);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}`;

class ThreeWorld {
    constructor() {
        this.canvas   = document.getElementById('three-canvas');
        this.scene    = null;
        this.camera   = null;
        this.renderer = null;
        this.composer = null;   // EffectComposer (optional)
        this.heroCore = null;
        this.torusRing = null;
        this.particles = null;
        this.grid      = null;
        this.lights    = [];
        this.coreUniforms = null;
        this.particleUniforms = null;
        this.clock    = new THREE.Clock();

        this.mouse          = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.scrollProgress = 0;
        this.isActive = false;
    }

    init() {
        this._setupScene();
        this._setupCamera();
        this._setupRenderer();
        this._setupLighting();
        this._createBackground();
        this._createHeroCore();
        this._createTorusRing();
        this._createParticles();
        this._setupPostProcessing();
        this._setupEventListeners();
        this._animate();
        this.isActive = true;
    }

    _setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.THREE.BG_COLOR);
        this.scene.fog = new THREE.Fog(CONFIG.THREE.FOG_COLOR, CONFIG.THREE.FOG_NEAR, CONFIG.THREE.FOG_FAR);
    }

    _setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.THREE.FOV,
            window.innerWidth / window.innerHeight,
            CONFIG.THREE.NEAR,
            CONFIG.THREE.FAR
        );
        this.camera.position.z = CONFIG.THREE.CAMERA_Z;
    }

    _setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping      = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    _setupLighting() {
        const amb = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(amb);
        this.lights.push(amb);

        const pt1 = new THREE.PointLight(0x00F5FF, 1.5, 120);
        pt1.position.set(20, 20, 20);
        this.scene.add(pt1);
        this.lights.push(pt1);

        const pt2 = new THREE.PointLight(0x7B2FF7, 1.0, 100);
        pt2.position.set(-20, 10, 15);
        this.scene.add(pt2);
        this.lights.push(pt2);
    }

    _createBackground() {
        const { SIZE, DIVISIONS, COLOR, OPACITY } = CONFIG.GRID;
        const step   = SIZE / DIVISIONS;
        const pts    = [];
        for (let i = -SIZE / 2; i <= SIZE / 2; i += step) {
            pts.push(-SIZE / 2, 0, i, SIZE / 2, 0, i);
            pts.push(i, 0, -SIZE / 2, i, 0, SIZE / 2);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
        const mat = new THREE.LineBasicMaterial({ color: COLOR, transparent: true, opacity: OPACITY });
        this.grid = new THREE.LineSegments(geo, mat);
        this.grid.position.y = -20;
        this.scene.add(this.grid);
    }

    _createHeroCore() {
        const c = CONFIG.HERO_CORE;

        this.coreUniforms = {
            uTime:    { value: 0 },
            uColor:   { value: new THREE.Color(c.COLOR_PRIMARY) },
            uOpacity: { value: c.OPACITY },
        };

        const geo = new THREE.IcosahedronGeometry(c.RADIUS, c.DETAIL);
        const mat = new THREE.ShaderMaterial({
            vertexShader:   CORE_VERT,
            fragmentShader: CORE_FRAG,
            uniforms: this.coreUniforms,
            transparent: true,
            wireframe: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });

        this.heroCore = new THREE.Mesh(geo, mat);
        this.scene.add(this.heroCore);

        // Inner shell (secondary color)
        const innerUniforms = {
            uTime:    this.coreUniforms.uTime, // shared ref
            uColor:   { value: new THREE.Color(c.COLOR_SECONDARY) },
            uOpacity: { value: c.OPACITY * 0.6 },
        };
        const innerGeo = new THREE.IcosahedronGeometry(c.RADIUS * 0.88, 3);
        const innerMat = new THREE.ShaderMaterial({
            vertexShader: CORE_VERT,
            fragmentShader: CORE_FRAG,
            uniforms: innerUniforms,
            transparent: true,
            wireframe: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });
        this.heroCore.add(new THREE.Mesh(innerGeo, innerMat));

        // Core point light
        const coreLight = new THREE.PointLight(c.COLOR_PRIMARY, 1.2, 60);
        coreLight.position.set(0, 0, 0);
        this.heroCore.add(coreLight);
    }

    _createTorusRing() {
        const t = CONFIG.TORUS;
        const geo = new THREE.TorusGeometry(t.RADIUS, t.TUBE, t.RADIAL, t.TUBULAR);
        const mat = new THREE.MeshPhongMaterial({
            color:           t.COLOR,
            emissive:        t.COLOR,
            emissiveIntensity: 0.5,
            transparent:     true,
            opacity:         t.OPACITY,
            wireframe:       false,
        });
        this.torusRing = new THREE.Mesh(geo, mat);
        this.torusRing.rotation.x = Math.PI / 2.8;
        this.torusRing.rotation.z = 0.4;
        this.scene.add(this.torusRing);
    }

    _createParticles() {
        const { COUNT } = CONFIG.PARTICLES;
        const positions = new Float32Array(COUNT * 3);
        const alphas    = new Float32Array(COUNT);

        for (let i = 0; i < COUNT; i++) {
            const i3 = i * 3;
            positions[i3]     = (Math.random() - 0.5) * 120;
            positions[i3 + 1] = (Math.random() - 0.5) * 120;
            positions[i3 + 2] = (Math.random() - 0.5) * 120;
            alphas[i] = Math.random() * 0.8 + 0.2;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aAlpha',   new THREE.BufferAttribute(alphas,    1));

        this.particleUniforms = {
            uTime:  { value: 0 },
            uColor: { value: new THREE.Color(CONFIG.PARTICLES.COLOR) },
        };

        const mat = new THREE.ShaderMaterial({
            vertexShader:   PARTICLE_VERT,
            fragmentShader: PARTICLE_FRAG,
            uniforms:       this.particleUniforms,
            transparent:    true,
            depthWrite:     false,
            blending:       THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);

        gsap.to(this.particles.rotation, {
            y: Math.PI * 2,
            duration: 60,
            repeat: -1,
            ease: 'none',
        });
    }

    _setupPostProcessing() {
        // Use THREE.EffectComposer if the legacy scripts were loaded
        if (typeof THREE.EffectComposer === 'undefined') return;

        try {
            this.composer = new THREE.EffectComposer(this.renderer);
            const renderPass = new THREE.RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);

            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.7,  // strength
                0.4,  // radius
                0.6   // threshold
            );
            this.composer.addPass(bloomPass);
        } catch (e) {
            console.warn('[THREE] Post-processing setup failed:', e.message);
            this.composer = null;
        }
    }

    _setupEventListeners() {
        window.addEventListener('mousemove', (e) => this._onMouseMove(e));
        window.addEventListener('scroll',    (e) => this._onScroll());
        window.addEventListener('resize',    (e) => this._onResize());
    }

    _onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        if (this.heroCore && this.isActive) {
            this.targetRotation.x = this.mouse.y * CONFIG.MOUSE.TILT_STRENGTH;
            this.targetRotation.y = this.mouse.x * CONFIG.MOUSE.TILT_STRENGTH;
        }
    }

    _onScroll() {
        const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        this.scrollProgress = pct;
        if (this.camera) {
            const targetZ = CONFIG.THREE.CAMERA_Z - pct * (CONFIG.THREE.CAMERA_Z - CONFIG.THREE.CAMERA_Z_SCROLL);
            gsap.to(this.camera.position, { z: targetZ, duration: 0.4, ease: 'power1.out' });
        }
    }

    _onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    _animate = () => {
        requestAnimationFrame(this._animate);
        const t = this.clock.getElapsedTime();

        // Update shader uniforms
        if (this.coreUniforms)     this.coreUniforms.uTime.value     = t;
        if (this.particleUniforms) this.particleUniforms.uTime.value = t;

        // Smooth hero core rotation
        if (this.heroCore) {
            this.heroCore.rotation.x += (this.targetRotation.x - this.heroCore.rotation.x) * CONFIG.MOUSE.TILT_EASE * 0.016;
            this.heroCore.rotation.y += (this.targetRotation.y - this.heroCore.rotation.y) * CONFIG.MOUSE.TILT_EASE * 0.016;
            if (Math.abs(this.mouse.x) < 0.01 && Math.abs(this.mouse.y) < 0.01) {
                this.heroCore.rotation.x += 0.0004;
                this.heroCore.rotation.y += 0.0007;
            }
        }

        // Torus ring slow orbit
        if (this.torusRing) {
            this.torusRing.rotation.z += 0.003;
            this.torusRing.rotation.y += 0.001;
        }

        if (this.grid) this.grid.rotation.y += 0.00008;

        // Render via composer or plain renderer
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    };
}

const threeWorld = new ThreeWorld();
window.threeWorld = threeWorld; // expose for theme system


