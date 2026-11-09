(function () {
  if (window.__omPwaV17) return;
  window.__omPwaV17 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var deferred = null;
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(root + 'sw.js', { scope: root || './' }).then(function (reg) {
        reg.addEventListener('updatefound', function () {
          var sw = reg.installing;
          if (!sw) return;
          sw.addEventListener('statechange', function () {
            if (sw.state === 'installed' && navigator.serviceWorker.controller && window.OMToast) {
              window.OMToast.show({ kind: 'info', title: lang === 'ru' ? 'Доступно обновление' : 'Update available', body: lang === 'ru' ? 'Новая версия сайта готова.' : 'A new site version is ready.', timeout: 0, actions: [{ label: lang === 'ru' ? 'Обновить' : 'Refresh', primary: true, onClick: function () { location.reload(); } }] });
            }
          });
        });
      }).catch(function () {});
    });
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'om-install-btn';
    btn.textContent = lang === 'ru' ? 'Установить' : 'Install';
    btn.addEventListener('click', function () { if (deferred) deferred.prompt(); });
    var actions = document.querySelector('.header-actions');
    if (actions && window.innerWidth > 900) actions.appendChild(btn);
  });
})();
