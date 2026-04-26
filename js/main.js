// ===== MAIN.JS =====
// APP INITIALIZATION. CINEMATIC BOOT. ORCHESTRATION.

class KaushalPortfolio {
    constructor() {
        this.isReady = false;
        this.data    = null;
    }

    async init() {
        console.log('[SYSTEM] Initializing Kaushal Vault...');

        await this.loadData();

        try {
            // ── Core subsystems ─────────────────────────────────────────
            UISystem.safeInit(() => inputTracker.init(), 'inputTracker');
            UISystem.safeInit(() => scrollDepth.init(),  'scrollDepth');
            UISystem.safeInit(() => appCore.init(),       'appCore');

            // ── UI modules (don't depend on data) ───────────────────────
            UISystem.safeInit(() => advancedNav.init(),     'advancedNav');
            UISystem.safeInit(() => magneticCursor.init(),  'magneticCursor');
            UISystem.safeInit(() => grainOverlay.init(),    'grainOverlay');
            UISystem.safeInit(() => cursorSpotlight.init(), 'cursorSpotlight');
            UISystem.safeInit(() => cardTilt.init(),        'cardTilt');
            UISystem.safeInit(() => themeSystem.init(),     'themeSystem');
            UISystem.safeInit(() => konamiEgg.init(),       'konamiEgg');

            // ── 3D world ─────────────────────────────────────────────────
            if (typeof THREE !== 'undefined') {
                UISystem.safeInit(() => {
                    threeWorld.init();
                    threeInteractions = new ThreeInteractions(threeWorld);
                    threeInteractions.init();
                }, 'Three.js');
            } else {
                console.warn('[SYSTEM] Three.js not loaded.');
            }

            // ── GSAP-based animation engine ──────────────────────────────
            if (typeof gsap !== 'undefined') {
                UISystem.safeInit(() => animationEngine.init(), 'animationEngine');
            }

            // ── Render dynamic content ───────────────────────────────────
            UISystem.safeInit(() => UISystem.setupNavigation(), 'setupNavigation');
            UISystem.safeInit(() => this.renderContent(),       'renderContent');

            // ── Modules that depend on rendered DOM ──────────────────────
            UISystem.safeInit(() => kineticText.init(),      'kineticText');
            UISystem.safeInit(() => animatedCounters.init(), 'animatedCounters');
            // init() before setSkills() so the canvas is ready to receive skill nodes
            UISystem.safeInit(() => skillConstellation.init(),                    'skillConstellation.init');
            UISystem.safeInit(() => skillConstellation.setSkills(this.data.skills), 'skillConstellation.setSkills');
            UISystem.safeInit(() => gitHubActivity.init(),   'gitHubActivity');
            if (typeof skillsRadar !== 'undefined') {
                UISystem.safeInit(() => skillsRadar.init(), 'skillsRadar');
            }

            // ── Scroll-driven stories (needs DOM + GSAP) ─────────────────
            if (typeof gsap !== 'undefined') {
                UISystem.safeInit(() => scrollStories.init(), 'scrollStories');
            }
        } catch (e) {
            console.error('[SYSTEM] Fatal init error:', e);
        }

        // ── Boot animation — always runs regardless of init errors ───
        this.runBootSequence();
    }

    async loadData() {
        try {
            const [projects, skills, timeline, content] = await Promise.all([
                fetch('data/projects.json').then(r => r.json()),
                fetch('data/skills.json').then(r => r.json()),
                fetch('data/timeline.json').then(r => r.json()),
                fetch('data/content.json').then(r => r.json()),
            ]);
            this.data = {
                projects: projects.projects || projects,
                skills:   skills.skills   || skills,
                timeline: timeline.timeline || timeline,
                content,
            };
        } catch (e) {
            console.warn('[SYSTEM] Data files not found — using fallback.');
            this.data = this.getFallbackData();
        }
    }

