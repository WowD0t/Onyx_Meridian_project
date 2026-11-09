(function () {
  var currentEl = document.getElementById('release-current');
  if (!currentEl || window.__omReleasesV17) return;
  window.__omReleasesV17 = true;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var langroot = root ? '' : '';
  var T = lang === 'ru' ? { current: 'Текущий релиз', download: 'Скачать', verify: 'Проверить файл', copy: 'Копировать SHA-256', size: 'Размер', date: 'Дата', min: 'Минимум Bedrock', mirrors: 'Зеркала', empty: 'Архивные версии пока не опубликованы.', version: 'Версия', notes: 'Примечания' } : { current: 'Current release', download: 'Download', verify: 'Verify file', copy: 'Copy SHA-256', size: 'Size', date: 'Date', min: 'Minimum Bedrock', mirrors: 'Mirrors', empty: 'No archive versions published yet.', version: 'Version', notes: 'Notes' };
  function fmtSize(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB'; }
  function card(r, isCurrent) {
    var el = document.createElement('article');
    el.className = 'release-card-v17' + (isCurrent ? ' current' : '');
    el.id = r.version;
    var mirrors = (r.mirrors || []).map(function (m) { return '<a href="' + m.url + '" rel="noopener" target="_blank">' + m.label + '</a>'; }).join('');
    el.innerHTML = '<div class="release-card-head"><div><span class="eyebrow">' + (isCurrent ? T.current : T.version) + '</span><h2>Gloamguise v' + r.version + '</h2></div><span class="release-channel">' + r.channel + '</span></div><p class="release-notes">' + (lang === 'ru' ? r.notes_ru : r.notes_en) + '</p><div class="dm-grid"><div><span class="k">' + T.size + '</span><span class="v">' + fmtSize(r.size) + '</span></div><div><span class="k">' + T.date + '</span><span class="v">' + r.date + '</span></div><div><span class="k">' + T.min + '</span><span class="v">' + r.min_bedrock + '+</span></div></div><div class="sha-row"><span class="k">SHA-256</span><code class="v">' + r.sha256 + '</code><button type="button" class="om-copy-sha" data-copy-sha="' + r.sha256 + '">' + T.copy + '</button></div><div class="release-actions"><a class="btn btn-primary" href="' + root + r.file + '" download>' + T.download + '</a><a class="btn btn-ghost" href="' + (root ? '' : '') + 'verify.html">' + T.verify + '</a>' + mirrors + '</div>';
    return el;
  }
  fetch(root + 'releases.json?ts=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
    var releases = j.releases || [];
    var cur = releases.filter(function (r) { return r.version === j.current; })[0] || releases[0];
    if (cur) currentEl.appendChild(card(cur, true));
    var hist = document.getElementById('release-history');
    var old = releases.filter(function (r) { return r !== cur; }).concat(j.history || []);
    if (!old.length) hist.innerHTML = '<div class="om-library-empty"><strong>' + T.empty + '</strong></div>';
    else old.forEach(function (r) { hist.appendChild(card(r, false)); });
  }).catch(function () { currentEl.innerHTML = '<div class="om-library-empty"><strong>—</strong></div>'; });
})();
