(function () {
  if (window.__omPwaV31) return;
  window.__omPwaV31 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var reg, deferred, refreshing = false;
  function reloadFresh() {
    // Unique navigation bypasses a stale HTTP cache, without losing search or anchor.
    var url = new URL(window.location.href);
    url.searchParams.set('om-refresh', Date.now().toString());
    window.location.replace(url.toString());
  }
  window.OMUpdateSite = function () {
    if (refreshing) return;
    refreshing = true;
    var done = false;
    function finish() { if (!done) { done = true; reloadFresh(); } }
    if (!reg) { finish(); return; }
    // An old version may already be waiting. Don't block the user if offline.
    navigator.serviceWorker.addEventListener('controllerchange', finish, { once: true });
    var timeout = setTimeout(finish, 2500);
    reg.update().catch(function () {}).then(function () {
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      else { clearTimeout(timeout); finish(); }
    });
  };
  function notify() {
    if (!window.OMToast) return;
    window.OMToast.show({ id: 'site-update', kind: 'info', title: lang === 'ru' ? 'Доступно обновление' : 'Update available', body: lang === 'ru' ? 'Новая версия сайта готова.' : 'A new site version is ready.', timeout: 0,
      actions: [{ label: lang === 'ru' ? 'Обновить' : 'Refresh', primary: true, onClick: window.OMUpdateSite }] });
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(root + 'sw.js', { scope: root || './', updateViaCache: 'none' }).then(function (registration) {
        reg = registration;
        if (reg.waiting && navigator.serviceWorker.controller) notify();
        reg.addEventListener('updatefound', function () {
          var worker = reg.installing;
          if (worker) worker.addEventListener('statechange', function () {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) notify();
          });
        });
        reg.update().catch(function () {});
      }).catch(function () {});
    });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && reg) reg.update().catch(function () {}); });
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'om-install-btn';
    btn.textContent = lang === 'ru' ? 'Установить' : 'Install';
    btn.addEventListener('click', function () { if (deferred) deferred.prompt(); });
    var actions = document.querySelector('.header-actions'); if (actions && window.innerWidth > 900) actions.appendChild(btn);
  });
})();
