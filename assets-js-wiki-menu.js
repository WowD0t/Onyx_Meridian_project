(function () {
  if (window.__omWikiMenuV10) return;
  window.__omWikiMenuV10 = true;
  var side = document.getElementById('wiki-side');
  if (!side) return;
  var menuBtn = document.getElementById('menu-toggle');
  var toc = document.querySelector('.wiki-toc');
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru'
    ? { title: 'Разделы вики', sub: 'Gloamguise: False Facades', placeholder: 'Поиск по страницам…', empty: 'Ничего не найдено', close: 'Закрыть меню', nav: 'Страницы вики', toc: 'На этой странице', sections: 'Разделы', zoom: 'Увеличить', results: 'страниц' }
    : { title: 'Wiki sections', sub: 'Gloamguise: False Facades', placeholder: 'Search pages…', empty: 'Nothing found', close: 'Close menu', nav: 'Wiki pages', toc: 'On this page', sections: 'Sections', zoom: 'Zoom', results: 'pages' };
  document.documentElement.classList.add('om-wiki-page');
  var mqMobile = window.matchMedia('(max-width:860px)');
  var mqToc = window.matchMedia('(max-width:1080px)');
  var scrim = document.createElement('div');
  scrim.className = 'wiki-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scrim);
  var head = document.createElement('div');
  head.className = 'wiki-menu-head';
  head.innerHTML = '<div class="wiki-menu-top"><div><div class="wiki-menu-title"><span>' + T.title + '</span></div><div class="wiki-menu-sub">' + T.sub + '</div></div><button type="button" class="iconbtn wiki-close" aria-label="' + T.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><div class="wiki-menu-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" autocomplete="off" placeholder="' + T.placeholder + '" aria-label="' + T.placeholder + '" aria-controls="wiki-side-nav"></div><div class="wiki-menu-status" role="status" aria-live="polite"></div><div class="wiki-menu-empty" hidden>' + T.empty + '</div>';
  side.insertBefore(head, side.firstChild);
  var input = head.querySelector('input');
  var empty = head.querySelector('.wiki-menu-empty');
  var status = head.querySelector('.wiki-menu-status');
  var closeBtn = head.querySelector('.wiki-close');
  var groups = Array.prototype.slice.call(side.querySelectorAll('.wiki-side-group'));
  var nav = document.createElement('nav');
  nav.className = 'wiki-side-nav';
  nav.id = 'wiki-side-nav';
  nav.setAttribute('aria-label', T.nav);
  groups.forEach(function (g) { nav.appendChild(g); });
  side.appendChild(nav);
  if (menuBtn) {
    menuBtn.setAttribute('aria-controls', 'wiki-side');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', T.sections);
  }
  var tocSheet = null;
  var returnFocus = null;
  function visibleLinks() {
    return Array.prototype.filter.call(nav.querySelectorAll('a'), function (a) { return a.offsetParent !== null; });
  }
  function filter() {
    var q = input.value.trim().toLowerCase();
    var any = false;
    var count = 0;
    groups.forEach(function (g) {
      var title = (g.querySelector('.wiki-side-title') || {}).textContent || '';
      var groupMatch = q && title.toLowerCase().indexOf(q) !== -1;
      var visible = 0;
      Array.prototype.forEach.call(g.querySelectorAll('a'), function (a) {
        var match = !q || groupMatch || a.textContent.toLowerCase().indexOf(q) !== -1;
        a.hidden = !match;
        if (match) { visible++; count++; }
      });
      g.hidden = visible === 0;
      if (visible) any = true;
    });
    empty.hidden = any;
    var word = lang === 'ru'
      ? (count % 10 === 1 && count % 100 !== 11 ? 'страница' : (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'страницы' : 'страниц'))
      : (count === 1 ? 'page' : 'pages');
    status.textContent = q ? count + ' ' + word : '';
  }
  input.addEventListener('input', filter);
  function lock() {
    document.body.classList.add('wiki-drawer-open');
    scrim.classList.add('open');
    scrim.setAttribute('aria-hidden', 'false');
  }
  function unlock() {
    document.body.classList.remove('wiki-drawer-open');
    scrim.classList.remove('open');
    scrim.setAttribute('aria-hidden', 'true');
  }
  function syncAria() {
    if (mqMobile.matches && !side.classList.contains('open')) side.setAttribute('aria-hidden', 'true');
    else side.removeAttribute('aria-hidden');
    if (tocSheet) {
      if (mqToc.matches && !tocSheet.classList.contains('open')) tocSheet.setAttribute('aria-hidden', 'true');
      else tocSheet.removeAttribute('aria-hidden');
    }
  }
  function closeSections() {
    side.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    syncAria();
  }
  function closeToc() {
    if (tocSheet) tocSheet.classList.remove('open');
    syncAria();
  }
  function closeAll() {
    closeSections();
    closeToc();
    unlock();
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    returnFocus = null;
  }
  function openSections() {
    closeToc();
    returnFocus = document.activeElement;
    side.classList.add('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    lock();
    syncAria();
    setTimeout(function () { input.focus(); }, 180);
  }
  function buildToc() {
    if (tocSheet || !toc) return;
    tocSheet = document.createElement('aside');
    tocSheet.className = 'wiki-toc-sheet';
    tocSheet.setAttribute('aria-label', T.toc);
    var title = toc.querySelector('.wiki-toc-title');
    tocSheet.innerHTML = '<div class="wiki-toc-head"><strong>' + (title ? title.textContent : T.toc) + '</strong><button type="button" class="iconbtn wiki-close" aria-label="' + T.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><nav class="wiki-toc-nav" aria-label="' + T.toc + '"></nav>';
    var tnav = tocSheet.querySelector('.wiki-toc-nav');
    Array.prototype.forEach.call(toc.querySelectorAll('a'), function (a) { tnav.appendChild(a.cloneNode(true)); });
    tocSheet.querySelector('.wiki-close').addEventListener('click', closeAll);
    tocSheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeAll(); });
    document.body.appendChild(tocSheet);
    syncAria();
  }
  function openToc() {
    buildToc();
    if (!tocSheet) return;
    closeSections();
    returnFocus = document.activeElement;
    tocSheet.classList.add('open');
    lock();
    syncAria();
    setTimeout(function () { tocSheet.querySelector('.wiki-close').focus(); }, 180);
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { side.classList.contains('open') ? closeAll() : openSections(); });
  closeBtn.addEventListener('click', closeAll);
  scrim.addEventListener('click', closeAll);
  Array.prototype.forEach.call(document.querySelectorAll('[data-wiki-open]'), function (btn) {
    btn.addEventListener('click', function () { btn.getAttribute('data-wiki-open') === 'toc' ? openToc() : openSections(); });
  });
  side.addEventListener('click', function (e) { if (e.target.closest('a')) closeAll(); });
  document.addEventListener('keydown', function (e) {
    var open = side.classList.contains('open') || (tocSheet && tocSheet.classList.contains('open'));
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeAll(); return; }
    if (e.key === 'Tab') {
      var drawer = side.classList.contains('open') ? side : tocSheet;
      var focusable = Array.prototype.filter.call(drawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])'), function (el) { return el.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { var links = visibleLinks(); if (links.length) { e.preventDefault(); links[0].focus(); } }
  });
  nav.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var links = visibleLinks();
    var i = links.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    var next = e.key === 'ArrowDown' ? Math.min(links.length - 1, i + 1) : Math.max(0, i - 1);
    links[next].focus();
  });
  function onResize() {
    if (!mqMobile.matches) closeSections();
    if (!mqToc.matches) closeToc();
    if (!side.classList.contains('open') && !(tocSheet && tocSheet.classList.contains('open'))) unlock();
    syncAria();
  }
  if (mqMobile.addEventListener) { mqMobile.addEventListener('change', onResize); mqToc.addEventListener('change', onResize); }
  else { mqMobile.addListener(onResize); mqToc.addListener(onResize); }
  syncAria();
  var heads = [];
  if (toc) {
    Array.prototype.forEach.call(toc.querySelectorAll('a'), function (a) {
      var id = (a.getAttribute('href') || '').slice(1);
      var el = id && document.getElementById(id);
      if (el) heads.push({ el: el, id: id });
    });
  }
  var ticking = false;
  function spy() {
    ticking = false;
    if (!heads.length) return;
    var header = document.querySelector('.site-header');
    var offset = (header ? header.offsetHeight : 62) + 90;
    var current = heads[0].id;
    heads.forEach(function (h) { if (h.el.getBoundingClientRect().top <= offset) current = h.id; });
    Array.prototype.forEach.call(document.querySelectorAll('.wiki-toc a, .wiki-toc-sheet a'), function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  document.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  spy();
  Array.prototype.forEach.call(document.querySelectorAll('.wiki-body img'), function (img) {
    if (img.closest('.wiki-img-wrap')) return;
    var wrap = document.createElement('span');
    wrap.className = 'wiki-img-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wiki-zoom-hint';
    btn.setAttribute('aria-label', T.zoom);
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5M11 8v6M8 11h6"></path></svg><span>' + T.zoom + '</span>';
    btn.addEventListener('click', function () { img.click(); });
    wrap.appendChild(btn);
  });
})();
