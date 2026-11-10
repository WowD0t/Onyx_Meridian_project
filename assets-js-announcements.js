(function () {
  if (window.__omAnnouncementsV15) return;
  window.__omAnnouncementsV15 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var seenKey = 'om-announcements-seen-v2';
  var dismissedKey = 'om-announcements-dismissed-v1';
  var seen = {}, dismissed = {};
  try { seen = JSON.parse(localStorage.getItem(seenKey) || '{}'); } catch (e) {}
  try { dismissed = JSON.parse(localStorage.getItem(dismissedKey) || '{}'); } catch (e) {}
  var lastIds = null;
  function resolveUrl(u) {
    if (!u) return '';
    if (/^(https?:)?\/\//.test(u) || /^(mailto|tel|#)/.test(u)) return u;
    if (root === '') return u;
    var m = u.match(/^(en|ru)-(.+)$/);
    if (m) return m[1] + '/' + m[2].replace(/-/g, '/');
    return u;
  }
  function active(a) {
    var now = Date.now();
    if (a.published_at && Date.parse(a.published_at) > now) return false;
    if (a.expires_at && Date.parse(a.expires_at) < now) return false;
    return true;
  }
  function map(a) {
    return {
      id: a.id,
      kind: a.kind || 'update',
      severity: a.severity || 'info',
      pinned: !!a.pinned,
      toast: a.toast !== false,
      browser: !!a.browser,
      banner: a.banner !== false,
      title: { en: a.title_en || a.title_ru || '', ru: a.title_ru || a.title_en || '' },
      body: { en: a.body_en || a.body_ru || '', ru: a.body_ru || a.body_en || '' },
      when: { en: a.date || '', ru: a.date || '' },
      cta: { en: a.cta_en || 'Open', ru: a.cta_ru || 'Открыть' },
      href: resolveUrl(a.url),
      source: 'announcement'
    };
  }
  function renderBanner(items) {
    var old = document.querySelector('.om-announce-banner');
    if (old) old.remove();
    var pinned = items.filter(function (a) { return a.pinned && a.banner && !dismissed[a.id]; })[0];
    if (!pinned) return;
    var main = document.querySelector('main');
    if (!main) return;
    var b = document.createElement('div');
    b.className = 'om-announce-banner';
    b.innerHTML = '<div><strong></strong><p></p></div><button type="button" class="om-banner-close" aria-label="Close">×</button>';
    b.querySelector('strong').textContent = pinned.title[lang];
    b.querySelector('p').textContent = pinned.body[lang];
    b.querySelector('.om-banner-close').addEventListener('click', function () { dismissed[pinned.id] = true; try { localStorage.setItem(dismissedKey, JSON.stringify(dismissed)); } catch (e) {} b.remove(); });
    if (pinned.href) { b.style.cursor = 'pointer'; b.addEventListener('click', function (e) { if (e.target.closest('.om-banner-close')) return; window.location.href = pinned.href; }); }
    var wrap = document.createElement('div');
    wrap.className = 'container om-announce-wrap';
    wrap.appendChild(b);
    main.insertBefore(wrap, main.firstChild);
  }
  function load(first) {
    fetch(root + 'announcements.json?ts=' + Date.now(), { headers: { 'Accept': 'application/json' }, cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      var raw = ((j && j.items) || []).filter(active);
      var mapped = raw.map(map);
      var ids = mapped.map(function (m) { return m.id; }).join('|');
      var fresh = [];
      mapped.forEach(function (m) { if (!seen[m.id]) { fresh.push(m); seen[m.id] = Date.now(); } });
      try { localStorage.setItem(seenKey, JSON.stringify(seen)); } catch (e) {}
      var isNew = lastIds !== null && ids !== lastIds;
      lastIds = ids;
      document.dispatchEvent(new CustomEvent('om:announcements', { detail: { items: mapped, fresh: first || !isNew ? [] : fresh } }));
      renderBanner(mapped);
    }).catch(function () {});
  }
  load(true);
  setInterval(function () { if (!document.hidden) load(false); }, 60000);
  window.addEventListener('focus', function () { load(false); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) load(false); });
})();
