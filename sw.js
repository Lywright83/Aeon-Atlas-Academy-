// ============================================================
// AEON Service Worker — Aegis Atlas Academy PWA
// Cache Strategy: Cache-First for assets, Network-First for API
// ============================================================

const CACHE_NAME = 'aeon-v1';
const STATIC_CACHE = 'aeon-static-v1';
const DYNAMIC_CACHE = 'aeon-dynamic-v1';

// Core shell assets — always cached on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Google Fonts (pre-cache critical fonts)
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap',
  // Font Awesome
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ── INSTALL ──────────────────────────────────────────────────
// Pre-cache all static shell assets
self.addEventListener('install', event => {
  console.log('[AEON SW] Installing — caching static shell');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()) // Activate immediately, don't wait
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
// Clean up old caches when a new SW takes over
self.addEventListener('activate', event => {
  console.log('[AEON SW] Activating — purging old caches');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => {
            console.log('[AEON SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});

// ── FETCH ─────────────────────────────────────────────────────
// Routing strategy:
//   - HTML pages:        Network-first → fallback to cache
//   - Static assets:     Cache-first → fallback to network
//   - External CDN:      Cache-first → fallback to network
//   - API calls:         Network-only (never cache live data)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser-extension and chrome-extension requests
  if (!url.protocol.startsWith('http')) return;

  // API calls — always hit the network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // HTML navigation — Network-first
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else — Cache-first
  event.respondWith(cacheFirst(request));
});

// ── STRATEGIES ───────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[AEON SW] Cache-first fetch failed:', request.url);
    return offlineFallback(request);
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[AEON SW] Network-first fell back to cache:', request.url);
    const cached = await caches.match(request);
    return cached || offlineFallback(request);
  }
}

// Offline fallback — serve the cached index.html shell
async function offlineFallback(request) {
  const cached = await caches.match('/index.html');
  return cached || new Response(
    `<!DOCTYPE html>
    <html>
      <head><title>AEON — Offline</title>
      <style>
        body { background: #0a0a1a; color: #a0a0d0; font-family: 'Inter', sans-serif;
               display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .offline { text-align: center; }
        h1 { color: #6c63ff; font-size: 2rem; }
        p { opacity: 0.7; }
      </style>
      </head>
      <body>
        <div class="offline">
          <h1>⚡ AEON</h1>
          <p>You are offline. Connect to resume your mission.</p>
        </div>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

// ── BACKGROUND SYNC ──────────────────────────────────────────
// Queue XP/progress updates when offline, sync when back online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    console.log('[AEON SW] Background sync: syncing offline progress');
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  // Retrieve queued progress from IndexedDB and POST to server
  // Implement with your backend endpoint when ready
  console.log('[AEON SW] Progress sync complete');
}

// ── PUSH NOTIFICATIONS ───────────────────────────────────────
// Streak reminders, new module alerts, XP milestones
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {
    title: 'AEON',
    body: 'Your AI agents are standing by.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: 'Open AEON' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});
