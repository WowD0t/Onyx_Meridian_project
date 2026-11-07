(function () {
  if (window.__omDownloads) return;
  window.__omDownloads = true;
  var BASE = 'https://countapi.mileshilliard.com/api/v1';
  var KEY = 'onyx-meridian-gloamguise-v2-1-5-downloads';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var label = lang === 'ru' ? 'скачиваний с сайта' : 'site downloads';
  var countedLabel = lang === 'ru' ? 'Скачивание засчитано' : 'Download counted';
  function hash(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i); return (h >>> 0).toString(36); }
  var fp = hash([navigator.userAgent, navigator.language, screen.width + 'x' + screen.height, new Date().getTimezoneOffset(), navigator.platform || ''].join('|'));
  var storeKey = 'om-dl-v2-1-5-' + fp;
  function cookieGet() { try { return document.cookie.split('; ').some(function (c) { return c.indexOf(storeKey + '=1') === 0; }); } catch (e) { return false; } }
  function cookieSet() { try { document.cookie = storeKey + '=1; max-age=31536000; path=/; SameSite=Lax'; } catch (e) {} }
  function idbCheck(cb) {
    try {
      var req = indexedDB.open('om-downloads', 1);
      req.onupgradeneeded = function () { req.result.createObjectStore('keys'); };
      req.onsuccess = function () {
        var db = req.result;
        var tx = db.transaction('keys', 'readonly');
        var get = tx.objectStore('keys').get(storeKey);
        get.onsuccess = function () { cb(!!get.result); };
        get.onerror = function () { cb(false); };
      };
      req.onerror = function () { cb(false); };
    } catch (e) { cb(false); }
  }
  function idbSet() {
    try {
      var req = indexedDB.open('om-downloads', 1);
      req.onupgradeneeded = function () { req.result.createObjectStore('keys'); };
      req.onsuccess = function () { var db = req.result; var tx = db.transaction('keys', 'readwrite'); tx.objectStore('keys').put(1, storeKey); };
    } catch (e) {}
  }
  function localGet() { try { return localStorage.getItem(storeKey) === '1' || sessionStorage.getItem(storeKey) === '1'; } catch (e) { return false; } }
  function localSet() { try { localStorage.setItem(storeKey, '1'); sessionStorage.setItem(storeKey, '1'); } catch (e) {} }
  function already(cb) {
    if (localGet() || cookieGet()) { cb(true); return; }
    idbCheck(function (v) { cb(v); });
  }
  function mark() { localSet(); cookieSet(); idbSet(); }
  function fmt(n) { try { return Number(n).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US'); } catch (e) { return String(n); } }
  function render(n) { Array.prototype.forEach.call(document.querySelectorAll('[data-download-count]'), function (el) { el.textContent = fmt(n); }); }
  function get() { fetch(BASE + '/get/' + KEY, { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }).then(function (j) { if (j && typeof j.value !== 'undefined') render(j.value); }).catch(function () {}); }
  function hit() {
    return fetch(BASE + '/hit/' + KEY, { headers: { 'Accept': 'application/json' }, keepalive: true }).then(function (r) { return r.json(); }).then(function (j) { if (j && typeof j.value !== 'undefined') render(j.value); return j; }).catch(function () {});
  }
  function mount() {
    Array.prototype.forEach.call(document.querySelectorAll('.download-panel'), function (panel) {
      if (panel.querySelector('.download-counter')) return;
      var div = document.createElement('div');
      div.className = 'download-counter';
      div.innerHTML = '<strong data-download-count>—</strong><span>' + label + '</span>';
      panel.appendChild(div);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.hero-actions'), function (actions) {
      if (actions.querySelector('.download-counter-inline')) return;
      var a = actions.querySelector('a[download]');
      if (!a) return;
      var span = document.createElement('span');
      span.className = 'download-counter-inline';
      span.innerHTML = '<strong data-download-count>—</strong> ' + label;
      actions.appendChild(span);
    });
    get();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[download]') : null;
    if (!a || !/\.mcaddon($|\?)/i.test(a.getAttribute('href') || '')) return;
    already(function (yes) {
      if (yes) return;
      mark();
      hit().then(function () {
        try {
          var toast = document.getElementById('toast');
          if (toast) { toast.textContent = countedLabel; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 1600); }
        } catch (err) {}
      });
    });
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
