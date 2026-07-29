/* Service worker for shameekyogi.github.io
 *
 * Bump VERSION on any deploy that changes a precached asset — the activate
 * handler drops every cache that doesn't carry the current version, so stale
 * shells can't survive an update.
 */
const VERSION = 'v2';
const SHELL   = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './photo-hero.webp',
  './photo-about.webp',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './favicon-16.png',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL)
      /* addAll is atomic — one 404 would reject the whole install and leave the
         worker unregistered, so add individually and tolerate misses. */
      .then(cache => Promise.all(
        PRECACHE.map(url => cache.add(url).catch(() => {}))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

const isFontHost = url =>
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Navigations: network first, so a redeploy is picked up immediately, with
     the cached shell as the offline fallback. */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  /* Google Fonts: cache first. These are immutable and versioned by URL, and
     caching them is what lets the page render correctly offline. */
  if (isFontHost(url)) {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(RUNTIME).then(c => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  /* Same-origin assets: serve from cache, refresh in the background. */
  event.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
