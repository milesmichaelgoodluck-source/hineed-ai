/* Hineed.AI service worker — installable PWA with safe caching.
   Strategy:
   - HTML / navigations: network-first (so new deploys show immediately), cache fallback when offline.
   - API calls (/api/*): network-only, never cached (always fresh orders/rides/data).
   - Static assets (icons, images, fonts, css, js): stale-while-revalidate for instant loads.
*/
const VERSION = 'hineed-v3';
const SHELL = VERSION + '-shell';
const ASSETS = VERSION + '-assets';
const APP_SHELL = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/mark.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(APP_SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never touch API or cross-origin POST-like data — always network.
  if (url.pathname.startsWith('/api/')) return;

  const isNav = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  // HTML / navigation: network-first, fall back to cached shell offline.
  if (isNav && url.origin === location.origin) {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const copy = net.clone();
        caches.open(SHELL).then((c) => c.put('/index.html', copy)).catch(() => {});
        return net;
      } catch {
        return (await caches.match('/index.html')) || (await caches.match('/')) ||
          new Response('Offline', { status: 503, headers: { 'content-type': 'text/plain' } });
      }
    })());
    return;
  }

  // Static assets: stale-while-revalidate.
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        const copy = res.clone();
        caches.open(ASSETS).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => null);
    return cached || (await network) ||
      new Response('', { status: 504 });
  })());
});
