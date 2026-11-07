(function () {
  var input = document.getElementById('site-search');
  var box = document.getElementById('site-search-results');
  var count = document.getElementById('site-search-count');
  if (!input || !box || !window.OM_INDEX) return;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? { empty: 'Ничего не найдено.', start: 'Введите запрос, чтобы найти страницы сайта и вики.', results: 'результатов' } : { empty: 'Nothing found.', start: 'Type a query to search site and wiki pages.', results: 'results' };
  var items = window.OM_INDEX.filter(function (i) { return i.lang === lang; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) { box.innerHTML = '<p class="om-settings-hint">' + T.start + '</p>'; if (count) count.textContent = ''; return; }
    var res = items.filter(function (i) { return (i.title + ' ' + i.crumb + ' ' + i.text).toLowerCase().indexOf(q) !== -1; }).slice(0, 40);
    if (count) count.textContent = res.length + ' ' + T.results;
    if (!res.length) { box.innerHTML = '<p class="om-settings-hint">' + T.empty + '</p>'; return; }
    box.innerHTML = res.map(function (i) { var text = i.text || ''; var pos = text.toLowerCase().indexOf(q); var snippet = pos >= 0 ? text.slice(Math.max(0, pos - 60), pos + 140) : text.slice(0, 180); return '<a class="om-search-item" href="' + esc(i.url) + '"><small>' + esc(i.crumb || '') + '</small><strong>' + esc(i.title) + '</strong><p>' + esc(snippet) + '…</p></a>'; }).join('');
  }
  var params = new URLSearchParams(location.search);
  if (params.get('q')) { input.value = params.get('q'); render(input.value); }
  else render('');
  var timer = null;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { render(input.value); history.replaceState(null, '', input.value ? '?q=' + encodeURIComponent(input.value) : location.pathname); }, 160); });
})();
