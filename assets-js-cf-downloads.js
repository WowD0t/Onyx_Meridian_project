(function () {
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var label = lang === 'ru' ? 'загрузок CurseForge' : 'CurseForge downloads';
  function findDownloads(o) {
    if (!o || typeof o !== 'object') return null;
    if (typeof o.downloadCount === 'number') return o.downloadCount;
    if (o.downloads && typeof o.downloads.total === 'number') return o.downloads.total;
    for (var k in o) { var v = findDownloads(o[k]); if (v !== null) return v; }
    return null;
  }
  function mount(n) {
    Array.prototype.forEach.call(document.querySelectorAll('.download-panel'), function (panel) {
      var el = panel.querySelector('[data-cf-downloads]');
      if (!el) {
        el = document.createElement('div');
        el.className = 'download-counter';
        el.innerHTML = '<strong data-cf-downloads>—</strong><span>' + label + '</span>';
        panel.appendChild(el);
      }
      var strong = el.querySelector('[data-cf-downloads]');
      if (strong && n !== null) strong.textContent = Number(n).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US');
    });
  }
  mount(null);
  fetch('https://api.cfwidget.com/1755508', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }).then(function (j) { mount(findDownloads(j)); }).catch(function () {});
})();
