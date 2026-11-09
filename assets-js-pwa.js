(function () {
  if (window.__omPwaV32) return;
  window.__omPwaV32 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var reg, deferred, refreshing = false;
  function reloadFresh() {
    var url = new URL(window.location.href);
    url.searchParams.set('om-refresh', Date.now().toString());
    window.location.replace(url.toString());
  }
  function failure() {
    refreshing = false;
    if (window.OMToast) window.OMToast.show({ kind: 'warning', title: lang === 'ru' ? 'Не удалось обновить сайт' : 'Could not update the site', body: lang === 'ru' ? 'Проверьте соединение и попробуйте снова. Сохранённая версия остаётся доступной.' : 'Check your connection and try again. Your saved version remains available.' });
  }
  window.OMUpdateSite = function () {
    if (refreshing) return;
    if (navigator.onLine === false) { failure(); return; }
    refreshing = true;
    // Do not discard the offline copy or reload until a network response is available.
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 10000) : null;
    fetch(root + 'build.json?om-online-check=1&ts=' + Date.now(), { cache: 'no-store', signal: controller ? controller.signal : undefined }).then(function (r) {
      if (timeout) clearTimeout(timeout);
      if (!r.ok) throw new Error('Network check failed');
      return r.json();
    }).then(function (build) {
      if (!build || !build.version) throw new Error('Invalid build');
      if (!reg || !navigator.serviceWorker) { reloadFresh(); return; }
      return reg.update().then(function () {
        var worker = reg.waiting || reg.installing;
        if (!worker) { reloadFresh(); return; }
        return new Promise(function (resolve, reject) {
          var finished = false;
          var timer = setTimeout(function () { finish(false); }, 12000);
          function finish(ok) {
            if (finished) return; finished = true; clearTimeout(timer);
            navigator.serviceWorker.removeEventListener('controllerchange', changed);
            worker.removeEventListener('statechange', stateChanged);
            if (ok) resolve(); else reject(new Error('Update did not activate'));
          }
          function changed() { finish(true); }
          function stateChanged() {
            if (worker.state === 'installed') worker.postMessage({ type: 'SKIP_WAITING' });
            if (worker.state === 'activated' && navigator.serviceWorker.controller === worker) finish(true);
            if (worker.state === 'redundant') finish(false);
          }
          navigator.serviceWorker.addEventListener('controllerchange', changed);
          worker.addEventListener('statechange', stateChanged);
          stateChanged();
        }).then(reloadFresh);
      });
    }).catch(function () { if (timeout) clearTimeout(timeout); failure(); });
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
        // Give in-flight requests from the previous worker time to settle.
        setTimeout(function () { if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: 'CLEAN_OLD_CACHES' }); }, 3000);
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
