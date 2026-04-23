// ===== THEME.JS =====
// 3-mode theme system: VOID → STEEL → GHOST.

class ThemeSystem {
    constructor() {
        this.themes = {
            VOID: {
                '--color-void':     '#050507',
                '--color-obsidian': '#0B0B10',
                '--color-gunmetal': '#111118',
                '--color-carbon':   '#1A1A22',
                '--color-platinum': '#E6E9F0',
                '--color-cyan':     '#00F5FF',
                '--color-violet':   '#7B2FF7',
                '--bg-primary':     '#050507',
                '--bg-secondary':   '#0B0B10',
                '--text-primary':   '#E6E9F0',
                '--text-secondary': '#C9CCD6',
                '--text-tertiary':  '#8B8B99',
                '--border-color':   'rgba(230,233,240,0.10)',
                '--border-color-light': 'rgba(230,233,240,0.20)',
                '--shadow-glow':    '0 0 20px rgba(0,245,255,0.30)',
                '--shadow-glow-strong': '0 0 40px rgba(0,245,255,0.55)',
            },
            STEEL: {
                '--color-void':     '#0D1117',
                '--color-obsidian': '#161B22',
                '--color-gunmetal': '#1C2130',
                '--color-carbon':   '#252B3A',
                '--color-platinum': '#E8EEF6',
                '--color-cyan':     '#58A6FF',
                '--color-violet':   '#BC8CFF',
                '--bg-primary':     '#0D1117',
                '--bg-secondary':   '#161B22',
                '--text-primary':   '#F0F6FC',
                '--text-secondary': '#B1BAC4',
                '--text-tertiary':  '#6E7681',
                '--border-color':   'rgba(240,246,252,0.10)',
                '--border-color-light': 'rgba(240,246,252,0.18)',
                '--shadow-glow':    '0 0 20px rgba(88,166,255,0.25)',
                '--shadow-glow-strong': '0 0 40px rgba(88,166,255,0.45)',
            },
            GHOST: {
                '--color-void':     '#F5F6FA',
                '--color-obsidian': '#ECEEF5',
                '--color-gunmetal': '#E2E5EF',
                '--color-carbon':   '#D4D8E8',
                '--color-platinum': '#1A1A2E',
                '--color-cyan':     '#0066CC',
                '--color-violet':   '#6941C6',
                '--bg-primary':     '#F5F6FA',
                '--bg-secondary':   '#ECEEF5',
                '--text-primary':   '#1A1A2E',
                '--text-secondary': '#4A4F6A',
                '--text-tertiary':  '#6E7498',
                '--border-color':   'rgba(26,26,46,0.12)',
                '--border-color-light': 'rgba(26,26,46,0.20)',
                '--shadow-glow':    '0 0 20px rgba(0,102,204,0.20)',
                '--shadow-glow-strong': '0 0 40px rgba(0,102,204,0.38)',
            },
        };

        this.order   = ['VOID', 'STEEL', 'GHOST'];
        this.current = 'VOID';
    }

    init() {
        const saved = localStorage.getItem('kk-theme') || 'VOID';
        this._apply(saved, false);

        const btn = document.getElementById('theme-toggle');
        btn && btn.addEventListener('click', () => this._cycle());
    }

    _cycle() {
        const idx  = this.order.indexOf(this.current);
        const next = this.order[(idx + 1) % this.order.length];
        this._apply(next, true);
    }

    _apply(name, animate) {
        if (!this.themes[name]) return;
        this.current = name;
        localStorage.setItem('kk-theme', name);

        const root = document.documentElement;
        const vars = this.themes[name];

        const applyVars = () => {
            Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
            root.setAttribute('data-theme', name.toLowerCase());
            this._updateIcon();

            // Update Three.js scene colors if available
            if (window.threeWorld && window.threeWorld.scene) {
                const bg = name === 'GHOST' ? 0xF5F6FA : (name === 'STEEL' ? 0x0D1117 : 0x050507);
                window.threeWorld.scene.background = new THREE.Color(bg);
                if (window.threeWorld.scene.fog) {
                    window.threeWorld.scene.fog.color = new THREE.Color(bg);
                }
            }
        };

        if (animate && typeof gsap !== 'undefined') {
            gsap.to('body', {
                opacity: 0.7,
                duration: 0.15,
                onComplete: () => {
                    applyVars();
                    gsap.to('body', { opacity: 1, duration: 0.25 });
                },
            });
        } else {
            applyVars();
        }
    }

    _updateIcon() {
        const icons = { VOID: '●', STEEL: '◑', GHOST: '○' };
        const icon  = document.querySelector('.theme-icon');
        if (icon) icon.textContent = icons[this.current] || '◐';

        const btn = document.getElementById('theme-toggle');
        if (btn) btn.setAttribute('aria-label', `Theme: ${this.current} — click to cycle`);
    }
}

const themeSystem = new ThemeSystem();