    getFallbackData() {
        return {
            projects: [
                {
                    title: 'Autonomous Ground Vehicle (AGV)',
                    icon: '🤖',
                    problem: 'Build an AI-driven rover for autonomous navigation in dynamic environments.',
                    impact: [
                        { value: '0.5m',  label: 'Precision' },
                        { value: '92%',   label: 'Accuracy' },
                        { value: '<200ms', label: 'Response' },
                    ],
                    stack: ['Python', 'OpenCV', 'TensorFlow', 'SLAM', 'Arduino'],
                },
                {
                    title: 'BOMANI: Livestock Intelligence',
                    icon: '🐄',
                    problem: 'Help 10M+ Indian farmers identify cattle breeds at scale in real-time.',
                    impact: [
                        { value: '10M+',      label: 'Users' },
                        { value: '92%',       label: 'Accuracy' },
                        { value: 'Real-Time', label: 'Processing' },
                    ],
                    stack: ['React Native', 'TensorFlow Lite', 'Node.js', 'MongoDB', 'Firebase'],
                },
                {
                    title: 'AI Email Automation Platform',
                    icon: '📧',
                    problem: 'Replace manual outreach with intelligent, contextual email sequences.',
                    impact: [
                        { value: '89%',  label: 'Accuracy' },
                        { value: '3x',   label: 'Reply Rate' },
                        { value: '1000+', label: 'Sent/Day' },
                    ],
                    stack: ['Node.js', 'OpenAI', 'PostgreSQL', 'Redis', 'React'],
                },
                {
                    title: 'Blockchain DeFi Protocol',
                    icon: '🔗',
                    problem: 'Build trustless financial primitives on Ethereum with minimal gas cost.',
                    impact: [
                        { value: '500+', label: 'Transactions' },
                        { value: '99.8%', label: 'Uptime' },
                        { value: 'E2E',   label: 'Tested' },
                    ],
                    stack: ['Solidity', 'Web3.js', 'Hardhat', 'Ethereum', 'Polygon'],
                },
            ],
            skills: [
                {
                    title: 'Full-Stack Architecture',
                    icon: '⚡',
                    description: 'React → Node.js → MongoDB. Designed systems serving 1,000+ concurrent users.',
                    tags: ['React', 'Node.js', 'MongoDB', 'Redis'],
                },
                {
                    title: 'AI/ML Integration',
                    icon: '🧠',
                    description: 'Shipped email automation with 89% accuracy. Computer vision pipeline for livestock ID.',
                    tags: ['TensorFlow', 'OpenAI', 'NLP', 'CV'],
                },
                {
                    title: 'Blockchain & Web3',
                    icon: '🔗',
                    description: 'Deployed smart contracts on Ethereum/Polygon. Built dApps with 500+ tx.',
                    tags: ['Solidity', 'Web3.js', 'Ethereum', 'Polygon'],
                },
                {
                    title: 'Mobile Development',
                    icon: '📱',
                    description: 'React Native apps shipped to production. 10M+ user base target.',
                    tags: ['React Native', 'Expo', 'Firebase', 'iOS/Android'],
                },
                {
                    title: 'Cloud Infrastructure',
                    icon: '☁️',
                    description: 'Scaled infra to 99.8% uptime. AWS, GCP, containerized deployments.',
                    tags: ['AWS', 'GCP', 'Docker', 'Kubernetes'],
                },
                {
                    title: 'Robotics & Embedded',
                    icon: '🤖',
                    description: 'AGV with SLAM navigation. 0.5m precision. Real-time sensor fusion.',
                    tags: ['Python', 'Arduino', 'SLAM', 'OpenCV'],
                },
            ],
            timeline: [
                { year: 2025, title: 'Campus Ambassador, Internshala',     detail: '500+ students mobilized, 40% engagement growth' },
                { year: 2024, title: 'Full-Stack Intern, Optimus Expert',  detail: 'Shipped AI automation — 1,000+ users, 99.8% uptime' },
                { year: 2023, title: 'Blockchain Engineer, Metacrafters',  detail: '500+ transactions deployed, Solidity certified' },
                { year: 2022, title: 'Started @ Chandigarh University',    detail: 'CGPA 7.2 — Smart India Hackathon finalist' },
            ],
            content: {
                doctrines: [
                    { number: 1, text: 'Ship fast, measure, iterate.' },
                    { number: 2, text: 'Code is communication.' },
                    { number: 3, text: 'Every system must fail gracefully.' },
                    { number: 4, text: 'AI is tooling, not magic.' },
                    { number: 5, text: 'Constraints breed creativity.' },
                    { number: 6, text: 'Open source > résumé bullets.' },
                ],
            },
        };
    }

