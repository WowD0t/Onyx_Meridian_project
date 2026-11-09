/* Bump this cache name and the asset version for each release. */
const CACHE = 'om-site-v32';
const CORE = ['./', './ru-index.html', './en-index.html', './offline.html',
  './assets-css-style.css?v=32', './assets-css-legacy.css?v=32',
  './assets-js-app.js?v=32', './assets-js-settings.js?v=32', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
function cleanOldCaches() {
  return caches.keys().then(keys => Promise.all(keys.filter(key =>
    key !== CACHE && (key.startsWith('om-v') || key.startsWith('om-site-'))
  ).map(key => caches.delete(key))));
}
self.addEventListener('activate', event => {
  event.waitUntil(cleanOldCaches().then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'CLEAN_OLD_CACHES') event.waitUntil(cleanOldCaches());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  const scope = new URL(self.registration.scope);
  if (req.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if (/\.mcaddon$/i.test(url.pathname)) return;
  // A previous worker may finish a request after activation and recreate its cache.
  if (req.mode === 'navigate') event.waitUntil(cleanOldCaches());
  const networkOnly = url.searchParams.has('om-online-check');
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cacheUrl = new URL(req.url);
    cacheUrl.searchParams.delete('om-refresh');
    cacheUrl.searchParams.delete('ts');
    try {
      const response = await fetch(req, { cache: 'no-store' });
      if (!networkOnly && response.ok && response.type === 'basic' && response.status !== 206) {
        await cache.put(cacheUrl.toString(), response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (networkOnly) return Response.error();
      // Never serve a different version of a stylesheet or script as a substitute.
      const cached = await cache.match(cacheUrl.toString(), { ignoreSearch: req.mode === 'navigate' });
      if (cached) return cached;
      if (req.mode === 'navigate') return (await cache.match('./offline.html')) || Response.error();
      return Response.error();
    }
  })());
});
