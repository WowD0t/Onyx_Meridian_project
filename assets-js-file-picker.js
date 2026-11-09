(function () {
  if (window.__omFilePickerV15) return;
  window.__omFilePickerV15 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? { title: 'Прикрепить файлы', drop: 'Перетащите файлы сюда или нажмите для выбора', hint: 'Скриншоты, логи, документы, миры. До 25 МБ суммарно.', choose: 'Откуда выбрать файл?', hintSheet: 'Выберите источник. Доступные приложения зависят от устройства и браузера.', files: 'Файлы', gallery: 'Фото и видео', camera: 'Камера', cancel: 'Отмена', tooBig: 'Превышен лимит 25 МБ суммарно.', tooMany: 'Можно прикрепить не более 10 файлов.', badType: 'Этот тип файла не поддерживается:', remove: 'Удалить файл', uploading: 'Загрузка…', done: 'Готово', failed: 'Ошибка загрузки' } : { title: 'Attach files', drop: 'Drag files here or click to choose', hint: 'Screenshots, logs, documents, worlds. Up to 25 MB total.', choose: 'Choose a file source', hintSheet: 'Pick a source. Available apps depend on your device and browser.', files: 'Files', gallery: 'Photos & videos', camera: 'Camera', cancel: 'Cancel', tooBig: 'Total limit is 25 MB.', tooMany: 'You can attach up to 10 files.', badType: 'This file type is not supported:', remove: 'Remove file', uploading: 'Uploading…', done: 'Done', failed: 'Upload failed' };
  var MAX = 25 * 1024 * 1024, MAX_FILES = 10;
  var OK = /\.(png|jpe?g|gif|webp|mp4|webm|mov|txt|log|json|zip|mcaddon|mcpack|mcworld|pdf|csv|md|vtt)$/i;
  function fmt(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }
  function ext(n) { var m = n.match(/\.([a-z0-9]+)$/i); return m ? m[1].toUpperCase().slice(0, 4) : 'FILE'; }
  function toast(msg, kind) { if (window.OMToast) window.OMToast.show({ title: T.title, body: msg, kind: kind || 'warning' }); }
  function makeInputs(opts) {
    var accept = opts.accept || '';
    var multiple = opts.multiple !== false;
    var a = document.createElement('input'); a.type = 'file'; a.hidden = true; a.multiple = multiple; if (accept) a.accept = accept;
    var b = document.createElement('input'); b.type = 'file'; b.hidden = true; b.multiple = multiple; b.accept = opts.galleryAccept || 'image/*,video/*';
    var c = document.createElement('input'); c.type = 'file'; c.hidden = true; c.accept = 'image/*'; c.capture = 'environment';
    return [a, b, c];
  }
  function openSheet(opts, onPick) {
    var overlay = document.createElement('div');
    overlay.className = 'om-sheet-overlay';
    overlay.hidden = true;
    overlay.innerHTML = '<div class="om-sheet" role="dialog" aria-modal="true" aria-label="' + T.choose + '"><h3>' + T.choose + '</h3><p>' + T.hintSheet + '</p><div class="om-sheet-options"><button type="button" class="om-sheet-option" data-src="files"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' + T.files + '</button><button type="button" class="om-sheet-option" data-src="gallery"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-4 4 3 4-4 5 5"/></svg>' + T.gallery + '</button><button type="button" class="om-sheet-option" data-src="camera"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3"/></svg>' + T.camera + '</button></div><button type="button" class="btn btn-ghost om-sheet-cancel">' + T.cancel + '</button></div>';
    document.body.appendChild(overlay);
    var sheet = overlay.querySelector('.om-sheet');
    var prev = document.activeElement;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('open'); sheet.querySelector('.om-sheet-option').focus(); });
    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () { overlay.remove(); if (prev && prev.focus) prev.focus(); }, 300);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.om-sheet-cancel').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      var b = e.target.closest('[data-src]');
      if (!b) return;
      var src = b.getAttribute('data-src');
      close();
      onPick(src);
    });
    return close;
  }
  function choose(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var inputs = makeInputs(opts);
      inputs.forEach(function (inp) { document.body.appendChild(inp); });
      var done = false;
      function finish(fl) { if (done) return; done = true; inputs.forEach(function (i) { i.remove(); }); resolve(fl); }
      inputs.forEach(function (inp) { inp.addEventListener('change', function () { finish(inp.files); }); });
      openSheet(opts, function (src) {
        var inp = src === 'gallery' ? inputs[1] : src === 'camera' ? inputs[2] : inputs[0];
        inp.click();
        setTimeout(function () { if (!done && !inp.files.length) { } }, 0);
      });
    });
  }
  function create(opts) {
    opts = opts || {};
    var files = [], busy = false;
    var wrap = document.createElement('div'); wrap.className = 'om-filepicker';
    var zone = document.createElement('div'); zone.className = 'om-dropzone'; zone.setAttribute('role', 'button'); zone.tabIndex = 0;
    zone.innerHTML = '<strong>' + T.drop + '</strong><span>' + (opts.hint || T.hint) + '</span>';
    var list = document.createElement('div'); list.className = 'om-filelist';
    wrap.appendChild(zone); wrap.appendChild(list);
    var inputs = makeInputs(opts);
    inputs.forEach(function (i) { wrap.appendChild(i); });
    function total() { return files.reduce(function (s, f) { return s + f.file.size; }, 0); }
    function addFiles(fl) {
      if (busy) return;
      Array.prototype.forEach.call(fl, function (f) {
        var ok = opts.accept ? new RegExp(opts.accept.replace(/\./g, '\\.').replace(/,/g, '|') + '$', 'i').test(f.name) : OK.test(f.name);
        if (!ok) { toast(T.badType + ' ' + f.name); return; }
        if (files.length >= MAX_FILES) { toast(T.tooMany); return; }
        if (total() + f.size > MAX) { toast(T.tooBig); return; }
        if (files.some(function (x) { return x.file.name === f.name && x.file.size === f.size; })) return;
        var item = { file: f, url: null, status: 'pending', preview: null };
        if (/^image\//.test(f.type)) item.preview = URL.createObjectURL(f);
        files.push(item); renderItem(item);
      });
      if (opts.onChange) opts.onChange(files);
    }
    function renderItem(item) {
      var el = document.createElement('div'); el.className = 'om-fileitem';
      el.innerHTML = '<div class="om-fileitem-ico">' + (item.preview ? '<img alt=""/>' : ext(item.file.name)) + '</div><div class="om-fileitem-meta"><strong></strong><small>' + fmt(item.file.size) + '</small><div class="om-fileitem-bar"><i></i></div></div><button type="button" class="om-fileitem-remove" aria-label="' + T.remove + '">×</button>';
      if (item.preview) el.querySelector('img').src = item.preview;
      el.querySelector('strong').textContent = item.file.name;
      el.querySelector('.om-fileitem-remove').addEventListener('click', function () {
        if (busy) return;
        if (item.preview) URL.revokeObjectURL(item.preview);
        files = files.filter(function (x) { return x !== item; });
        el.remove();
        if (opts.onChange) opts.onChange(files);
      });
      item.el = el; list.appendChild(el);
    }
    zone.addEventListener('click', function () { if (!busy) openSheet(opts, function (src) { (src === 'gallery' ? inputs[1] : src === 'camera' ? inputs[2] : inputs[0]).click(); }); });
    zone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zone.click(); } });
    ['dragover', 'dragenter'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('drag'); }); });
    zone.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
    inputs.forEach(function (inp) { inp.addEventListener('change', function () { addFiles(inp.files); inp.value = ''; }); });
    return {
      el: wrap,
      getFiles: function () { return files; },
      setBusy: function (v) { busy = v; zone.style.pointerEvents = v ? 'none' : ''; zone.style.opacity = v ? '.6' : ''; },
      setProgress: function (item, p, state) {
        if (!item.el) return;
        item.el.querySelector('.om-fileitem-bar i').style.width = Math.round(p * 100) + '%';
        var small = item.el.querySelector('small');
        if (state === 'done') small.textContent = fmt(item.file.size) + ' · ' + T.done;
        else if (state === 'failed') small.textContent = fmt(item.file.size) + ' · ' + T.failed;
        else if (state === 'uploading') small.textContent = fmt(item.file.size) + ' · ' + T.uploading;
      },
      clear: function () { files.forEach(function (i) { if (i.preview) URL.revokeObjectURL(i.preview); }); files = []; list.innerHTML = ''; if (opts.onChange) opts.onChange(files); }
    };
  }
  window.OMFilePicker = { create: create, choose: choose };
})();
