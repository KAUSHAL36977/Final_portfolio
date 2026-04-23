// ===== GITHUB-ACTIVITY.JS =====
// Real-time GitHub contribution heatmap and recent commit feed.

class GitHubActivity {
    constructor() {
        this.username = 'KAUSHAL36977';
    }

    async init() {
        const container = document.getElementById('github-activity');
        if (!container) return;

        try {
            const events = await this._fetch();
            this._renderCommits(container, events);
            this._renderHeatmap(container, events);
        } catch (err) {
            console.warn('[GITHUB]', err.message);
            this._renderFallback(container);
        }
    }

    async _fetch() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}/events?per_page=30`,
            { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json();
    }

    _renderCommits(container, events) {
        const panel = container.querySelector('.github-commits');
        if (!panel) return;

        const commits = events
            .filter(e => e.type === 'PushEvent' || e.type === 'CreateEvent')
            .slice(0, 5)
            .map(e => ({
                repo: e.repo.name.split('/')[1] || e.repo.name,
                time: new Date(e.created_at),
                msg:  e.type === 'PushEvent'
                    ? (e.payload.commits?.[0]?.message || 'Update').split('\n')[0]
                    : `Created ${e.payload.ref_type || 'branch'}`,
            }));

        if (!commits.length) {
            panel.innerHTML = '<p class="text-muted" style="font-size:12px">No recent push activity.</p>';
            return;
        }

        panel.innerHTML = commits.map((c, i) => `
            <div class="github-commit" style="--delay:${i * 0.1}s">
                <span class="commit-dot" aria-hidden="true">◆</span>
                <div class="commit-info">
                    <span class="commit-repo">${this._esc(c.repo)}</span>
                    <span class="commit-msg">${this._esc(c.msg.slice(0, 60))}${c.msg.length > 60 ? '…' : ''}</span>
                </div>
                <span class="commit-time">${this._ago(c.time)}</span>
            </div>`).join('');
    }

    _renderHeatmap(container, events) {
        const heatmap = container.querySelector('.github-heatmap');
        if (!heatmap) return;

        const map = new Map();
        events.forEach(e => {
            const d = new Date(e.created_at).toDateString();
            map.set(d, (map.get(d) || 0) + 1);
        });

        const cells = [];
        const now   = new Date();
        for (let i = 51; i >= 0; i--) {
            const d   = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toDateString();
            cells.push({ key, count: map.get(key) || 0 });
        }

        heatmap.innerHTML = cells.map((c, i) => `
            <div class="heatmap-cell level-${Math.min(c.count, 4)}"
                 title="${this._esc(c.key)}: ${c.count} event${c.count !== 1 ? 's' : ''}"
                 role="img"
                 aria-label="${this._esc(c.key)}: ${c.count} events"
                 style="--i:${i}">
            </div>`).join('');

        // Stagger reveal via GSAP if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.from('.heatmap-cell', {
                scale: 0, opacity: 0, stagger: 0.018, duration: 0.25,
                ease: 'back.out(1.5)',
                scrollTrigger: { trigger: heatmap, start: 'top 82%', once: true },
            });
        }
    }

    _renderFallback(container) {
        container.innerHTML = `
            <p class="text-muted text-mono" style="font-size:11px;letter-spacing:0.06em">
                // Live activity at
                <a href="https://github.com/${this.username}"
                   target="_blank" rel="noopener noreferrer"
                   style="color:var(--color-cyan)">github.com/${this.username}</a>
            </p>`;
    }

    _ago(date) {
        const s = Math.floor((Date.now() - date) / 1000);
        if (s < 60)    return 'just now';
        if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    }

    _esc(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
}

const gitHubActivity = new GitHubActivity();
