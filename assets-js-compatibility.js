(function () {
  var table = document.getElementById('compat-table');
  if (!table || window.__omCompatV17) return;
  window.__omCompatV17 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var filter = document.getElementById('compat-filter');
  var legend = document.getElementById('compat-legend');
  var data = null;
  function render() {
    if (!data) return;
    var f = filter ? filter.value : 'all';
    legend.innerHTML = Object.keys(data.legend).map(function (k) { return '<span class="compat-pill ' + k + '">' + data.legend[k][lang] + '</span>'; }).join('');
    var rows = data.rows.filter(function (r) { return f === 'all' || r.status === f; });
    table.innerHTML = '<thead><tr><th>' + (lang === 'ru' ? 'Цель' : 'Target') + '</th><th>' + (lang === 'ru' ? 'Статус' : 'Status') + '</th><th>' + (lang === 'ru' ? 'Примечание' : 'Note') + '</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.target + '</td><td><span class="compat-pill ' + r.status + '">' + data.legend[r.status][lang] + '</span></td><td>' + r[lang] + '</td></tr>'; }).join('') + '</tbody>';
  }
  if (filter) filter.addEventListener('change', render);
  fetch(root + 'compatibility.json?ts=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { data = j; render(); }).catch(function () { table.innerHTML = '<tbody><tr><td>—</td></tr></tbody>'; });
})();
