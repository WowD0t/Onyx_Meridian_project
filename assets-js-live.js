(function () {
  if (window.__omLiveV15) return;
  window.__omLiveV15 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? { update: 'Доступно обновление сайта', refresh: 'Обновить', offline: 'Нет соединения', online: 'Соединение восстановлено' } : { update: 'A site update is available', refresh: 'Refresh', offline: 'You are offline', online: 'Back online' };
  var bar = document.createElement('div');
  bar.className = 'om-loadbar';
  document.body.appendChild(bar);
  var navTimer = null;
  function start() { bar.classList.remove('done'); bar.style.width = '38%'; clearTimeout(navTimer); navTimer = setTimeout(function () { bar.style.width = '72%'; }, 240); }
  function done() { clearTimeout(navTimer); bar.style.width = '100%'; setTimeout(function () { bar.classList.add('done'); setTimeout(function () { bar.style.width = '0'; }, 320); }, 160); }
  window.addEventListener('pageshow', done);
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href') || '';
    if (/^(https?:)?\/\//.test(href) || /^(mailto|tel|data|javascript):/.test(href) || href.charAt(0) === '#') return;
    start();
  });
  var prefetched = {};
  function prefetch(href) {
    if (!href || prefetched[href]) return;
    if (/^(https?:)?\/\//.test(href) || /^(mailto|tel|data|javascript):/.test(href) || href.charAt(0) === '#') return;
    if (!/\.html($|\?)/.test(href)) return;
    prefetched[href] = true;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = href; document.head.appendChild(l);
  }
  document.addEventListener('pointerenter', function (e) { var a = e.target.closest ? e.target.closest('a[href]') : null; if (a) prefetch(a.getAttribute('href')); }, true);
  document.addEventListener('focusin', function (e) { var a = e.target.closest ? e.target.closest('a[href]') : null; if (a) prefetch(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (!en.isIntersecting) return; io.unobserve(en.target); prefetch(en.target.getAttribute('href')); }); }, { rootMargin: '160px' });
    document.querySelectorAll('a[href$=".html"]').forEach(function (a) { io.observe(a); });
  }
  var build = document.documentElement.getAttribute('data-build') || null, updateShown = false;
  function checkBuild() {
    fetch(root + 'build.json?om-online-check=1&ts=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.version) return;
      if (build === null) { build = j.version; return; }
      if (j.version !== build && !updateShown) {
        updateShown = true;
        if (window.OMToast) window.OMToast.show({ id: 'site-update', title: T.update, body: j.version, timeout: 0, actions: [{ label: T.refresh, primary: true, onClick: function () { if (window.OMUpdateSite) window.OMUpdateSite(); else location.reload(); } }] });
      }
    }).catch(function () {});
  }
  checkBuild();
  setInterval(function () { if (!document.hidden) checkBuild(); }, 120000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checkBuild(); });
  window.addEventListener('offline', function () { if (window.OMToast) window.OMToast.show({ kind: 'warning', title: T.offline }); });
  window.addEventListener('online', function () { if (window.OMToast) window.OMToast.show({ kind: 'success', title: T.online }); if (window.OMDownloadsRefresh) window.OMDownloadsRefresh(); if (window.OMCFRefresh) window.OMCFRefresh(); });
  setInterval(function () { if (document.hidden) return; if (window.OMDownloadsRefresh) window.OMDownloadsRefresh(); if (window.OMCFRefresh) window.OMCFRefresh(); }, 300000);
})();
