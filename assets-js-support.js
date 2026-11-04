(function () {
  var form = document.getElementById('support-form');
  if (!form) return;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var S = {
    en: {
      required: 'Please complete the required fields correctly.',
      bademail: 'Enter a valid reply e-mail address.',
      minmessage: 'Please describe the request in at least 20 characters.',
      sending: 'Sending…',
      send: 'Send request',
      subject: 'Onyx Meridian support request',
      bodyIntro: 'Onyx Meridian support request',
      chars: 'characters'
    },
    ru: {
      required: 'Пожалуйста, правильно заполните обязательные поля.',
      bademail: 'Введите корректный адрес почты для ответа.',
      minmessage: 'Опишите обращение минимум в 20 символах.',
      sending: 'Отправка…',
      send: 'Отправить обращение',
      subject: 'Обращение в Onyx Meridian',
      bodyIntro: 'Обращение в Onyx Meridian',
      chars: 'символов'
    }
  }[lang];
  var work = document.getElementById('work_type');
  var projectField = document.getElementById('project-field');
  var project = document.getElementById('project');
  var category = document.getElementById('category');
  var summary = document.getElementById('summary');
  var message = document.getElementById('message');
  var email = document.getElementById('email');
  var consent = document.getElementById('consent');
  var status = document.getElementById('support-status');
  var submit = document.getElementById('support-submit');
  var mailto = document.getElementById('support-mailto');
  var count = document.getElementById('message-count');
  var next = form.querySelector('input[name="_next"]');
  var subject = form.querySelector('input[name="_subject"]');
  var honey = form.querySelector('input[name="_honey"]');

  function setStatus(text, kind) {
    if (!status) return;
    status.textContent = text || '';
    status.className = 'support-status' + (kind ? ' ' + kind : '');
  }

  function syncProject() {
    var isAddon = work && work.value === 'addon';
    if (projectField) projectField.hidden = !isAddon;
    if (project) {
      project.required = isAddon;
      if (!isAddon) project.value = '';
    }
  }

  function syncSubject() {
    if (!subject) return;
    var parts = [S.subject];
    if (category && category.value) parts.push(category.options[category.selectedIndex].text);
    if (work && work.value) parts.push(work.options[work.selectedIndex].text);
    if (project && project.value) parts.push(project.value);
    subject.value = parts.join(' — ');
  }

  function syncCount() {
    if (count && message) count.textContent = String(message.value.length);
  }

  var draftKey = 'om-support-draft-v1';
  var draftTimer = null;
  function saveDraft() {
    try {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.name.charAt(0) === '_' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
        data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      });
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch (e) {}
  }
  function restoreDraft() {
    try {
      if (new URLSearchParams(window.location.search).get('sent') === '1') {
        localStorage.removeItem(draftKey);
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
  form.addEventListener('input', function () {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 250);
  });
  form.addEventListener('change', function () {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 250);
  });

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function validate() {
    if (honey && honey.value) return false;
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

  form.addEventListener('invalid', function () { setStatus(S.required, 'error'); }, true);
  if (work) work.addEventListener('change', function () { syncProject(); syncSubject(); });
  if (category) category.addEventListener('change', syncSubject);
  if (project) project.addEventListener('change', syncSubject);
  if (message) message.addEventListener('input', syncCount);
  form.addEventListener('submit', function (e) {
    syncProject();
    syncSubject();
    if (!validate()) {
      e.preventDefault();
      return;
    }
    if (next) next.value = window.location.origin + window.location.pathname + '?sent=1';
    if (submit) {
      submit.textContent = S.sending;
      submit.setAttribute('aria-busy', 'true');
    }
  });
  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      syncProject();
      syncCount();
      setStatus('');
      try { localStorage.removeItem(draftKey); } catch (e) {}
      if (submit) {
        submit.textContent = S.send;
        submit.removeAttribute('aria-busy');
      }
    }, 0);
  });
  if (mailto) {
    mailto.addEventListener('click', function () {
      syncProject();
      syncSubject();
      var lines = [S.bodyIntro, ''];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.name.charAt(0) === '_' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
        if (el.type === 'checkbox') {
          lines.push(el.name + ': ' + (el.checked ? 'yes' : 'no'));
          return;
        }
        if (el.value) lines.push(el.name + ': ' + el.value);
      });
      var body = encodeURIComponent(lines.join('\n'));
      var subj = encodeURIComponent(subject ? subject.value : S.subject);
      window.location.href = 'mailto:yarik.internet@atomicmail.io?subject=' + subj + '&body=' + body;
    });
  }
  try {
    if (new URLSearchParams(window.location.search).get('sent') === '1') {
      var ok = document.getElementById('support-success');
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  } catch (e) {}
  restoreDraft();
  syncProject();
  syncCount();
})();
