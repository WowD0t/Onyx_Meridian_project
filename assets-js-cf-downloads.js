(function () {
  if (window.__omCFDownloadsV23) return;
  window.__omCFDownloadsV23 = true;
  var PROJECT_ID = 1755508;
  var API = 'https://api.cfwidget.com/' + PROJECT_ID;
  var CF_URL = 'https://www.curseforge.com/minecraft-bedrock/addons/gloamguise-false-facades';
  var CACHE_KEY = 'om-cf-stats-v1';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  function root() { return document.documentElement.getAttribute('data-root') || ''; }
  function fmt(n) { try { return Number(n).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US'); } catch (e) { return String(n); } }
  function labelFor(n) {
    n = Number(n) || 0;
    if (lang !== 'ru') return n === 1 ? 'CurseForge download' : 'CurseForge downloads';
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return 'Загрузок CurseForge';
    if (b === 1) return 'Загрузка CurseForge';
    if (b > 1 && b < 5) return 'Загрузки CurseForge';
    return 'Загрузок CurseForge';
  }
  function findTotal(o) {
    if (!o || typeof o !== 'object') return null;
    if (typeof o.downloadCount === 'number') return o.downloadCount;
    if (typeof o.total === 'number') return o.total;
    if (o.downloads && typeof o.downloads.total === 'number') return o.downloads.total;
    for (var k in o) { var v = findTotal(o[k]); if (v !== null) return v; }
    return null;
  }
  function ensure(panel) {
    var el = panel.querySelector('[data-cf-counter]');
    if (!el) {
      el = document.createElement('div');
      el.className = 'download-counter om-cf-counter';
      el.setAttribute('data-cf-counter', '');
      el.setAttribute('data-state', 'loading');
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-busy', 'true');
      el.innerHTML = '<strong data-cf-downloads class="om-skeleton">—</strong><a data-cf-label href="' + CF_URL + '" rel="noopener" target="_blank">' + labelFor(0) + '</a>';
      var target = panel.querySelector('.download-actions') || panel;
      target.appendChild(el);
    }
    return el;
  }
  function paint(el, total, state, ts, stale) {
    if (!el) return;
    var strong = el.querySelector('[data-cf-downloads]');
    var label = el.querySelector('[data-cf-label]');
    el.setAttribute('data-state', state);
    el.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    if (stale) el.setAttribute('data-stale', 'true'); else el.removeAttribute('data-stale');
    if (strong) {
      strong.classList.toggle('om-skeleton', state === 'loading');
      if (total !== null && typeof total !== 'undefined') {
        strong.textContent = fmt(total);
        var when = ts ? new Date(ts).toISOString().slice(0, 10) : '';
        strong.title = (lang === 'ru' ? 'Источник: CurseForge' : 'Source: CurseForge') + (when ? ' · ' + when : '');
      } else if (state === 'error') {
        strong.textContent = '—';
      }
    }
    if (label && total !== null && typeof total !== 'undefined') label.textContent = labelFor(total);
  }
  function panels() { return Array.prototype.slice.call(document.querySelectorAll('.download-panel')); }
  function mountAll(total, state, ts, stale) { panels().forEach(function (p) { paint(ensure(p), total, state, ts, stale); }); }
  function readCache() { try { var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return c && typeof c.total === 'number' ? c : null; } catch (e) { return null; } }
  function writeCache(total) { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ total: total, ts: Date.now(), projectId: PROJECT_ID })); } catch (e) {} }
  function fallback() {
    fetch(root() + 'cf-stats.json', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      var total = j ? findTotal(j) : null;
      if (total !== null) mountAll(total, 'fallback', j.updated ? Date.parse(j.updated) : null, true);
      else mountAll(null, 'error', null, false);
    }).catch(function () { mountAll(null, 'error', null, false); });
  }
  function delay(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }
  function live(attempt) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 8000) : null;
    return fetch(API, { headers: { 'Accept': 'application/json' }, signal: ctrl ? ctrl.signal : undefined }).then(function (r) {
      if (timer) clearTimeout(timer);
      if (r.status === 202 && attempt < 3) return delay(1500).then(function () { return live(attempt + 1); });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      if (typeof j === 'number') return j;
      var total = findTotal(j);
      if (total === null) throw new Error('No total');
      writeCache(total);
      mountAll(total, 'live', Date.now(), false);
      return total;
    }).catch(function () {
      if (timer) clearTimeout(timer);
      var c = readCache();
      if (c) mountAll(c.total, 'cache', c.ts, true);
      else fallback();
    });
  }
  function start() {
    if (!panels().length) return;
    var c = readCache();
    if (c) mountAll(c.total, 'cache', c.ts, true);
    else mountAll(null, 'loading', null, false);
    live(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.OMCFRefresh = function () { return live(0); };
})();
