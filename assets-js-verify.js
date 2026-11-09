(function () {
  var input = document.getElementById('verify-file');
  var result = document.getElementById('verify-result');
  var out = document.getElementById('verify-hash');
  if (!result) return;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var EXPECTED = '7c37ebf920bee57d3141b95b61bb3516f683553a137b38984cca093fa4d4318c';
  var T = lang === 'ru' ? { ok: 'Файл совпадает с официальной сборкой v2.1.5.', bad: 'Хеш не совпадает. Скачайте файл из официального источника.', reading: 'Чтение файла…', size: 'Размер', choose: 'Выбрать файл', local: 'Файл проверяется локально и никуда не загружается.', drop: 'Перетащите .mcaddon сюда', or: 'или', busy: 'Проверка…' } : { ok: 'File matches the official v2.1.5 build.', bad: 'Hash does not match. Download the file from an official source.', reading: 'Reading file…', size: 'Size', choose: 'Choose file', local: 'The file is checked locally and never uploaded.', drop: 'Drop .mcaddon here', or: 'or', busy: 'Checking…' };
  function handle(f) {
    if (!f) return;
    result.className = 'om-verify-result';
    result.textContent = T.reading;
    f.arrayBuffer().then(function (buf) { return crypto.subtle.digest('SHA-256', buf); }).then(function (hash) {
      var hex = Array.prototype.map.call(new Uint8Array(hash), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      if (out) { out.hidden = false; out.textContent = hex; }
      if (hex === EXPECTED) { result.className = 'om-verify-result ok'; result.textContent = T.ok + ' ' + T.size + ': ' + f.size + ' B.'; }
      else { result.className = 'om-verify-result bad'; result.textContent = T.bad + ' ' + T.size + ': ' + f.size + ' B.'; }
    }).catch(function () { result.className = 'om-verify-result bad'; result.textContent = T.bad; });
  }
  var zone = document.createElement('div');
  zone.className = 'om-verify-drop';
  zone.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m6 10 6-6 6 6"/><path d="M4 20h16"/></svg><strong>' + T.drop + '</strong><span>' + T.or + '</span>';
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'btn btn-ghost'; btn.textContent = T.choose;
  zone.appendChild(btn);
  var note = document.createElement('p');
  note.className = 'om-verify-note';
  note.textContent = T.local;
  var anchor = input ? input.closest('label') || input : result;
  anchor.parentNode.insertBefore(zone, anchor);
  anchor.parentNode.insertBefore(note, zone.nextSibling);
  if (input) { input.hidden = true; input.addEventListener('change', function () { handle(input.files && input.files[0]); }); }
  btn.addEventListener('click', function () {
    if (window.OMFilePicker) window.OMFilePicker.choose({ accept: '.mcaddon,.zip', multiple: false }).then(function (fl) { if (fl && fl[0]) handle(fl[0]); });
    else if (input) input.click();
  });
  ['dragenter', 'dragover'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('drag'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('drag'); }); });
  zone.addEventListener('drop', function (e) { var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; handle(f); });
})();
