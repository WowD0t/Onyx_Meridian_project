(function () {
  var form = document.getElementById('support-form');
  if (!form || window.__omSupportV17) return;
  window.__omSupportV17 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var cfg = window.OM_FORM || {};
  var S = {
    en: { required: 'Please complete the required fields correctly.', bademail: 'Enter a valid reply email address.', minmessage: 'Please describe the request in at least 20 characters.', sendingPrimary: 'Sending through the primary channel…', sendingFallback: 'Primary channel unavailable. Sending through fallback…', send: 'Send request', ok: 'Request sent successfully.', okFallback: 'Request sent through the fallback channel.', fail: 'Could not send the request. Try again or use the email app button.', uploading: 'Uploading attachments for fallback…', attachFail: 'An attachment failed to upload. The request was not sent; remove the file or try again.', needConsent: 'Please confirm the attachment notice.', gasTooLarge: 'Attachments are too large for the primary channel. Remove files or use smaller files.', primaryBadge: 'Primary: Google Apps Script', fallbackBadge: 'Fallback: Web3Forms', consentGas: 'Attachments are sent directly to the studio mailbox. If the fallback channel is used, they may be uploaded to tmpfiles.org as temporary public links.', consentLinks: 'I understand that attachments are uploaded to tmpfiles.org and sent to the studio as temporary public links.', duplicateNote: 'If the primary channel accepted the request but the response was lost, the fallback may create a duplicate. The request id is included for deduplication.' },
    ru: { required: 'Пожалуйста, правильно заполните обязательные поля.', bademail: 'Введите корректный адрес почты для ответа.', minmessage: 'Опишите обращение минимум в 20 символах.', sendingPrimary: 'Отправка через основной канал…', sendingFallback: 'Основной канал недоступен. Отправка через резерв…', send: 'Отправить обращение', ok: 'Обращение успешно отправлено.', okFallback: 'Обращение отправлено через резервный канал.', fail: 'Не удалось отправить обращение. Попробуйте ещё раз или откройте почтовое приложение.', uploading: 'Загрузка вложений для резерва…', attachFail: 'Не удалось загрузить вложение. Обращение не отправлено; удалите файл или попробуйте ещё раз.', needConsent: 'Подтвердите уведомление о вложениях.', gasTooLarge: 'Вложения слишком большие для основного канала. Удалите файлы или используйте файлы меньше.', primaryBadge: 'Основной: Google Apps Script', fallbackBadge: 'Резерв: Web3Forms', consentGas: 'Вложения отправляются напрямую на почту студии. При использовании резервного канала они могут быть загружены на tmpfiles.org как временные публичные ссылки.', consentLinks: 'Я понимаю, что вложения загружаются на tmpfiles.org и отправляются студии как временные публичные ссылки.', duplicateNote: 'Если основной канал принял обращение, но ответ потерялся, резерв может создать дубль. Идентификатор обращения добавлен для дедупликации.' }
  }[lang];
  var RU = {
    topic: { bug: 'Ошибка / баг', question: 'Вопрос / помощь', permission: 'Запрос разрешения', licence: 'Вопрос по лицензии', collab: 'Сотрудничество / заказ', website: 'Проблема с сайтом', other: 'Другое' },
    project: { gloamguise: 'Gloamguise: False Facades', future: 'Другой / будущий аддон', studio: 'Студия / сайт', other: 'Другое' },
    platform: { windows: 'Windows', android: 'Android', ios: 'iOS', console: 'Консоль', server: 'Сервер / Realm', other: 'Другое' }
  };
  var topic = document.getElementById('topic'), project = document.getElementById('project'), summary = document.getElementById('summary'), message = document.getElementById('message');
  var email = document.getElementById('email'), nameInput = document.getElementById('name'), consent = document.getElementById('consent');
  var status = document.getElementById('support-status'), submit = document.getElementById('support-submit'), mailto = document.getElementById('support-mailto'), success = document.getElementById('support-success');
  var count = document.getElementById('message-count'), keyInput = document.getElementById('web3forms-key'), redirect = document.getElementById('support-redirect');
  var draftKey = 'om-support-draft-v3', picker = null, uploadConsent = null, sending = false;
  var gasEnabled = !!(cfg.appsScriptEndpoint && /script\.google\.com|script\.googleusercontent\.com/.test(cfg.appsScriptEndpoint));
  var consentMain = lang === 'ru'
    ? (gasEnabled ? 'Я соглашаюсь, что моё сообщение и почта для ответа обрабатываются основным каналом Google Apps Script и доставляются на почту студии. При сбое может использоваться резервный канал. Я не буду отправлять пароли, платёжные данные или личные файлы миров.' : 'Я соглашаюсь, что моё сообщение и почта для ответа обрабатываются резервным каналом Web3Forms и доставляются на почту студии. Я не буду отправлять пароли, платёжные данные или личные файлы миров.')
    : (gasEnabled ? 'I agree that my message and reply email are processed by the primary Google Apps Script channel and delivered to the studio mailbox. A fallback channel may be used if the primary fails. I will not send passwords, payment data or personal world files.' : 'I agree that my message and reply email are processed by the fallback Web3Forms channel and delivered to the studio mailbox. I will not send passwords, payment data or personal world files.');
  if (consent) {
    var consentLabel = consent.closest('label');
    var consentSpan = consentLabel && consentLabel.querySelector('span');
    if (consentSpan) consentSpan.innerHTML = consentMain + ' <span class="req">*</span>';
  }
  if (window.OMFilePicker) {
    picker = window.OMFilePicker.create({ onChange: syncAttachmentConsent, hint: gasEnabled ? (lang === 'ru' ? 'Скриншоты, логи, документы. До 8 МБ суммарно для основного канала.' : 'Screenshots, logs, documents. Up to 8 MB total for the primary channel.') : undefined });
    var msgSection = message ? message.closest('.support-section') : null;
    if (msgSection) msgSection.appendChild(picker.el); else form.appendChild(picker.el);
    var privacy = document.createElement('div');
    privacy.className = 'om-support-privacy';
    privacy.innerHTML = '<label><input type="checkbox" id="om-upload-consent"/><span>' + (gasEnabled ? S.consentGas : S.consentLinks) + '</span></label>';
    picker.el.appendChild(privacy);
    uploadConsent = privacy.querySelector('input');
    privacy.hidden = true;
    var badge = document.createElement('div');
    badge.id = 'support-channel';
    badge.className = 'support-channel-badge';
    badge.innerHTML = '<span class="status-pill ok">' + S.primaryBadge + '</span><span class="status-pill warn">' + S.fallbackBadge + '</span>';
    if (!gasEnabled) badge.firstChild.classList.replace('ok', 'unknown');
    picker.el.insertBefore(badge, privacy);
  }
  if (keyInput && cfg.accessKey) keyInput.value = cfg.accessKey;
  if (redirect) redirect.value = window.location.origin + window.location.pathname + '?sent=1';
  function syncAttachmentConsent() {
    if (!picker || !uploadConsent) return;
    var has = picker.getFiles().length > 0;
    uploadConsent.closest('.om-support-privacy').hidden = !has;
    if (!has) uploadConsent.checked = false;
  }
  function setStatus(text, kind) { if (!status) return; status.textContent = text || ''; status.className = 'support-status-v11' + (kind ? ' ' + kind : ''); }
  function val(el) { return el ? String(el.value || '').trim() : ''; }
  function label(map, v) { return RU[map][v] || v || '—'; }
  function syncCount() { if (count && message) count.textContent = String(message.value.length); }
  function newId() { try { return crypto.randomUUID(); } catch (e) { return 'om-' + Date.now() + '-' + Math.random().toString(16).slice(2); } }
  function buildSubject(id) {
    var parts = ['Обращение · Onyx Meridian'];
    if (topic && topic.value) parts.push(label('topic', topic.value));
    if (project && project.value) parts.push(label('project', project.value));
    if (summary && summary.value) parts.push(val(summary));
    parts.push('ID ' + String(id).slice(0, 8));
    return parts.join(' — ');
  }
  function buildRussianMessage(attachments, id, fallbackReason) {
    var now = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var date = pad(now.getDate()) + '.' + pad(now.getMonth() + 1) + '.' + now.getFullYear() + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    var line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', thin = '──────────────────────────────';
    var out = [];
    out.push(line); out.push('ОБРАЩЕНИЕ В ONYX MERIDIAN'); out.push(line);
    out.push('Идентификатор: ' + id);
    out.push('Дата: ' + date);
    out.push('Тема: ' + label('topic', val(topic)));
    out.push('Проект: ' + label('project', val(project)));
    out.push('Кратко: ' + (val(summary) || '—'));
    out.push(thin); out.push('СООБЩЕНИЕ'); out.push(thin); out.push(val(message) || '—');
    out.push(thin); out.push('КОНТАКТ'); out.push(thin);
    out.push('Имя / сообщество: ' + (val(nameInput) || '—'));
    out.push('Почта для ответа: ' + val(email));
    out.push(thin); out.push('ОКРУЖЕНИЕ'); out.push(thin);
    out.push('Платформа: ' + label('platform', val(document.getElementById('platform'))));
    out.push('Версия Minecraft: ' + (val(document.getElementById('mcversion')) || '—'));
    out.push('Версия аддона: ' + (val(document.getElementById('addonversion')) || '—'));
    if (attachments && attachments.length) {
      out.push(thin); out.push('ВЛОЖЕНИЯ (' + attachments.length + ')'); out.push(thin);
      attachments.forEach(function (a, i) { out.push((i + 1) + '. ' + a.name + ' — ' + (a.url || 'прямое вложение к письму')); });
      if (attachments.some(function (a) { return a.url; })) out.push('Примечание: ссылки временные и публичные. Скачайте файлы как можно скорее.');
    }
    out.push(thin);
    out.push('Согласие на обработку: ' + (consent && consent.checked ? 'да' : 'нет'));
    out.push('Язык сайта: ' + (lang === 'ru' ? 'русский' : 'английский'));
    out.push('Канал: ' + (fallbackReason ? 'резерв Web3Forms (' + fallbackReason + ')' : 'основной Google Apps Script'));
    if (fallbackReason) out.push(S.duplicateNote);
    out.push(line); out.push('Отправлено через форму поддержки Onyx Meridian');
    return out.join('\n');
  }
  function saveDraft() {
    try {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || ['access_key', 'botcheck', 'subject', 'from_name', 'redirect'].indexOf(el.name) >= 0 || ['submit', 'reset', 'button', 'file'].indexOf(el.type) >= 0) return;
        data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      });
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch (e) {}
  }
  function restoreDraft() {
    try {
      if (new URLSearchParams(window.location.search).get('sent') === '1') {
        localStorage.removeItem(draftKey);
        if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }
      var data = JSON.parse(localStorage.getItem(draftKey) || '{}');
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !(el.name in data)) return;
        if (el.type === 'checkbox') el.checked = !!data[el.name];
        else if (el.type !== 'file') el.value = data[el.name];
      });
    } catch (e) {}
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function validate() {
    if (!form.checkValidity()) { setStatus(S.required, 'error'); form.reportValidity(); return false; }
    if (email && !validEmail(val(email))) { setStatus(S.bademail, 'error'); email.focus(); return false; }
    if (message && val(message).length < 20) { setStatus(S.minmessage, 'error'); message.focus(); return false; }
    if (consent && !consent.checked) { setStatus(S.required, 'error'); consent.focus(); return false; }
    if (picker && picker.getFiles().length && uploadConsent && !uploadConsent.checked) { setStatus(S.needConsent, 'error'); uploadConsent.focus(); return false; }
    setStatus('');
    return true;
  }
  function readBase64(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result).split(',')[1] || ''); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }
  function postJson(url, payload, timeout) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, timeout || cfg.requestTimeoutMs || 30000);
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: ctrl.signal, redirect: 'follow' }).then(function (r) {
      clearTimeout(t);
      return r.text().then(function (text) {
        var j = null;
        try { j = JSON.parse(text); } catch (e) {}
        if (!r.ok || !j || j.ok !== true) { var err = new Error('primary'); err.explicit = !!j; throw err; }
        return j;
      });
    }).catch(function (e) { clearTimeout(t); throw e; });
  }
  function uploadFile(item) {
    return new Promise(function (resolve, reject) {
      var fd = new FormData();
      fd.append('file', item.file, item.file.name);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', cfg.uploadEndpoint || 'https://tmpfiles.org/api/v1/upload');
      xhr.timeout = 120000;
      if (picker) picker.setProgress(item, 0, 'uploading');
      xhr.upload.onprogress = function (e) { if (e.lengthComputable && picker) picker.setProgress(item, e.loaded / e.total, 'uploading'); };
      xhr.onload = function () {
        try {
          var j = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && j && j.status === 'success' && j.data && j.data.url) {
            var direct = j.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            if (picker) picker.setProgress(item, 1, 'done');
            resolve({ name: item.file.name, url: direct });
            return;
          }
        } catch (e) {}
        if (picker) picker.setProgress(item, 1, 'failed');
        reject(new Error('upload'));
      };
      xhr.onerror = function () { if (picker) picker.setProgress(item, 1, 'failed'); reject(new Error('upload')); };
      xhr.ontimeout = function () { if (picker) picker.setProgress(item, 1, 'failed'); reject(new Error('upload')); };
      xhr.send(fd);
    });
  }
  function sendFallback(id, reason) {
    var files = picker ? picker.getFiles() : [];
    var chain = Promise.resolve([]);
    if (files.length) {
      setStatus(S.uploading, 'info');
      files.forEach(function (item) { chain = chain.then(function (arr) { return uploadFile(item).then(function (meta) { arr.push(meta); return arr; }); }); });
    }
    return chain.then(function (attachments) {
      var payload = {
        access_key: cfg.accessKey || '',
        subject: buildSubject(id),
        from_name: val(nameInput) || 'Onyx Meridian site',
        email: val(email),
        message: buildRussianMessage(attachments, id, reason),
        botcheck: ''
      };
      return fetch(cfg.endpoint || 'https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || j.success !== true) throw new Error('fallback');
        return { fallback: true };
      });
    });
  }
  function finish(result) {
    sending = false;
    if (submit) { submit.disabled = false; submit.textContent = S.send; }
    if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    setStatus(result && result.fallback ? S.okFallback : S.ok, 'success');
    try { localStorage.removeItem(draftKey); } catch (e) {}
    if (picker) picker.clear();
    if (window.OMToast) window.OMToast.show({ kind: 'success', title: result && result.fallback ? S.okFallback : S.ok, timeout: 5000 });
  }
  function fail(msg) {
    sending = false;
    if (submit) { submit.disabled = false; submit.textContent = S.send; }
    setStatus(msg || S.fail, 'error');
    if (window.OMToast) window.OMToast.show({ kind: 'error', title: msg || S.fail, timeout: 6000 });
  }
  form.noValidate = true;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending || !validate()) return;
    sending = true;
    if (submit) { submit.disabled = true; submit.textContent = S.sendingPrimary; }
    var id = newId();
    var files = picker ? picker.getFiles() : [];
    if (!gasEnabled) {
      setStatus(S.sendingFallback, 'info');
      sendFallback(id, 'primary-not-configured').then(finish).catch(function (err) { fail(String(err.message) === 'upload' ? S.attachFail : S.fail); });
      return;
    }
    var total = files.reduce(function (n, f) { return n + f.file.size; }, 0);
    if (files.length > (cfg.gasMaxFiles || 5) || total > (cfg.gasMaxTotalBytes || 8388608)) {
      sending = false; if (submit) { submit.disabled = false; submit.textContent = S.send; }
      setStatus(S.gasTooLarge, 'error');
      return;
    }
    setStatus(S.sendingPrimary, 'info');
    Promise.all(files.map(function (item) {
      return readBase64(item.file).then(function (data) { return { name: item.file.name, type: item.file.type || 'application/octet-stream', size: item.file.size, data: data }; });
    })).then(function (attachments) {
      var payload = {
        id: id,
        site: 'onyx-meridian',
        siteKey: cfg.appsScriptSiteKey || '',
        lang: lang,
        subject: buildSubject(id),
        topic: val(topic),
        project: val(project),
        summary: val(summary),
        message: val(message),
        name: val(nameInput),
        email: val(email),
        platform: val(document.getElementById('platform')),
        mcversion: val(document.getElementById('mcversion')),
        addonversion: val(document.getElementById('addonversion')),
        consent: !!(consent && consent.checked),
        ruText: buildRussianMessage(attachments.map(function (a) { return { name: a.name }; }), id, ''),
        attachments: attachments,
        honeypot: '',
        timestamp: new Date().toISOString()
      };
      return postJson(cfg.appsScriptEndpoint, payload).then(function () { return { fallback: false }; });
    }).then(finish).catch(function () {
      setStatus(S.sendingFallback, 'info');
      return sendFallback(id, 'primary-failed').then(finish).catch(function (err) { fail(String(err.message) === 'upload' ? S.attachFail : S.fail); });
    });
  });
  if (message) message.addEventListener('input', function () { syncCount(); saveDraft(); });
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);
  if (mailto) mailto.addEventListener('click', function () {
    var body = buildRussianMessage([], 'mailto', '');
    mailto.href = 'mailto:' + (cfg.email || '') + '?subject=' + encodeURIComponent(buildSubject('mailto')) + '&body=' + encodeURIComponent(body);
  });
  restoreDraft();
  syncCount();
  syncAttachmentConsent();
})();
