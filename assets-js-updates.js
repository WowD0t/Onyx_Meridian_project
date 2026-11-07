(function () {
  if (window.__omUpdates) return;
  window.__omUpdates = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var root = document.documentElement.getAttribute('data-root') || '';
  var T = lang === 'ru' ? { enabled: 'Уведомления об обновлениях включены.', denied: 'Уведомления запрещены в настройках браузера.', unsupported: 'Уведомления не поддерживаются этим браузером.', title: 'Onyx Meridian: обновление' } : { enabled: 'Update alerts enabled.', denied: 'Notifications are blocked in browser settings.', unsupported: 'Notifications are not supported by this browser.', title: 'Onyx Meridian update' };
  function toast(msg) { var t = document.getElementById('toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2200); }
  function enable() {
    if (!('Notification' in window)) { toast(T.unsupported); return; }
    Notification.requestPermission().then(function (p) {
      if (p === 'granted') { try { localStorage.setItem('om-updates-alerts', '1'); } catch (e) {} toast(T.enabled); check(true); }
      else toast(T.denied);
    });
  }
  function check(force) {
    var on = false;
    try { on = localStorage.getItem('om-updates-alerts') === '1'; } catch (e) {}
    if (!on && !force) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    fetch(root + 'updates.json', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }).then(function (j) {
      var latest = j && j.items && j.items[0];
      if (!latest) return;
      var seen = null;
      try { seen = localStorage.getItem('om-updates-seen'); } catch (e) {}
      if (seen === latest.id) return;
      try { localStorage.setItem('om-updates-seen', latest.id); } catch (e) {}
      var brand = document.querySelector('.brand-mark');
      if (seen !== null) new Notification(T.title, { body: lang === 'ru' ? latest.title_ru : latest.title_en, icon: brand ? brand.src : undefined });
    }).catch(function () {});
  }
  window.OMUpdates = { enable: enable, check: check };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { check(false); });
  else check(false);
})();
