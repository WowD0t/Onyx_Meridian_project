(function () {
  if (window.__omSearchPlusV23) return;
  window.__omSearchPlusV23 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? {
    ph: 'Поиск по сайту, вики и релизам…', all: 'Все', studio: 'Студия', addons: 'Аддоны', wiki: 'Вики', media: 'Медиа', downloads: 'Загрузки', status: 'Статус', support: 'Поддержка', licence: 'Лицензия',
    recent: 'Недавние запросы', clear: 'Очистить', empty: 'Ничего не найдено', start: 'Быстрые переходы', results: 'результатов', open: 'Открыть поиск', close: 'Закрыть поиск', nav: 'Навигация', quick: 'Быстрые переходы', noindex: 'Поисковый индекс недоступен'
  } : {
    ph: 'Search site, wiki and releases…', all: 'All', studio: 'Studio', addons: 'Add-ons', wiki: 'Wiki', media: 'Media', downloads: 'Downloads', status: 'Status', support: 'Support', licence: 'Licence',
    recent: 'Recent searches', clear: 'Clear', empty: 'Nothing found', start: 'Quick links', results: 'results', open: 'Open search', close: 'Close search', nav: 'Navigation', quick: 'Quick links', noindex: 'Search index unavailable'
  };
  var CATS = [['all', T.all], ['studio', T.studio], ['addons', T.addons], ['wiki', T.wiki], ['media', T.media], ['downloads', T.downloads], ['status', T.status], ['support', T.support], ['licence', T.licence]];
  var QUICK = lang === 'ru' ? [
    ['Скачать аддон', 'gloamguise/index.html#download'], ['Вики аддона', 'gloamguise/wiki/home.html'], ['Лицензия', '../license.html'], ['Поддержка', 'support.html'], ['Загрузки', 'downloads.html'], ['Совместимость', 'compatibility.html']
  ] : [
    ['Download add-on', 'gloamguise/index.html#download'], ['Add-on wiki', 'gloamguise/wiki/home.html'], ['Licence', '../license.html'], ['Support', 'support.html'], ['Downloads', 'downloads.html'], ['Compatibility', 'compatibility.html']
  ];
  var root = document.documentElement.getAttribute('data-root') || '';
  var items = (window.OM_INDEX || []).filter(function (i) { return i.lang === lang; });
  var recentKey = 'om-search-recent-v2';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cat(i) {
    var u = i.url || '';
    if (u.indexOf('wiki') >= 0) return 'wiki';
    if (u.indexOf('media') >= 0) return 'media';
    if (u.indexOf('downloads') >= 0 || u.indexOf('verify') >= 0) return 'downloads';
    if (u.indexOf('status') >= 0) return 'status';
    if (u.indexOf('compatibility') >= 0) return 'addons';
    if (u.indexOf('support') >= 0) return 'support';
    if (u.indexOf('license') >= 0) return 'licence';
    if (u.indexOf('addons') >= 0 || u.indexOf('gloamguise/index') >= 0) return 'addons';
    return 'studio';
  }
  function getRecent() { try { return JSON.parse(localStorage.getItem(recentKey) || '[]'); } catch (e) { return []; } }
  function addRecent(q) { if (!q) return; var r = getRecent().filter(function (x) { return x !== q; }); r.unshift(q); try { localStorage.setItem(recentKey, JSON.stringify(r.slice(0, 6))); } catch (e) {} }
  function tokens(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }
  function score(i, ts) {
    var title = (i.title || '').toLowerCase(), crumb = (i.crumb || '').toLowerCase(), text = (i.text || '').toLowerCase(), s = 0;
    for (var k = 0; k < ts.length; k++) {
      var t = ts[k], a = title.indexOf(t), b = crumb.indexOf(t), c = text.indexOf(t);
      if (a < 0 && b < 0 && c < 0) return 0;
      if (a === 0) s += 18; else if (a >= 0) s += 12;
      if (b >= 0) s += 5;
      if (c >= 0) s += 2;
    }
    return s;
  }
  function search(q, filter) {
    q = (q || '').trim();
    var pool = items.filter(function (i) { return filter === 'all' || cat(i) === filter; });
    if (!q) return pool.slice(0, 10);
    var ts = tokens(q);
    return pool.map(function (i) { return { i: i, s: score(i, ts) }; }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 40).map(function (x) { return x.i; });
  }
  function highlight(text, q) {
    var safe = esc(text);
    if (!q) return safe;
    var ts = tokens(q).sort(function (a, b) { return b.length - a.length; });
    ts.forEach(function (t) {
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      safe = safe.replace(re, '<mark>$1</mark>');
    });
    return safe;
  }
  function snippet(i, q) {
    var text = i.text || '';
    if (!q) return text.slice(0, 140);
    var ts = tokens(q), pos = -1;
    for (var k = 0; k < ts.length; k++) { pos = text.toLowerCase().indexOf(ts[k]); if (pos >= 0) break; }
    if (pos < 0) return text.slice(0, 140);
    return (pos > 50 ? '…' : '') + text.slice(Math.max(0, pos - 50), pos + 150);
  }
  function resultHtml(list, q) {
    if (!items.length) return '<p class="om-search-empty">' + T.noindex + '</p>';
    if (!list.length) return '<p class="om-search-empty">' + T.empty + '</p>';
    return list.map(function (i, idx) {
      return '<a class="om-search-item" data-idx="' + idx + '" href="' + esc(i.url) + '"><span class="om-search-item-crumb">' + esc(i.crumb || '') + '</span><strong>' + highlight(i.title, q) + '</strong><p>' + highlight(snippet(i, q), q) + '</p></a>';
    }).join('');
  }
  function chipsHtml(active) { return CATS.map(function (c) { return '<button type="button" class="om-search-chip' + (active === c[0] ? ' active' : '') + '" data-cat="' + c[0] + '">' + c[1] + '</button>'; }).join(''); }
  function quickHtml() { return '<div class="om-search-quick"><span>' + T.quick + '</span>' + QUICK.map(function (x) { return '<a href="' + root + x[1] + '">' + esc(x[0]) + '</a>'; }).join('') + '</div>'; }

  var overlay = document.createElement('div');
  overlay.className = 'om-search-v23';
  overlay.id = 'om-search-plus';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', T.open);
  overlay.innerHTML = '<div class="om-search-v23-backdrop" data-close></div><div class="om-search-v23-panel"><div class="om-search-v23-head"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="om-search-plus-input" type="search" autocomplete="off" enterkeyhint="search" placeholder="' + T.ph + '" aria-label="' + T.open + '"/><button type="button" class="om-search-v23-close" data-close aria-label="' + T.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="om-search-chips" role="tablist">' + chipsHtml('all') + '</div><div class="om-search-recent"></div><div class="om-search-v23-results" id="om-search-plus-results" role="listbox"></div><div class="om-search-v23-foot"><span>↑↓</span> ' + T.nav + ' · <span>Enter</span> · <span>Esc</span></div></div>';
  document.body.appendChild(overlay);
  var input = overlay.querySelector('input');
  var results = overlay.querySelector('.om-search-v23-results');
  var recentBox = overlay.querySelector('.om-search-recent');
  var filter = 'all', sel = -1, current = [], lastFocus = null;
  function renderRecent() {
    var r = getRecent();
    recentBox.innerHTML = r.length ? '<span>' + T.recent + '</span>' + r.map(function (q) { return '<button type="button" data-q="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '<button type="button" class="om-search-clear">' + T.clear + '</button>' : '';
  }
  function render() {
    var q = input.value.trim();
    current = search(q, filter);
    sel = -1;
    results.innerHTML = q ? resultHtml(current, q) : quickHtml() + resultHtml(current, '');
    renderRecent();
  }
  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    document.body.classList.add('om-search-open');
    input.value = '';
    filter = 'all';
    overlay.querySelectorAll('.om-search-chip').forEach(function (b) { b.classList.toggle('active', b.dataset.cat === 'all'); });
    render();
    setTimeout(function () { input.focus(); }, 40);
  }
  function close() {
    overlay.classList.remove('open');
    document.body.classList.remove('om-search-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-search-open], .searchbtn');
    if (opener) { e.preventDefault(); e.stopImmediatePropagation(); open(); return; }
    if (!overlay.classList.contains('open')) return;
    if (e.target.closest('[data-close]')) { close(); return; }
    var chip = e.target.closest('.om-search-chip');
    if (chip) { filter = chip.dataset.cat; overlay.querySelectorAll('.om-search-chip').forEach(function (b) { b.classList.toggle('active', b === chip); }); render(); return; }
    var rq = e.target.closest('.om-search-recent button[data-q]');
    if (rq) { input.value = rq.dataset.q; render(); input.focus(); return; }
    if (e.target.closest('.om-search-clear')) { try { localStorage.removeItem(recentKey); } catch (err) {} renderRecent(); return; }
    var item = e.target.closest('.om-search-item');
    if (item) addRecent(input.value.trim());
  }, true);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.code === 'KeyK')) { e.preventDefault(); e.stopImmediatePropagation(); open(); return; }
    if (!overlay.classList.contains('open')) {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var links = results.querySelectorAll('.om-search-item');
      if (!links.length) return;
      sel = e.key === 'ArrowDown' ? (sel + 1) % links.length : (sel - 1 + links.length) % links.length;
      links.forEach(function (a, i) { a.classList.toggle('active', i === sel); });
      links[sel].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      var links2 = results.querySelectorAll('.om-search-item');
      if (links2.length) { e.preventDefault(); addRecent(input.value.trim()); (links2[sel] || links2[0]).click(); }
    } else if (e.key === 'Tab') {
      var focusables = overlay.querySelectorAll('input, button, a[href]');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);
  input.addEventListener('input', render);

  var pageInput = document.getElementById('site-search');
  var pageBox = document.getElementById('site-search-results');
  if (pageInput && pageBox) {
    var pageFilter = 'all';
    var wrap = document.createElement('div');
    wrap.className = 'om-search-chips om-search-page-chips';
    wrap.innerHTML = chipsHtml('all');
    pageBox.parentNode.insertBefore(wrap, pageBox);
    function pageRender() {
      var q = pageInput.value.trim();
      var list = search(q, pageFilter);
      pageBox.innerHTML = q ? resultHtml(list, q) : quickHtml() + resultHtml(list, '');
      var count = document.getElementById('site-search-count');
      if (count) count.textContent = q ? list.length + ' ' + T.results : '';
      var url = new URL(location.href);
      if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
      if (pageFilter !== 'all') url.searchParams.set('type', pageFilter); else url.searchParams.delete('type');
      history.replaceState(null, '', url);
    }
    wrap.addEventListener('click', function (e) { var b = e.target.closest('.om-search-chip'); if (!b) return; pageFilter = b.dataset.cat; wrap.querySelectorAll('.om-search-chip').forEach(function (x) { x.classList.toggle('active', x === b); }); pageRender(); });
    pageInput.addEventListener('input', pageRender);
    var params = new URLSearchParams(location.search);
    if (params.get('type')) { pageFilter = params.get('type'); wrap.querySelectorAll('.om-search-chip').forEach(function (x) { x.classList.toggle('active', x.dataset.cat === pageFilter); }); }
    if (params.get('q')) pageInput.value = params.get('q');
    pageRender();
  }
})();
