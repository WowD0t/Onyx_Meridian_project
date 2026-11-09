(function () {
  'use strict';
  var root = document.documentElement;
  var lang = root.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var center = document.getElementById('notification-center');
  if (!center || window.__omNotificationsV15) return;
  window.__omNotificationsV15 = true;
  var addonTarget = center.getAttribute('data-target') || 'gloamguise/index.html#updates';
  var licenseTarget = center.getAttribute('data-target-license') || 'license.html';
  var officialTarget = center.getAttribute('data-target-official') || 'index.html#official';
  var readKey = 'om-notifications-read-v2';
  var prefKey = 'om-notification-prefs-v1';
  var prefs = { toasts: true, browser: false, quiet: false, quietStart: '22:00', quietEnd: '08:00', cats: { release: true, update: true, event: true, warning: true, maintenance: true, studio: true, licence: true, official: true } };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(prefKey) || '{}')); } catch (e) {}
  function savePrefs() { try { localStorage.setItem(prefKey, JSON.stringify(prefs)); } catch (e) {} }
  var text = {
    en: { open: 'Studio notifications', title: 'Studio bulletin', sub: 'Releases, announcements and official channels', markAll: 'Mark all read', mark: 'Mark read', read: 'Read', empty: 'Nothing here yet', foot: 'Read status is saved on this device.', close: 'Close notifications', new: 'New', unread: 'unread', all: 'All', unreadTab: 'Unread', annTab: 'Announcements', search: 'Search notifications', settings: 'Notification settings', toasts: 'In-page toasts', browser: 'Browser notifications', quiet: 'Quiet hours', from: 'From', to: 'To', categories: 'Categories', enableBrowser: 'Allow browser notifications', browserDenied: 'Browser notifications are blocked in settings.', noUnread: 'No unread updates' },
    ru: { open: 'Уведомления студии', title: 'Бюллетень студии', sub: 'Релизы, объявления и официальные каналы', markAll: 'Прочитать всё', mark: 'Отметить прочитанным', read: 'Прочитано', empty: 'Пока ничего нет', foot: 'Статус прочтения хранится на этом устройстве.', close: 'Закрыть уведомления', new: 'Новое', unread: 'непрочитанных', all: 'Все', unreadTab: 'Непрочитанные', annTab: 'Объявления', search: 'Поиск по уведомлениям', settings: 'Настройки уведомлений', toasts: 'Всплывающие уведомления на сайте', browser: 'Уведомления браузера', quiet: 'Тихие часы', from: 'С', to: 'До', categories: 'Категории', enableBrowser: 'Разрешить уведомления браузера', browserDenied: 'Уведомления браузера запрещены в настройках.', noUnread: 'Непрочитанных обновлений нет' }
  }[lang];
  var KIND = {
    release: { en: 'Release', ru: 'Релиз' }, update: { en: 'Update', ru: 'Обновление' }, event: { en: 'Event', ru: 'Событие' },
    warning: { en: 'Warning', ru: 'Важно' }, maintenance: { en: 'Maintenance', ru: 'Техработы' }, studio: { en: 'Studio', ru: 'Студия' },
    licence: { en: 'Licence', ru: 'Лицензия' }, official: { en: 'Official', ru: 'Официально' }
  };
  var items = [
    { id: 'gloamguise-next-update-2026-10', kind: 'update', title: { en: 'Gloamguise: a new update is coming', ru: 'Gloamguise: совсем скоро выйдет обновление' }, body: { en: 'Bug fixes, reworked logic, more vanilla glass blocks and a larger camouflage registry are in progress.', ru: 'Готовятся исправления багов, переработанная логика, больше ванильных стеклянных блоков и расширенный реестр камуфляжа.' }, when: { en: 'Coming soon', ru: 'Совсем скоро' }, cta: { en: 'See what is coming', ru: 'Посмотреть, что добавят' }, href: addonTarget, source: 'static' },
    { id: 'om-eula-v3-1-2026-11', kind: 'licence', title: { en: 'OM Studio EULA v3.1 is published', ru: 'Опубликована OM Studio EULA v3.1' }, body: { en: 'One general studio licence for every Work. English authoritative text, official Russian translation.', ru: 'Одна общая лицензия студии для каждой Работы. Английский текст имеет силу, русский — официальный перевод.' }, when: { en: '4 Nov 2026', ru: '4 ноя 2026' }, cta: { en: 'Read licence v3.1', ru: 'Читать лицензию v3.1' }, href: licenseTarget, source: 'static' },
    { id: 'official-sources-2026-11', kind: 'official', title: { en: 'Official sources', ru: 'Официальные источники' }, body: { en: 'The studio website, Wiki, repositories, CurseForge and VK are listed. Mirrors are not official unless announced in writing.', ru: 'Перечислены сайт студии, вики, репозитории, CurseForge и VK. Зеркала не официальны, если не объявлены письменно.' }, when: { en: '4 Nov 2026', ru: '4 ноя 2026' }, cta: { en: 'View official sources', ru: 'Смотреть источники' }, href: officialTarget, source: 'static' }
  ];
  var read = {};
  try { var saved = JSON.parse(localStorage.getItem(readKey) || '[]'); if (Array.isArray(saved)) saved.forEach(function (id) { read[id] = true; }); } catch (e) {}
  function saveRead() { try { localStorage.setItem(readKey, JSON.stringify(Object.keys(read))); } catch (e) {} }
  function unreadCount() { return items.filter(function (i) { return !read[i.id]; }).length; }
  function quietNow() {
    if (!prefs.quiet) return false;
    var d = new Date(), m = d.getHours() * 60 + d.getMinutes();
    function p(s) { var a = s.split(':'); return (+a[0]) * 60 + (+a[1]); }
    var a = p(prefs.quietStart), b = p(prefs.quietEnd);
    return a <= b ? (m >= a && m < b) : (m >= a || m < b);
  }
  function catAllowed(kind) { return prefs.cats[kind] !== false; }
  var button = document.createElement('button');
  button.type = 'button'; button.className = 'iconbtn notification-btn'; button.id = 'notification-btn';
  button.setAttribute('aria-controls', 'notification-panel'); button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg><span class="notification-count" aria-hidden="true"></span>';
  center.appendChild(button);
  var panel = document.createElement('section');
  panel.className = 'notification-panel'; panel.id = 'notification-panel';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'notification-title');
  panel.hidden = true; document.body.appendChild(panel);
  // Rendering can replace the clicked node before the document click handler runs.
  panel.addEventListener('click', function (e) { e.stopPropagation(); });
  var count = button.querySelector('.notification-count');
  var isOpen = false, tab = 'all', query = '', showSettings = false;
  function kindLabel(k) { return (KIND[k] || KIND.update)[lang]; }
  function render() {
    var n = unreadCount();
    count.textContent = n > 9 ? '9+' : String(n);
    count.hidden = n === 0;
    button.classList.toggle('has-unread', n > 0);
    button.setAttribute('aria-label', text.open + (n ? ' · ' + n + ' ' + text.unread : ''));
    // Preserve focus and scroll when a filter, setting or incoming announcement changes.
    var focused = panel.contains(document.activeElement) ? document.activeElement.getAttribute('data-focus-key') : null;
    var previousScroll = panel.querySelector('.notification-scroll');
    var scrollTop = previousScroll ? previousScroll.scrollTop : 0;
    panel.innerHTML = '';
    var head = document.createElement('div'); head.className = 'notification-head';
    var heading = document.createElement('div'); heading.className = 'notification-heading';
    var eyebrow = document.createElement('span'); eyebrow.className = 'notification-eyebrow'; eyebrow.textContent = lang === 'ru' ? 'ONYX MERIDIAN / ОБНОВЛЕНИЯ' : 'ONYX MERIDIAN / UPDATES';
    var h = document.createElement('h2'); h.textContent = text.title; h.id = 'notification-title';
    var p = document.createElement('p'); p.textContent = n ? n + ' ' + text.unread : text.noUnread;
    heading.appendChild(eyebrow); heading.appendChild(h); heading.appendChild(p);
    var close = document.createElement('button'); close.type = 'button'; close.className = 'notification-close'; close.setAttribute('data-focus-key', 'close'); close.setAttribute('aria-label', text.close); close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    close.addEventListener('click', function () { setOpen(false); });
    head.appendChild(heading); head.appendChild(close); panel.appendChild(head);
    var controls = document.createElement('div'); controls.className = 'notification-controls';
    var tabs = document.createElement('div'); tabs.className = 'notification-tabs'; tabs.setAttribute('aria-label', text.title);
    [['all', text.all], ['unread', text.unreadTab], ['announcements', text.annTab]].forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'notification-tab' + (tab === t[0] ? ' active' : ''); b.textContent = t[1]; b.setAttribute('aria-pressed', String(tab === t[0])); b.setAttribute('data-focus-key', 'tab-' + t[0]);
      b.addEventListener('click', function () { tab = t[0]; render(); }); tabs.appendChild(b);
    });
    controls.appendChild(tabs);
    var tools = document.createElement('div'); tools.className = 'notification-tools';
    var markAll = document.createElement('button'); markAll.type = 'button'; markAll.className = 'notification-mark-all'; markAll.textContent = text.markAll; markAll.disabled = n === 0; markAll.setAttribute('data-focus-key', 'mark-all');
    markAll.addEventListener('click', function () { items.forEach(function (i) { read[i.id] = true; }); saveRead(); render(); });
    var settingsBtn = document.createElement('button'); settingsBtn.type = 'button'; settingsBtn.className = 'notification-settings-btn'; settingsBtn.setAttribute('data-focus-key', 'settings'); settingsBtn.setAttribute('aria-label', text.settings); settingsBtn.setAttribute('title', text.settings); settingsBtn.setAttribute('aria-expanded', String(showSettings)); settingsBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06-1.95 3.38-.09-.03a1.6 1.6 0 0 0-1.69.61l-.05.08H8l-.05-.08a1.6 1.6 0 0 0-1.69-.61l-.09.03-1.95-3.38.06-.06A1.6 1.6 0 0 0 4.6 15l-.1-.06V9.06L4.6 9a1.6 1.6 0 0 0-.32-1.77l-.06-.06 1.95-3.38.09.03a1.6 1.6 0 0 0 1.69-.61L8 3.13h8l.05.08a1.6 1.6 0 0 0 1.69.61l.09-.03 1.95 3.38-.06.06A1.6 1.6 0 0 0 19.4 9l.1.06v5.88z"/></svg>';
    settingsBtn.addEventListener('click', function () { showSettings = !showSettings; render(); });
    tools.appendChild(markAll); tools.appendChild(settingsBtn); controls.appendChild(tools); panel.appendChild(controls);
    var searchWrap = document.createElement('div'); searchWrap.className = 'notification-search-wrap';
    searchWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
    var search = document.createElement('input'); search.type = 'search'; search.className = 'notification-search'; search.placeholder = text.search; search.setAttribute('aria-label', text.search); search.setAttribute('data-focus-key', 'search'); search.value = query;
    search.addEventListener('input', function () { query = search.value.toLowerCase(); renderList(); });
    searchWrap.appendChild(search); panel.appendChild(searchWrap);
    var scroll = document.createElement('div'); scroll.className = 'notification-scroll';
    if (showSettings) scroll.appendChild(buildSettings());
    var list = document.createElement('div'); list.className = 'notification-list'; list.id = 'om-notification-list'; list.setAttribute('aria-live', 'polite'); scroll.appendChild(list); panel.appendChild(scroll);
    var foot = document.createElement('div'); foot.className = 'notification-foot'; foot.textContent = text.foot; panel.appendChild(foot);
    renderList(); scroll.scrollTop = scrollTop;
    if (focused && isOpen) { var restore = panel.querySelector('[data-focus-key="' + focused + '"]'); if (!restore || restore.disabled) restore = panel.querySelector('.notification-tab.active'); if (restore) restore.focus({ preventScroll: true }); }
  }
  function renderList() {
    var list = panel.querySelector('#om-notification-list');
    if (!list) return;
    list.innerHTML = '';
    var shown = items.filter(function (i) {
      if (tab === 'unread' && read[i.id]) return false;
      if (tab === 'announcements' && i.source !== 'announcement') return false;
      if (query && (i.title[lang] + ' ' + i.body[lang]).toLowerCase().indexOf(query) < 0) return false;
      return true;
    });
    shown.sort(function (a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
    if (!shown.length) { var empty = document.createElement('div'); empty.className = 'notification-empty'; empty.textContent = query ? (lang === 'ru' ? 'Ничего не найдено' : 'No results found') : (tab === 'unread' ? text.noUnread : text.empty); list.appendChild(empty); return; }
    shown.forEach(function (item) {
      var isRead = !!read[item.id];
      var article = document.createElement('article'); article.className = 'notification-item' + (isRead ? ' is-read' : '');
      var dot = document.createElement('span'); dot.className = 'notification-dot'; dot.setAttribute('aria-hidden', 'true'); article.appendChild(dot);
      var content = document.createElement('div'); content.className = 'notification-content';
      var top = document.createElement('div'); top.className = 'notification-item-top';
      var kind = document.createElement('span'); kind.className = 'notification-kind ' + (item.kind || 'update'); kind.textContent = kindLabel(item.kind);
      var when = document.createElement('span'); when.className = 'notification-when'; when.textContent = item.when ? item.when[lang] : '';
      top.appendChild(kind); top.appendChild(when);
      var title = document.createElement('h3'); title.textContent = item.title[lang];
      if (!isRead) { var badge = document.createElement('span'); badge.className = 'notification-new'; badge.textContent = text.new; title.appendChild(badge); }
      var body = document.createElement('p'); body.textContent = item.body[lang];
      var foot = document.createElement('div'); foot.className = 'notification-item-foot';
      if (item.href) { var link = document.createElement('a'); link.className = 'notification-cta'; link.href = item.href; link.textContent = (item.cta ? item.cta[lang] : text.open) + ' →'; link.addEventListener('click', function () { read[item.id] = true; saveRead(); }); foot.appendChild(link); }
      if (!isRead) { var mark = document.createElement('button'); mark.type = 'button'; mark.className = 'notification-mark'; mark.textContent = text.mark; mark.addEventListener('click', function () { read[item.id] = true; saveRead(); render(); var activeTab = panel.querySelector('.notification-tab.active'); if (activeTab) activeTab.focus({ preventScroll: true }); }); foot.appendChild(mark); }
      content.appendChild(top); content.appendChild(title); content.appendChild(body); content.appendChild(foot); article.appendChild(content); list.appendChild(article);
    });
  }
  function buildSettings() {
    var box = document.createElement('div'); box.className = 'om-notify-settings';
    box.innerHTML = '<h3>' + text.settings + '</h3>';
    function row(label, key) {
      var r = document.createElement('label'); r.className = 'om-notify-row';
      var s = document.createElement('span'); s.textContent = label;
      var inp = document.createElement('input'); inp.type = 'checkbox'; inp.checked = !!prefs[key];
      inp.addEventListener('change', function () { prefs[key] = inp.checked; savePrefs(); });
      r.appendChild(s); r.appendChild(inp); box.appendChild(r);
    }
    row(text.toasts, 'toasts');
    var br = document.createElement('div'); br.className = 'om-notify-row';
    var bs = document.createElement('span'); bs.textContent = text.browser;
    var bb = document.createElement('button'); bb.type = 'button'; bb.className = 'notification-mark-all'; bb.textContent = prefs.browser ? '✓' : text.enableBrowser;
    bb.addEventListener('click', function () {
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function (perm) { prefs.browser = perm === 'granted'; savePrefs(); render(); });
    });
    br.appendChild(bs); br.appendChild(bb); box.appendChild(br);
    row(text.quiet, 'quiet');
    var q = document.createElement('div'); q.className = 'om-notify-row';
    q.innerHTML = '<span>' + text.from + ' <input type="time" value="' + prefs.quietStart + '" style="width:90px"/></span><span>' + text.to + ' <input type="time" value="' + prefs.quietEnd + '" style="width:90px"/></span>';
    var times = q.querySelectorAll('input');
    times[0].addEventListener('change', function () { prefs.quietStart = times[0].value; savePrefs(); });
    times[1].addEventListener('change', function () { prefs.quietEnd = times[1].value; savePrefs(); });
    box.appendChild(q);
    var cats = document.createElement('div'); cats.className = 'om-notify-cats';
    Object.keys(KIND).forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'om-notify-cat' + (prefs.cats[k] !== false ? ' active' : ''); b.textContent = kindLabel(k);
      b.addEventListener('click', function () { prefs.cats[k] = prefs.cats[k] === false; savePrefs(); b.classList.toggle('active', prefs.cats[k] !== false); });
      cats.appendChild(b);
    });
    box.appendChild(cats);
    return box;
  }
  function setOpen(open) {
    isOpen = open;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { render(); panel.hidden = false; requestAnimationFrame(function () { panel.classList.add('open'); }); var close = panel.querySelector('.notification-close'); if (close) close.focus(); }
    else { panel.classList.remove('open'); panel.hidden = true; button.focus(); }
  }
  button.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!isOpen); });
  document.addEventListener('click', function (e) {
    var opener = e.target.closest ? e.target.closest('[data-notification-open]') : null;
    if (opener) { e.preventDefault(); setOpen(true); return; }
    if (isOpen && !panel.contains(e.target) && !button.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { e.preventDefault(); setOpen(false); } });
  window.addEventListener('pageshow', function () { panel.classList.remove('open'); panel.hidden = true; isOpen = false; button.setAttribute('aria-expanded', 'false'); render(); });
  function notify(item) {
    if (!catAllowed(item.kind) || quietNow()) return;
    if (prefs.toasts && window.OMToast) window.OMToast.show({ id: 'ann-' + item.id, title: item.title[lang], body: item.body[lang], timeout: 9000, actions: item.href ? [{ label: item.cta ? item.cta[lang] : text.open, primary: true, onClick: function () { read[item.id] = true; saveRead(); window.location.href = item.href; } }] : [] });
    if (prefs.browser && 'Notification' in window && Notification.permission === 'granted' && document.hidden) {
      try { new Notification(item.title[lang], { body: item.body[lang], tag: item.id }); } catch (e) {}
    }
  }
  document.addEventListener('om:announcements', function (e) {
    var incoming = (e.detail && e.detail.items) || [];
    var fresh = (e.detail && e.detail.fresh) || [];
    var added = [];
    incoming.forEach(function (a) {
      var ex = items.filter(function (i) { return i.id === a.id; })[0];
      if (ex) { Object.assign(ex, a); return; }
      items.unshift(a); added.push(a);
    });
    var ids = incoming.map(function (i) { return i.id; });
    items = items.filter(function (i) { return i.source !== 'announcement' || ids.indexOf(i.id) >= 0; });
    if (added.length || incoming.length) render();
    fresh.forEach(notify);
  });
  render();
})();
