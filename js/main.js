// ===== MAIN.JS =====
// APP INITIALIZATION. BOOT SEQUENCE. ORCHESTRATION.

class KaushalPortfolio {
    constructor() {
        this.isReady = false;
        this.bootSequence = UISystem.querySelector('#boot-sequence');
    }
    
    async init() {
        console.log('[SYSTEM] Initializing Kaushal Vault...');
        
        // LOAD DATA
        await this.loadData();
        
        // INITIALIZE SUBSYSTEMS
        inputTracker.init();
        scrollDepth.init();
        appCore.init();
        
        // Initialize 3D world
        if (typeof THREE !== 'undefined') {
            threeWorld.init();
            
            // Initialize 3D interactions
            threeInteractions = new ThreeInteractions(threeWorld);
            threeInteractions.init();
        } else {
            console.warn('[SYSTEM] Three.js not loaded. 3D features disabled.');
        }
        
        // Initialize animations if GSAP is available
        if (typeof gsap !== 'undefined') {
            animationEngine.init();
        } else {
            console.warn('[SYSTEM] GSAP not loaded. Animation features limited.');
        }
        
        UISystem.setupNavigation();
        
        // SETUP UI
        this.renderContent();
        
        // BOOT ANIMATION
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
                skills: skills.skills || skills, 
                timeline: timeline.timeline || timeline, 
                content: content 
            };
        } catch (e) {
            console.warn('[SYSTEM] Data files not found. Using fallback data.');
            this.data = this.getFallbackData();
        }
    }
    
    getFallbackData() {
        return {
            projects: [
                {
                    title: 'Autonomous Ground Vehicle (AGV)',
                    icon: '🤖',
                    problem: 'Build an AI-driven rover for autonomous navigation.',
                    impact: [
                        { value: '0.5m', label: 'Precision' },
                        { value: '92%', label: 'Accuracy' },
                        { value: '<200ms', label: 'Response' },
                    ],
                    stack: ['Python', 'OpenCV', 'TensorFlow', 'SLAM', 'Arduino'],
                },
                {
                    title: 'BOMANI: Livestock Intelligence',
                    icon: '🐄',
                    problem: 'Help 10M+ Indian farmers identify cattle breeds at scale.',
                    impact: [
                        { value: '10M+', label: 'Users' },
                        { value: '92%', label: 'Accuracy' },
                        { value: 'Real-Time', label: 'Processing' },
                    ],
                    stack: ['React Native', 'TensorFlow Lite', 'Node.js', 'MongoDB', 'Firebase'],
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
                    description: 'Shipped email automation with 89% accuracy. Computer vision pipeline.',
                    tags: ['TensorFlow', 'OpenAI APIs', 'NLP', 'Computer Vision'],
                },
                {
                    title: 'Blockchain & Web3',
                    icon: '🔗',
                    description: 'Deployed smart contracts on Ethereum/Polygon. Built dApps.',
                    tags: ['Solidity', 'Web3.js', 'Ethereum', 'Polygon'],
                },
            ],
            timeline: [
                { year: 2025, title: 'Campus Ambassador, Internshala', detail: '500+ students, 40% engagement growth' },
                { year: 2024, title: 'Full-Stack Intern, Optimus Expert', detail: '1,000+ users, 99.8% uptime' },
                { year: 2023, title: 'Blockchain Engineer, Metacrafters', detail: '500+ transactions, certified' },
                { year: 2022, title: 'Started @ Chandigarh University', detail: 'CGPA 7.2, Smart India Hackathon' },
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
        // SKILLS
        const proofGrid = UISystem.querySelector('#proof-grid');
        if (proofGrid && this.data.skills) {
            this.data.skills.forEach((skill) => {
                const card = UISystem.createElement('div', 'skill-vault metal-panel');
                card.innerHTML = `
                    <div class="skill-icon">${skill.icon}</div>
                    <h3>${skill.title}</h3>
                    <p class="text-muted">${skill.description}</p>
                    <div class="skill-tags">
                        ${skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                    </div>
                `;
                proofGrid.appendChild(card);
            });
        }
        
        // PROJECTS
        const opsContainer = UISystem.querySelector('#operations-container');
        if (opsContainer && this.data.projects) {
            this.data.projects.forEach((project) => {
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
                                </div>
                            `).join('')}
                        </div>
                        <div class="operation-stack">
                            ${project.stack.map(tech => `<span class="stack-badge">${tech}</span>`).join('')}
                        </div>
                    </div>
                `;
                opsContainer.appendChild(card);
            });
        }
        
        // DOCTRINES
        const doctrineGrid = UISystem.querySelector('#doctrine-grid');
        if (doctrineGrid && this.data.content && this.data.content.doctrines) {
            this.data.content.doctrines.forEach((doctrine) => {
                const card = UISystem.createElement('div', 'doctrine-card metal-panel');
                card.innerHTML = `
                    <div class="doctrine-number">${doctrine.number}</div>
                    <p class="doctrine-text">${doctrine.text}</p>
                `;
                doctrineGrid.appendChild(card);
            });
        }
        
        // TIMELINE
        const timelineContainer = UISystem.querySelector('#timeline-container');
        if (timelineContainer && this.data.timeline) {
            this.data.timeline.forEach((item, idx) => {
                const timelineItem = UISystem.createElement('div', 'timeline-item');
                timelineItem.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-body metal-panel">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-detail text-muted">${item.detail}</div>
                    </div>
                `;
                timelineContainer.appendChild(timelineItem);
            });
        }
    }
    
    runBootSequence() {
        console.log('[SYSTEM] Boot sequence initiated...');
        
        setTimeout(() => {
            if (this.bootSequence) {
                this.bootSequence.classList.add('hidden');
            }
            document.body.classList.remove('boot-mode');
            document.body.classList.add('ready');
            this.isReady = true;
            console.log('[SYSTEM] System online. Ready for interaction.');
        }, CONFIG.ANIMATION.BOOT_DURATION);
    }
}

// ===== APP INITIALIZATION =====
const app = new KaushalPortfolio();
document.addEventListener('DOMContentLoaded', () => app.init());

