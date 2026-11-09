(function () {
  if (window.__omDownloadStatsV27) return;
  window.__omDownloadStatsV27 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru'
    ? { total: 'всего скачиваний', note: 'Сумма прямых загрузок .mcaddon с сайта и загрузок CurseForge.', stale: 'Показаны сохранённые данные CurseForge.', updated: 'Обновлено', refresh: 'Обновить статистику', share: 'доля' }
    : { total: 'total downloads', note: 'Direct .mcaddon downloads from this site plus CurseForge downloads.', stale: 'Showing cached CurseForge data.', updated: 'Updated', refresh: 'Refresh statistics', share: 'share' };
  function fmt(n) { try { return Number(n).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US'); } catch (e) { return String(n); } }
  function readNum(el) {
    if (!el) return null;
    var t = (el.textContent || '').replace(/[^\d]/g, '');
    return t ? parseInt(t, 10) : null;
  }
  function pct(part, total) { return total > 0 ? Math.round(part / total * 100) : 0; }
  var SHORT = lang === 'ru' ? { site: 'С сайта', cf: 'CurseForge' } : { site: 'From site', cf: 'CurseForge' };
  var HERO = lang === 'ru' ? { label: 'Всего скачиваний:', title: 'Сайт + CurseForge' } : { label: 'Total downloads:', title: 'Site + CurseForge' };
  function updateHeroTotal(site, cf) {
    var hero = document.querySelector('[data-hero-total]');
    if (!hero) return;
    if (site === null || cf === null) { hero.setAttribute('hidden', ''); return; }
    var count = hero.querySelector('[data-hero-total-count]');
    var label = hero.querySelector('[data-hero-total-label]');
    if (count) count.textContent = fmt((site || 0) + (cf || 0));
    if (label) label.textContent = HERO.label;
    hero.setAttribute('title', HERO.title);
    hero.removeAttribute('hidden');
  }
  function update(card) {
    var sl = card.querySelector('[data-download-label]');
    if (sl) sl.textContent = SHORT.site;
    var cl = card.querySelector('[data-cf-label]');
    if (cl) { cl.textContent = SHORT.cf; cl.setAttribute('title', lang === 'ru' ? 'Открыть проект на CurseForge' : 'Open the project on CurseForge'); }
    var site = readNum(card.querySelector('[data-download-count]'));
    var cf = readNum(card.querySelector('[data-cf-downloads]'));
    var known = site !== null || cf !== null;
    var s = site || 0, c = cf || 0, total = s + c;
    updateHeroTotal(site, cf);
    var totalEl = card.querySelector('[data-dlstats-total]');
    if (totalEl) totalEl.textContent = known ? fmt(total) : '—';
    card.setAttribute('data-state', known ? 'ready' : 'loading');
    var sp = pct(s, total), cp = total > 0 ? 100 - sp : 0;
    var segSite = card.querySelector('[data-dlstats-seg="site"]');
    var segCf = card.querySelector('[data-dlstats-seg="cf"]');
    if (segSite) segSite.style.width = sp + '%';
    if (segCf) segCf.style.width = cp + '%';
    var pSite = card.querySelector('[data-dlstats-pct="site"]');
    var pCf = card.querySelector('[data-dlstats-pct="cf"]');
    if (pSite) pSite.textContent = known ? sp + '%' : '—';
    if (pCf) pCf.textContent = known ? cp + '%' : '—';
    var bar = card.querySelector('.om-dlstats-bar');
    if (bar) { bar.setAttribute('title', (lang === 'ru' ? 'С сайта ' : 'Site ') + sp + '% · CurseForge ' + cp + '%'); }
    var note = card.querySelector('[data-dlstats-note]');
    if (note) {
      var cfEl = card.querySelector('[data-cf-counter]');
      var stale = cfEl && cfEl.getAttribute('data-stale') === 'true';
      note.textContent = T.note + (stale ? ' ' + T.stale : '');
    }
  }
  function watch(card) {
    var nodes = [card.querySelector('[data-download-count]'), card.querySelector('[data-cf-downloads]')].filter(Boolean);
    if (!window.MutationObserver || !nodes.length) return;
    var pending = false;
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; update(card); });
    });
    nodes.forEach(function (n) { mo.observe(n, { childList: true, characterData: true, subtree: true }); });
  }
  function mount() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-om-download-stats]'));
    cards.forEach(function (card) {
      if (card.getAttribute('data-dlstats-ready') === '1') return;
      card.setAttribute('data-dlstats-ready', '1');
      var label = card.querySelector('[data-dlstats-total-label]');
      if (label) label.textContent = T.total;
      var btn = card.querySelector('[data-dlstats-refresh]');
      if (btn) {
        btn.setAttribute('aria-label', T.refresh);
        btn.setAttribute('title', T.refresh);
        btn.addEventListener('click', function () {
          btn.setAttribute('data-busy', 'true');
          if (window.OMDownloadsRefresh) window.OMDownloadsRefresh();
          if (window.OMCFRefresh) window.OMCFRefresh();
          setTimeout(function () { btn.removeAttribute('data-busy'); update(card); }, 1200);
        });
      }
      update(card);
      watch(card);
      setTimeout(function () { update(card); }, 1500);
      setTimeout(function () { update(card); }, 4000);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  window.OMDownloadStats = { refresh: mount, update: function () { Array.prototype.forEach.call(document.querySelectorAll('[data-om-download-stats]'), update); } };
})();
