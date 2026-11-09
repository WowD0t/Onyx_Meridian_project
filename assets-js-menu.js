(function () {
  if (window.__omMenuV13) return;
  window.__omMenuV13 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var verifyHref = document.documentElement.getAttribute('data-verify-href') || 'verify.html';
  var feedHref = document.documentElement.getAttribute('data-feed-href') || 'feed.xml';
  var mediaHref = document.documentElement.getAttribute('data-media-href') || verifyHref.replace(/verify\.html$/, 'media.html');
  var downloadsHref = document.documentElement.getAttribute('data-downloads-href') || mediaHref.replace(/media\.html$/, 'downloads.html');
  var statusHref = document.documentElement.getAttribute('data-status-href') || mediaHref.replace(/media\.html$/, 'status.html');
  var compatHref = document.documentElement.getAttribute('data-compat-href') || mediaHref.replace(/media\.html$/, 'compatibility.html');
  var T = lang === 'ru' ? { menu: 'Меню сайта', close: 'Закрыть меню', nav: 'Разделы', tools: 'Инструменты', prefs: 'Настройки сайта', settings: 'Открыть настройки', hotkeys: 'Горячие клавиши', search: 'Поиск по сайту', notifications: 'Уведомления', verify: 'Проверка файла', feed: 'Лента обновлений', updates: 'Уведомления об обновлениях', theme: 'Переключить тему', language: 'Сменить язык', media: 'Медиа и видео', downloads: 'Загрузки и версии', status: 'Статус сервисов', compat: 'Совместимость', open: 'Открыть меню' } : { menu: 'Site menu', close: 'Close menu', nav: 'Navigation', tools: 'Tools', prefs: 'Preferences', settings: 'Open settings', hotkeys: 'Keyboard shortcuts', search: 'Search the site', notifications: 'Notifications', verify: 'Verify download', feed: 'Updates feed', updates: 'Enable update alerts', theme: 'Toggle theme', language: 'Switch language', media: 'Media & videos', downloads: 'Downloads & versions', status: 'Service status', compat: 'Compatibility', open: 'Open menu' };
  var header = document.querySelector('.site-header .header-actions');
  if (!header) return;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'om-menu-btn';
  btn.className = 'om-menu-btn';
  btn.setAttribute('aria-label', T.open);
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';
  header.appendChild(btn);
  var overlay = document.createElement('div');
  overlay.className = 'om-menu-overlay om-drawer-overlay';
  overlay.hidden = true;
  var drawer = document.createElement('aside');
  drawer.className = 'om-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', T.menu);
  var navLinks = Array.prototype.map.call(document.querySelectorAll('.header-nav a'), function (a) { return { href: a.getAttribute('href'), text: a.textContent.trim(), active: a.classList.contains('active') }; });
  var html = '<div class="om-drawer-head"><strong>' + T.menu + '</strong><button type="button" class="iconbtn om-menu-close" aria-label="' + T.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><div class="om-drawer-body">';
  html += '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.nav + '</h3>';
  navLinks.forEach(function (l) { html += '<a class="om-drawer-link" href="' + l.href + '"' + (l.active ? ' aria-current="page"' : '') + '>' + l.text + '</a>'; });
  html += '</section><section class="om-drawer-group"><h3 class="om-drawer-title">' + T.tools + '</h3>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="search">' + T.search + '<small>Ctrl K</small></button>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="notifications">' + T.notifications + '</button>';
  html += '<a class="om-drawer-link" href="' + mediaHref + '">' + T.media + '</a>';
  html += '<a class="om-drawer-link" href="' + downloadsHref + '">' + T.downloads + '</a>';
  html += '<a class="om-drawer-link" href="' + statusHref + '">' + T.status + '</a>';
  html += '<a class="om-drawer-link" href="' + compatHref + '">' + T.compat + '</a>';
  html += '<a class="om-drawer-link" href="' + verifyHref + '">' + T.verify + '</a>';
  html += '<a class="om-drawer-link" href="' + feedHref + '">' + T.feed + '</a>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="updates">' + T.updates + '</button>';
  html += '</section><section class="om-drawer-group"><h3 class="om-drawer-title">' + T.prefs + '</h3>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="settings">' + T.settings + '<small>S</small></button>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="hotkeys">' + T.hotkeys + '<small>?</small></button>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="theme">' + T.theme + '<small>T</small></button>';
  html += '<button type="button" class="om-drawer-btn" data-menu-action="language">' + T.language + '<small>L</small></button>';
  html += '</section></div>';
  drawer.innerHTML = html;
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
  var lastFocus = null;
  function open() { lastFocus = document.activeElement; overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('open'); }); btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('om-menu-open'); drawer.querySelector('a,button').focus(); }
  function close() { overlay.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('om-menu-open'); setTimeout(function () { overlay.hidden = true; }, 220); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  btn.addEventListener('click', function () { overlay.hidden ? open() : close(); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  drawer.querySelector('.om-menu-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
  drawer.addEventListener('click', function (e) {
    var el = e.target.closest('[data-menu-action]');
    if (!el) return;
    var action = el.getAttribute('data-menu-action');
    if (action === 'settings') { close(); if (window.OMSettings) window.OMSettings.open(); }
    if (action === 'hotkeys') { close(); if (window.OMHotkeys) window.OMHotkeys.open(); }
    if (action === 'search') { close(); var s = document.querySelector('[data-search-open]'); if (s) s.click(); }
    if (action === 'notifications') { close(); var n = document.getElementById('notification-btn'); if (n) n.click(); }
    if (action === 'updates') { close(); if (window.OMUpdates) window.OMUpdates.enable(); }
    if (action === 'theme') { var t = document.getElementById('theme-btn'); if (t) t.click(); }
    if (action === 'language') { close(); if (window.OMLanguage) window.OMLanguage.open(); else { var l = document.getElementById('lang-btn'); if (l) l.click(); } }
  });
  window.OMMenu = { open: open, close: close };
})();
