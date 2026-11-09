(function () {
  if (window.__omDownloads) return;
  window.__omDownloads = true;
  var BASE = 'https://countapi.mileshilliard.com/api/v1';
  var KEY = 'onyx-meridian-gloamguise-v2-1-5-downloads';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  function labelFor(n) {
    n = Number(n) || 0;
    if (lang !== 'ru') return n === 1 ? 'Site download' : 'Site downloads';
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return 'Скачиваний с сайта';
    if (b === 1) return 'Скачивание с сайта';
    if (b > 1 && b < 5) return 'Скачивания с сайта';
    return 'Скачиваний с сайта';
  }
  var label = lang === 'ru' ? 'Запросы с сайта' : 'Site download clicks';
  var sequence = 0, applied = 0;
  function fmt(n) { try { return Number(n).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US'); } catch (e) { return String(n); } }
  function render(n) { Array.prototype.forEach.call(document.querySelectorAll('[data-download-count]'), function (el) { el.textContent = fmt(n); }); Array.prototype.forEach.call(document.querySelectorAll('[data-download-label]'), function (el) { el.textContent = label; }); }
  function request(action) {
    var id = ++sequence;
    return fetch(BASE + '/' + action + '/' + KEY, { headers: { 'Accept': 'application/json' }, cache: 'no-store', keepalive: action === 'hit' }).then(function (r) {
      if (!r.ok) throw new Error('Counter unavailable'); return r.json();
    }).then(function (j) {
      var n = j && j.value; if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) throw new Error('Invalid counter');
      if (id >= applied) { applied = id; render(n); } return n;
    }).catch(function () { if (id >= applied) { applied = id; Array.prototype.forEach.call(document.querySelectorAll('[data-download-count]'), function (el) { el.textContent = '—'; }); } return null; });
  }
  function get() { return request('get'); }
  function mount() {
    Array.prototype.forEach.call(document.querySelectorAll('.download-panel'), function (panel) {
      if (panel.querySelector('.download-counter')) return;
      var div = document.createElement('div');
      div.className = 'download-counter';
      div.innerHTML = '<strong data-download-count>—</strong><span data-download-label>' + label + '</span>';
      panel.appendChild(div);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.download-counter-inline'), function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    get();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[download]') : null;
    if (!a || !/\.mcaddon($|\?)/i.test(a.getAttribute('href') || '')) return;
    // This records a click, not a verified completed download. The file remains usable if the service is unavailable.
    request('hit');
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  window.OMDownloadsRefresh = get;
})();
document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-copy-sha]');
  if (!btn) return;
  var sha = btn.getAttribute('data-copy-sha');
  function done(ok) {
    var old = btn.textContent;
    btn.textContent = ok ? '✓' : '!';
    setTimeout(function () { btn.textContent = old; }, 1200);
    if (window.OMToast) window.OMToast.show({ kind: ok ? 'success' : 'warning', title: document.documentElement.getAttribute('data-lang') === 'ru' ? (ok ? 'SHA-256 скопирован' : 'Не удалось скопировать') : (ok ? 'SHA-256 copied' : 'Copy failed'), body: sha.slice(0, 16) + '…', timeout: 2600 });
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(sha).then(function () { done(true); }, function () { done(false); });
  else done(false);
});
