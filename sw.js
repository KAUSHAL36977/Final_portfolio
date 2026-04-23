// ===== SW.JS =====
// Service Worker — offline-first caching strategy.

const CACHE_NAME   = 'kk-vault-v1';
const STATIC_CACHE = 'kk-static-v1';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/css/00-reset.css',
    '/css/01-variables.css',
    '/css/02-darkness.css',
    '/css/03-metals.css',
    '/css/04-typography.css',
    '/css/05-layout.css',
    '/css/06-components.css',
    '/css/07-3d-elements.css',
    '/css/08-animations.css',
    '/css/09-responsive.css',
    '/css/10-cursor.css',
    '/css/11-nav.css',
    '/css/12-advanced.css',
    '/js/config.js',
    '/js/ui-system.js',
    '/js/input.js',
    '/js/animations.js',
    '/js/core.js',
    '/js/main.js',
    '/js/nav.js',
    '/js/cursor.js',
    '/js/grain.js',
    '/js/spotlight.js',
    '/js/tilt.js',
    '/js/kinetic-text.js',
    '/js/counters.js',
    '/js/scroll-stories.js',
    '/js/theme.js',
    '/js/konami.js',
    '/js/constellation.js',
    '/js/github-activity.js',
    '/js/scroll-depth.js',
    '/js/three-objects.js',
    '/js/three-world.js',
    '/js/three-interactions.js',
    '/data/projects.json',
    '/data/skills.json',
    '/data/timeline.json',
    '/data/content.json',
];

// ── Install: pre-cache static shell ──────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ── Activate: purge stale caches ─────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: stale-while-revalidate for static, network-first for API ──────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and cross-origin requests (Three.js CDN etc.)
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    // GitHub API — network only (live data)
    if (url.hostname === 'api.github.com') return;

    event.respondWith(
        caches.open(STATIC_CACHE).then(async (cache) => {
            const cached = await cache.match(request);

            const fetchPromise = fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        cache.put(request, response.clone());
                    }
                    return response;
                })
                .catch(() => null);

            return cached || fetchPromise;
        })
    );
});
