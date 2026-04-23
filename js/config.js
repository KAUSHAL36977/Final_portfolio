// ===== CONFIG.JS =====
// All magic numbers. Immutable. Controls everything.

const CONFIG = {
    // 3D SCENE
    THREE: {
        FOV: 75,
        NEAR: 0.1,
        FAR: 10000,
        CAMERA_Z: 35,
        CAMERA_Z_SCROLL: 15,
        BG_COLOR: 0x050507,
        FOG_COLOR: 0x050507,
        FOG_NEAR: 50,
        FOG_FAR: 1000,
    },

    // HERO CORE OBJECT
    HERO_CORE: {
        GEOMETRY: 'icosahedron',
        RADIUS: 8,
        DETAIL: 4,
        COLOR_PRIMARY: 0x00F5FF,
        COLOR_SECONDARY: 0x7B2FF7,
        WIREFRAME: true,
        OPACITY: 0.3,
        EMISSIVE_INTENSITY: 0.3,
        SCALE_IDLE:  { x: 1,   y: 1,   z: 1   },
        SCALE_HOVER: { x: 1.1, y: 1.1, z: 1.1 },
    },

    // PARTICLES
    PARTICLES: {
        COUNT: 350,
        SIZE: 0.5,
        COLOR: 0x00F5FF,
        OPACITY: 0.7,
        ROTATION_SPEED: 60,
    },

    // GRID
    GRID: {
        SIZE: 100,
        DIVISIONS: 20,
        COLOR: 0x00F5FF,
        OPACITY: 0.08,
    },

    // TORUS RING
    TORUS: {
        RADIUS: 14,
        TUBE: 0.4,
        RADIAL: 6,
        TUBULAR: 80,
        COLOR: 0x7B2FF7,
        OPACITY: 0.5,
    },

    // INTERACTION
    MOUSE: {
        TILT_STRENGTH: 0.5,
        TILT_EASE: 0.8,
    },

    // ANIMATION
    ANIMATION: {
        BOOT_DURATION: 3600, // ms — cinematic boot
        SCROLL_SPEED: 0.5,
        BUTTON_SCALE: 1.05,
        CARD_LIFT: 8,
    },

    // BREAKPOINTS
    BREAKPOINT_MOBILE: 480,
    BREAKPOINT_TABLET: 768,
    BREAKPOINT_DESKTOP: 1024,
};


