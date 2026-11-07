(function () {
  var form = document.getElementById('support-form');
  if (!form) return;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var cfg = window.OM_FORM || {};
  var S = {
    en: {
      required: 'Please complete the required fields correctly.',
      bademail: 'Enter a valid reply email address.',
      minmessage: 'Please describe the request in at least 20 characters.',
      sending: 'Sending…',
      send: 'Send request',
      subject: 'Onyx Meridian support request',
      bodyIntro: 'Onyx Meridian support request',
      ok: 'Request sent successfully.',
      fail: 'Could not send the request. Try again or use the email app button.',
      missing: 'The form endpoint is not configured yet. Use the email app button or write directly to the studio email.'
    },
    ru: {
      required: 'Пожалуйста, правильно заполните обязательные поля.',
      bademail: 'Введите корректный адрес почты для ответа.',
      minmessage: 'Опишите обращение минимум в 20 символах.',
      sending: 'Отправка…',
      send: 'Отправить обращение',
      subject: 'Обращение в Onyx Meridian',
      bodyIntro: 'Обращение в Onyx Meridian',
      ok: 'Обращение успешно отправлено.',
      fail: 'Не удалось отправить обращение. Попробуйте ещё раз или откройте почтовое приложение.',
      missing: 'Сервис формы ещё не настроен. Откройте почтовое приложение или напишите напрямую на почту студии.'
    }
  }[lang];
  var topic = document.getElementById('topic');
  var project = document.getElementById('project');
  var summary = document.getElementById('summary');
  var message = document.getElementById('message');
  var email = document.getElementById('email');
  var consent = document.getElementById('consent');
  var status = document.getElementById('support-status');
  var submit = document.getElementById('support-submit');
  var mailto = document.getElementById('support-mailto');
  var count = document.getElementById('message-count');
  var keyInput = document.getElementById('web3forms-key');
  var subject = document.getElementById('support-subject');
  var redirect = document.getElementById('support-redirect');
  var success = document.getElementById('support-success');
  var draftKey = 'om-support-draft-v2';
  var draftTimer = null;

  if (keyInput && cfg.accessKey) keyInput.value = cfg.accessKey;
  if (redirect) redirect.value = window.location.origin + window.location.pathname + '?sent=1';

  function setStatus(text, kind) {
    if (!status) return;
    status.textContent = text || '';
    status.className = 'support-status-v11' + (kind ? ' ' + kind : '');
  }
  function syncSubject() {
    if (!subject) return;
    var parts = [S.subject];
    if (topic && topic.value) parts.push(topic.options[topic.selectedIndex].text);
    if (project && project.value) parts.push(project.options[project.selectedIndex].text);
    subject.value = parts.join(' — ');
  }
  function syncCount() {
    if (count && message) count.textContent = String(message.value.length);
  }
  function saveDraft() {
    try {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.name === 'access_key' || el.name === 'botcheck' || el.name === 'subject' || el.name === 'from_name' || el.name === 'redirect' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
        data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      });
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch (e) {}
  }
  function restoreDraft() {
    try {
      if (new URLSearchParams(window.location.search).get('sent') === '1') {
        localStorage.removeItem(draftKey);
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      var data = JSON.parse(localStorage.getItem(draftKey) || '{}');
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !(el.name in data)) return;
        if (el.type === 'checkbox') el.checked = !!data[el.name];
        else el.value = data[el.name];
      });
    } catch (e) {}
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }
  function validate() {
    if (!form.checkValidity()) {
      setStatus(S.required, 'error');
      form.reportValidity();
      return false;
    }
    if (email && !validEmail(email.value.trim())) {
      setStatus(S.bademail, 'error');
      email.focus();
      return false;
    }
    if (message && message.value.trim().length < 20) {
      setStatus(S.minmessage, 'error');
      message.focus();
      return false;
    }
    if (consent && !consent.checked) {
      setStatus(S.required, 'error');
      consent.focus();
      return false;
    }
    setStatus('');
    return true;
  }
  function buildMailto() {
    syncSubject();
    var lines = [S.bodyIntro, ''];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name === 'access_key' || el.name === 'botcheck' || el.name === 'subject' || el.name === 'from_name' || el.name === 'redirect' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
      if (el.type === 'checkbox') {
        lines.push(el.name + ': ' + (el.checked ? 'yes' : 'no'));
        return;
      }
      if (el.value) lines.push(el.name + ': ' + el.value);
    });
    var body = encodeURIComponent(lines.join('\n'));
    var subj = encodeURIComponent(subject ? subject.value : S.subject);
    return 'mailto:' + (cfg.email || 'yarik.internet@atomicmail.io') + '?subject=' + subj + '&body=' + body;
  }
  form.addEventListener('input', function () {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 250);
    syncCount();
  });
  form.addEventListener('change', function () {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 250);
    syncSubject();
  });
  form.addEventListener('invalid', function () { setStatus(S.required, 'error'); }, true);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    syncSubject();
    if (!validate()) return;
    if (!cfg.accessKey) {
      setStatus(S.missing, 'error');
      return;
    }
    if (submit) {
      submit.disabled = true;
      submit.textContent = S.sending;
      submit.setAttribute('aria-busy', 'true');
    }
    var payload = { access_key: cfg.accessKey, botcheck: false };
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name === 'access_key' || el.name === 'botcheck' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
      if (el.type === 'checkbox') payload[el.name] = el.checked;
      else if (el.value) payload[el.name] = el.value;
    });
    payload.subject = subject ? subject.value : S.subject;
    payload.redirect = redirect ? redirect.value : '';
    fetch(cfg.endpoint || 'https://api.web3forms.com/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    }).then(function (r) { return r.json().catch(function () { return {}; }); }).then(function (json) {
      if (json && json.success) {
        setStatus(S.ok, 'ok');
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        try { localStorage.removeItem(draftKey); } catch (e) {}
        syncCount();
      } else {
        setStatus(S.fail, 'error');
      }
    }).catch(function () {
      setStatus(S.fail, 'error');
    }).finally(function () {
      if (submit) {
        submit.disabled = false;
        submit.textContent = S.send;
        submit.removeAttribute('aria-busy');
      }
    });
  });
  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      syncCount();
      setStatus('');
      try { localStorage.removeItem(draftKey); } catch (e) {}
      if (submit) {
        submit.disabled = false;
        submit.textContent = S.send;
        submit.removeAttribute('aria-busy');
      }
    }, 0);
  });
  if (mailto) mailto.addEventListener('click', function () { window.location.href = buildMailto(); });
  restoreDraft();
  syncSubject();
  syncCount();
})();