    renderContent() {
        // ── Skills grid ─────────────────────────────────────────────
        const proofGrid = UISystem.querySelector('#proof-grid');
        if (proofGrid && this.data.skills) {
            this.data.skills.forEach(skill => {
                const card = UISystem.createElement('div', 'skill-vault metal-panel');
                card.innerHTML = `
                    <div class="skill-icon">${skill.icon}</div>
                    <h3>${skill.title}</h3>
                    <p class="text-muted">${skill.description}</p>
                    <div class="skill-tags">
                        ${skill.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
                    </div>`;
                proofGrid.appendChild(card);
            });
        }

        // ── Projects (horizontal scroll track) ──────────────────────
        const opsContainer = UISystem.querySelector('#h-scroll-track');
        if (opsContainer && this.data.projects) {
            this.data.projects.forEach(project => {
                const card = UISystem.createElement('div', 'operation-card metal-panel');
                card.innerHTML = `
                    <div class="operation-icon">${project.icon}</div>
                    <div class="operation-content">
                        <h3>${project.title}</h3>
                        <div class="operation-problem">
                            <strong>Problem:</strong> ${project.problem}
                        </div>
                        <div class="operation-impact">
                            ${project.impact.map(m => `
                                <div class="impact-item">
                                    <div class="impact-value">${m.value}</div>
                                    <div class="impact-label">${m.label}</div>
                                </div>`).join('')}
                        </div>
                        <div class="operation-stack">
                            ${project.stack.map(t => `<span class="stack-badge">${t}</span>`).join('')}
                        </div>
                    </div>`;
                opsContainer.appendChild(card);
            });

            // Progress dots
            const dotsContainer = document.querySelector('.h-scroll-progress');
            if (dotsContainer) {
                this.data.projects.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.className = 'h-scroll-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', `Project ${i + 1}`);
                    dotsContainer.appendChild(dot);
                });
            }
        }

        // ── Doctrines ───────────────────────────────────────────────
        const doctrineGrid = UISystem.querySelector('#doctrine-grid');
        if (doctrineGrid && this.data.content?.doctrines) {
            this.data.content.doctrines.forEach(d => {
                const card = UISystem.createElement('div', 'doctrine-card metal-panel');
                card.innerHTML = `
                    <div class="doctrine-number">${d.number}</div>
                    <p class="doctrine-text">${d.text}</p>`;
                doctrineGrid.appendChild(card);
            });
        }

        // ── Timeline ─────────────────────────────────────────────────
        const tlContainer = UISystem.querySelector('#timeline-container');
        if (tlContainer && this.data.timeline) {
            this.data.timeline.forEach((item, idx) => {
                const el = UISystem.createElement('div', 'timeline-item');
                el.innerHTML = `
                    <div class="timeline-dot" aria-hidden="true"></div>
                    <div class="timeline-body metal-panel">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-detail text-muted">${item.detail}</div>
                    </div>`;
                tlContainer.appendChild(el);
            });

            // Set SVG timeline line path height after render
            requestAnimationFrame(() => {
                const svg  = document.querySelector('.timeline-svg');
                const line = document.querySelector('.timeline-svg-line');
                if (svg && line && tlContainer) {
                    const h = tlContainer.offsetHeight;
                    svg.setAttribute('height', h);
                    line.setAttribute('d', `M1 0 L1 ${h}`);
                }
            });
        }

        // Dispatch event so tilt can attach to dynamically added cards
        document.dispatchEvent(new CustomEvent('content-rendered'));
    }

    runBootSequence() {
        const bootEl   = document.getElementById('boot-sequence');
        const progress = document.getElementById('boot-progress-fill');
        const percent  = document.getElementById('boot-percent');
        const status   = document.getElementById('boot-status');

        const statuses = [
            'INITIALIZING CORE',
            'LOADING 3D ENGINE',
            'COMPILING SHADERS',
            'MOUNTING SUBSYSTEMS',
            'ACTIVATING IDENTITY',
            'SYSTEM ONLINE',
        ];

        const total   = CONFIG.ANIMATION.BOOT_DURATION;
        const start   = performance.now();
        let statusIdx = 0;

        const tick = (now) => {
            const elapsed = now - start;
            const pct     = Math.min(elapsed / total, 1);
            const display = Math.floor(pct * 100);

            if (progress) progress.style.width = display + '%';
            if (percent)  percent.textContent  = display + '%';

            const sIdx = Math.floor(pct * (statuses.length - 1));
            if (sIdx !== statusIdx) {
                statusIdx = sIdx;
                if (status) status.textContent = statuses[sIdx];
            }

            if (pct < 1) {
                requestAnimationFrame(tick);
            } else {
                // Final reveal
                if (status)   status.textContent   = 'SYSTEM ONLINE ✓';
                if (percent)  percent.textContent  = '100%';

                setTimeout(() => {
                    if (bootEl) bootEl.classList.add('hidden');
                    document.body.classList.remove('boot-mode');
                    document.body.classList.add('ready');
                    this.isReady = true;
                    console.log('[SYSTEM] Online. Ready for interaction.');
                }, 300);
            }
        };

        requestAnimationFrame(tick);
    }
}

// ── Boot ───────────────────────────────────────────────────────────────────
const app = new KaushalPortfolio();
document.addEventListener('DOMContentLoaded', () => app.init());


