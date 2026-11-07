(function () {
  var input = document.getElementById('verify-file');
  var result = document.getElementById('verify-result');
  var out = document.getElementById('verify-hash');
  if (!input || !result) return;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var EXPECTED = '7c37ebf920bee57d3141b95b61bb3516f683553a137b38984cca093fa4d4318c';
  var T = lang === 'ru' ? { ok: 'Файл совпадает с официальной сборкой v2.1.5.', bad: 'Хеш не совпадает. Скачайте файл из официального источника.', reading: 'Чтение файла…', size: 'Размер' } : { ok: 'File matches the official v2.1.5 build.', bad: 'Hash does not match. Download the file from an official source.', reading: 'Reading file…', size: 'Size' };
  input.addEventListener('change', function () {
    var f = input.files && input.files[0];
    if (!f) return;
    result.className = 'om-verify-result';
    result.textContent = T.reading;
    f.arrayBuffer().then(function (buf) { return crypto.subtle.digest('SHA-256', buf); }).then(function (hash) {
      var hex = Array.prototype.map.call(new Uint8Array(hash), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      if (out) out.textContent = hex;
      if (hex === EXPECTED) { result.className = 'om-verify-result ok'; result.textContent = T.ok + ' ' + T.size + ': ' + f.size + ' B.'; }
      else { result.className = 'om-verify-result bad'; result.textContent = T.bad + ' ' + T.size + ': ' + f.size + ' B.'; }
    }).catch(function () { result.className = 'om-verify-result bad'; result.textContent = T.bad; });
  });
})();
