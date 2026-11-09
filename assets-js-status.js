(function () {
  var grid = document.getElementById('status-grid');
  if (!grid || window.__omStatusV17) return;
  window.__omStatusV17 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var cfg = window.OM_FORM || {};
  var T = lang === 'ru' ? { ok: 'Доступно', warn: 'Ограниченно', fail: 'Недоступно', check: 'Проверка…', unknown: 'Не настроено', summaryOk: 'Основные проверки пройдены', summaryWarn: 'Есть ограничения', summaryFail: 'Есть проблемы', last: 'Последняя проверка', local: 'Проверка из вашего браузера', history: 'Пока нет истории' } : { ok: 'Available', warn: 'Limited', fail: 'Unavailable', check: 'Checking…', unknown: 'Not configured', summaryOk: 'Core checks passed', summaryWarn: 'Some limitations', summaryFail: 'Issues detected', last: 'Last check', local: 'Check from your browser', history: 'No history yet' };
  var summary = document.getElementById('status-summary');
  var historyEl = document.getElementById('status-history');
  var key = 'om-status-history-v1';
  function fetchJson(url, timeout) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, timeout || 8000);
    return fetch(url, { cache: 'no-store', signal: ctrl.signal }).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('http'); return r.json(); });
  }
  function checks() {
    var list = [
      { id: 'site', name: lang === 'ru' ? 'Оболочка сайта' : 'Site shell', run: function () { return Promise.resolve('ok'); } },
      { id: 'build', name: lang === 'ru' ? 'Манифест сборки' : 'Build manifest', run: function () { return fetchJson(root + 'build.json?ts=' + Date.now()).then(function () { return 'ok'; }); } },
      { id: 'announcements', name: lang === 'ru' ? 'Лента объявлений' : 'Announcements feed', run: function () { return fetchJson(root + 'announcements.json?ts=' + Date.now()).then(function () { return 'ok'; }); } },
      { id: 'releases', name: lang === 'ru' ? 'Каталог релизов' : 'Release catalogue', run: function () { return fetchJson(root + 'releases.json?ts=' + Date.now()).then(function () { return 'ok'; }); } },
      { id: 'media', name: lang === 'ru' ? 'Каталог медиа' : 'Media catalogue', run: function () { return fetchJson(root + 'videos.json?ts=' + Date.now()).then(function () { return 'ok'; }); } },
      { id: 'support-primary', name: lang === 'ru' ? 'Основной канал поддержки' : 'Primary support channel', run: function () { if (!cfg.appsScriptEndpoint) return Promise.resolve('unknown'); return fetchJson(cfg.appsScriptEndpoint + (cfg.appsScriptEndpoint.indexOf('?') >= 0 ? '&' : '?') + 'action=health').then(function (j) { return j && j.ok ? 'ok' : 'fail'; }); } },
      { id: 'support-fallback', name: lang === 'ru' ? 'Резерв Web3Forms' : 'Web3Forms fallback', run: function () { return Promise.resolve(cfg.accessKey ? 'warn' : 'unknown'); } },
      { id: 'cf', name: 'CurseForge API', run: function () { return fetchJson('https://api.cfwidget.com/1755508', 9000).then(function () { return 'ok'; }); } }
    ];
    return list;
  }
  function render(results) {
    grid.innerHTML = '';
    var fail = 0, warn = 0;
    results.forEach(function (r) {
      if (r.state === 'fail') fail++;
      if (r.state === 'warn' || r.state === 'unknown') warn++;
      var card = document.createElement('article');
      card.className = 'status-card ' + r.state;
      card.innerHTML = '<div class="status-card-top"><strong></strong><span class="status-pill"></span></div><p></p><small>' + T.local + '</small>';
      card.querySelector('strong').textContent = r.name;
      card.querySelector('.status-pill').textContent = T[r.state] || r.state;
      card.querySelector('p').textContent = r.detail || '';
      grid.appendChild(card);
    });
    var state = fail ? 'fail' : warn ? 'warn' : 'ok';
    summary.className = 'status-summary ' + state;
    summary.innerHTML = '<strong>' + (state === 'ok' ? T.summaryOk : state === 'warn' ? T.summaryWarn : T.summaryFail) + '</strong><span>' + T.last + ': ' + new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US') + '</span>';
    var hist = [];
    try { hist = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    hist.unshift({ t: Date.now(), state: state, fail: fail, warn: warn });
    hist = hist.slice(0, 24);
    try { localStorage.setItem(key, JSON.stringify(hist)); } catch (e) {}
    historyEl.innerHTML = hist.length ? hist.map(function (h) { return '<span class="status-dot ' + h.state + '" title="' + new Date(h.t).toLocaleString() + '"></span>'; }).join('') : '<p class="om-player-muted">' + T.history + '</p>';
  }
  function run() {
    var list = checks();
    grid.innerHTML = '';
    list.forEach(function (c) {
      var card = document.createElement('article');
      card.className = 'status-card check';
      card.innerHTML = '<div class="status-card-top"><strong>' + c.name + '</strong><span class="status-pill">' + T.check + '</span></div>';
      grid.appendChild(card);
    });
    Promise.all(list.map(function (c) {
      return c.run().then(function (state) { return { name: c.name, state: state, detail: '' }; }).catch(function () { return { name: c.name, state: 'fail', detail: '' }; });
    })).then(render);
  }
  var btn = document.getElementById('status-refresh');
  if (btn) btn.addEventListener('click', run);
  run();
  setInterval(function () { if (!document.hidden) run(); }, 60000);
})();
