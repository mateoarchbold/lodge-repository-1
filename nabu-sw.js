// Nabu background script (service worker).
//
// What it does:
// - Keeps a copy of the app's own files on the device so the installed
//   app can open with no signal.
// - "Network first": when online, every app file is fetched fresh from
//   the website (so updates always arrive right away); the saved copy is
//   only used when the network fails.
// - Never touches account data requests (Supabase) - those always go
//   straight to the network.
//
// Bump CACHE_VERSION to force every device to drop its old copy.
const CACHE_VERSION = 'nabu-v2';

const APP_SHELL = [
    'index15budgetingapphtml.html',
    'index15budgetingappcss.css',
    'index15budgetingappjs.js',
    'nabu-favicon.svg',
    'nabu-manifest.webmanifest',
    'nabu-icon-180.png',
    'nabu-icon-192.png',
    'nabu-icon-512.png',
    'nabu-icon-maskable-512.png',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Files (by path) this worker manages; everything else on the site is
// left completely alone.
const APP_PATHS = new Set(APP_SHELL.filter(u => !u.startsWith('http')).map(u => new URL(u, self.registration.scope).pathname));

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => Promise.allSettled(APP_SHELL.map(u => cache.add(new Request(u, { cache: 'reload' })))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k.startsWith('nabu-') && k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

function isHandled(url) {
    if (url.origin === self.location.origin) return APP_PATHS.has(url.pathname);
    if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@supabase/supabase-js')) return true;
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return true;
    return false; // Supabase API, Dropbox, etc. - straight to the network
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (!isHandled(url)) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_VERSION);
        try {
            // Network first, skipping the browser's own HTTP cache so a new
            // version is picked up immediately.
            // (fetching by URL, since a page-navigation request can't be
            // re-sent with extra options)
            const fresh = await fetch(req.url, { cache: 'no-store' });
            if (fresh && (fresh.ok || fresh.type === 'opaque')) {
                cache.put(req, fresh.clone());
                // Also file it without the ?v= query so the offline lookup
                // below finds it whatever version string the page asks for.
                if (url.search && url.origin === self.location.origin) cache.put(url.origin + url.pathname, fresh.clone());
            }
            return fresh;
        } catch (err) {
            const saved = await cache.match(req) || await cache.match(req, { ignoreSearch: true });
            if (saved) return saved;
            throw err;
        }
    })());
});

// ---- Reminders (push notifications) ----
self.addEventListener('push', (event) => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data && event.data.text() }; }
    const title = data.title || 'Nabu';
    event.waitUntil(self.registration.showNotification(title, {
        body: data.body || '',
        icon: 'nabu-icon-192.png',
        badge: 'nabu-icon-192.png',
        tag: data.tag || undefined,
        renotify: !!data.tag,
        requireInteraction: false,
        data: { url: data.url || 'index15budgetingapphtml.html' }
    }));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const target = (event.notification.data && event.notification.data.url) || 'index15budgetingapphtml.html';
    event.waitUntil((async () => {
        const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const open = all.find(c => c.url.includes('index15budgetingapphtml'));
        if (open) return open.focus();
        return self.clients.openWindow(target);
    })());
});
