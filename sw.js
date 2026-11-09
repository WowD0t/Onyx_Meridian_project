/* Increment this version whenever site assets change. */
const CACHE = 'om-site-v31';
const CORE = ['./', './ru-index.html', './en-index.html', './offline.html',
  './assets-css-style.css?v=31', './assets-css-legacy.css?v=31',
  './assets-js-app.js?v=31', './assets-js-settings.js?v=31', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key =>
    key !== CACHE && (key.startsWith('om-v') || key.startsWith('om-site-'))
  ).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  const scope = new URL(self.registration.scope);
  if (req.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  // Downloads must not be cached or counted as successful by the worker.
  if (/\.mcaddon$/i.test(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cacheUrl = new URL(req.url);
    cacheUrl.searchParams.delete('om-refresh');
    cacheUrl.searchParams.delete('ts');
    const cacheKey = cacheUrl.toString();
    try {
      const response = await fetch(req, { cache: 'no-store' });
      if (response.ok && response.type === 'basic') {
        await cache.put(cacheKey, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await cache.match(cacheKey, { ignoreSearch: true });
      if (cached) return cached;
      if (req.mode === 'navigate') return (await cache.match('./offline.html')) || Response.error();
      return Response.error();
    }
  })());
});
