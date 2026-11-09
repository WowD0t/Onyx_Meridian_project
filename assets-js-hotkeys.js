(function () {
  if (window.__omHotkeysV13) return;
  window.__omHotkeysV13 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? { title: 'Горячие клавиши', close: 'Закрыть', search: 'Поиск', menu: 'Меню сайта', settings: 'Настройки', theme: 'Тема', language: 'Язык', notifications: 'Уведомления', help: 'Эта справка', home: 'На главную', addons: 'Аддоны', wiki: 'Вики', roadmap: 'Планы', licence: 'Лицензия', support: 'Поддержка', verify: 'Проверка файла', sequence: 'Затем', tip: 'Клавиши работают независимо от раскладки клавиатуры.' } : { title: 'Keyboard shortcuts', close: 'Close', search: 'Search', menu: 'Site menu', settings: 'Settings', theme: 'Theme', language: 'Language', notifications: 'Notifications', help: 'This help', home: 'Home', addons: 'Add-ons', wiki: 'Wiki', roadmap: 'Roadmap', licence: 'Licence', support: 'Support', verify: 'Verify file', sequence: 'Then', tip: 'Shortcuts work regardless of keyboard layout.' };
  var overlay = document.createElement('div');
  overlay.className = 'om-hotkeys-overlay';
  overlay.hidden = true;
  var box = document.createElement('div');
  box.className = 'om-hotkeys';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', T.title);
  function row(keys, label) { return '<tr><td>' + label + '</td><td>' + keys + '</td></tr>'; }
  box.innerHTML = '<h2>' + T.title + '</h2><p class="om-settings-hint">' + T.tip + '</p><table>' +
    row('<kbd>Ctrl</kbd> <kbd>K</kbd> / <kbd>/</kbd>', T.search) +
    row('<kbd>M</kbd>', T.menu) +
    row('<kbd>S</kbd>', T.settings) +
    row('<kbd>T</kbd>', T.theme) +
    row('<kbd>L</kbd>', T.language) +
    row('<kbd>N</kbd>', T.notifications) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>H</kbd>', T.home) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>A</kbd>', T.addons) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>W</kbd>', T.wiki) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>R</kbd>', T.roadmap) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>L</kbd>', T.licence) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>S</kbd>', T.support) +
    row('<kbd>G</kbd> ' + T.sequence + ' <kbd>V</kbd>', T.verify) +
    row('<kbd>?</kbd>', T.help) +
    row('<kbd>Esc</kbd>', T.close) +
    '</table><div style="margin-top:16px;text-align:right"><button type="button" class="btn btn-ghost om-hotkeys-close">' + T.close + '</button></div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  var lastFocus = null;
  function open() { lastFocus = document.activeElement; overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('open'); }); box.querySelector('button').focus(); }
  function close() { overlay.classList.remove('open'); setTimeout(function () { overlay.hidden = true; }, 200); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  box.querySelector('.om-hotkeys-close').addEventListener('click', close);
  function typing(e) { var t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); }
  function nav(name) { var a = document.querySelector('.header-nav a[data-nav="' + name + '"]'); if (a) a.click(); }
  var seq = null;
  var seqTimer = null;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); return; }
    if (typing(e)) return;
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') { e.preventDefault(); var s = document.querySelector('[data-search-open]'); if (s) s.click(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'Slash' && !e.shiftKey) { e.preventDefault(); var s2 = document.querySelector('[data-search-open]'); if (s2) s2.click(); return; }
    if (e.code === 'Slash' && e.shiftKey) { e.preventDefault(); open(); return; }
    if (seq) {
      clearTimeout(seqTimer);
      var map = { KeyH: 'studio', KeyA: 'addons', KeyW: 'wiki', KeyR: 'roadmap', KeyL: 'licence', KeyS: 'support', KeyV: 'verify' };
      var target = map[e.code];
      seq = null;
      if (target) { e.preventDefault(); if (target === 'verify') { window.location.href = document.documentElement.getAttribute('data-verify-href') || 'verify.html'; } else nav(target); }
      return;
    }
    if (e.code === 'KeyG') { seq = true; seqTimer = setTimeout(function () { seq = null; }, 1200); return; }
    if (e.code === 'KeyM') { e.preventDefault(); if (window.OMMenu) window.OMMenu.open(); return; }
    if (e.code === 'KeyS') { e.preventDefault(); if (window.OMSettings) window.OMSettings.open(); return; }
    if (e.code === 'KeyT') { e.preventDefault(); var t = document.getElementById('theme-btn'); if (t) t.click(); return; }
    if (e.code === 'KeyL') { e.preventDefault(); if (window.OMLanguage) window.OMLanguage.open(); else { var l = document.getElementById('lang-btn'); if (l) l.click(); } return; }
    if (e.code === 'KeyN') { e.preventDefault(); var n = document.getElementById('notification-btn'); if (n) n.click(); return; }
  });
  window.OMHotkeys = { open: open, close: close };
})();
