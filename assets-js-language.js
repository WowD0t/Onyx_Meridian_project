(function () {
  if (window.__omLanguageV24) return;
  window.__omLanguageV24 = true;
  var root = document.documentElement;
  var lang = root.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru'
    ? { label: 'Язык сайта', open: 'Выбрать язык', en: 'Английский', ru: 'Русский', hint: 'Клавиша L открывает этот список' }
    : { label: 'Site language', open: 'Choose language', en: 'English', ru: 'Russian', hint: 'Press L to open this list' };
  var btn = document.getElementById('lang-btn');
  if (!btn) return;
  var licenseMode = !!document.querySelector('[data-license-panel]');

  var globe = '<svg class="om-lang-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>';
  var chev = '<svg class="om-lang-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var check = '<svg class="om-lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';

  btn.type = 'button';
  btn.className = 'om-lang-btn';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', T.open);
  btn.title = T.open;
  btn.innerHTML = globe + '<span class="om-lang-code">' + lang.toUpperCase() + '</span>' + chev;

  var pop = document.createElement('div');
  pop.className = 'om-lang-popover';
  pop.id = 'om-lang-popover';
  pop.setAttribute('role', 'listbox');
  pop.setAttribute('aria-label', T.label);
  pop.hidden = true;
  function option(code, native, english) {
    var active = code === lang;
    return '<button type="button" role="option" class="om-lang-option' + (active ? ' active' : '') + '" data-lang-option="' + code + '" aria-selected="' + active + '">' +
      '<span class="om-lang-option-text"><strong>' + native + '</strong>' + (english && english !== native ? '<small>' + english + '</small>' : '') + '</span>' +
      '<span class="om-lang-option-code">' + code.toUpperCase() + '</span>' +
      '<span class="om-lang-option-check">' + (active ? check : '') + '</span></button>';
  }
  pop.innerHTML = '<div class="om-lang-popover-head">' + T.label + '</div>' +
    option('en', 'English', T.en) + option('ru', 'Русский', T.ru) +
    '<div class="om-lang-popover-hint">' + T.hint + '</div>';
  document.body.appendChild(pop);

  var options = Array.prototype.slice.call(pop.querySelectorAll('[data-lang-option]'));
  function sync() {
    lang = root.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
    var code = btn.querySelector('.om-lang-code');
    if (code) code.textContent = lang.toUpperCase();
    options.forEach(function (o) {
      var on = o.getAttribute('data-lang-option') === lang;
      o.classList.toggle('active', on);
      o.setAttribute('aria-selected', on ? 'true' : 'false');
      var c = o.querySelector('.om-lang-option-check');
      if (c) c.innerHTML = on ? check : '';
    });
  }
  if (window.MutationObserver) new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-lang'] });
  var isOpen = false;
  var lastFocus = null;
  var outsideArmed = false;

  function place() {
    var r = btn.getBoundingClientRect();
    var w = Math.min(260, window.innerWidth - 16);
    pop.style.width = w + 'px';
    var left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8));
    var top = r.bottom + 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    var ph = pop.offsetHeight;
    if (top + ph > window.innerHeight - 8) {
      pop.style.top = Math.max(8, r.top - ph - 8) + 'px';
    }
  }
  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    pop.hidden = false;
    place();
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('om-lang-open');
    outsideArmed = false;
    setTimeout(function () { outsideArmed = true; }, 0);
    var active = pop.querySelector('.om-lang-option.active') || options[0];
    active.focus();
  }
  function close(restore) {
    if (!isOpen) return;
    isOpen = false;
    pop.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('om-lang-open');
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function go(code) {
    if (licenseMode) {
      var a = document.querySelector('[data-license-site-lang="' + code + '"]');
      if (a) a.click();
      sync();
      return;
    }
    try { localStorage.setItem('om-lang', code); } catch (e) {}
    var target = root.getAttribute(code === 'ru' ? 'data-alt-ru' : 'data-alt-en');
    if (!target) target = (root.getAttribute('data-root') || '') + code + '/index.html';
    var url;
    try {
      url = new URL(target, window.location.href);
      url.search = window.location.search;
      url.hash = window.location.hash;
    } catch (e) { url = null; }
    window.location.href = url ? url.href : target;
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    isOpen ? close() : open();
  });
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
  pop.addEventListener('click', function (e) {
    var opt = e.target.closest('[data-lang-option]');
    if (!opt) return;
    var code = opt.getAttribute('data-lang-option');
    close(false);
    if (code !== lang) go(code);
  });
  pop.addEventListener('keydown', function (e) {
    var idx = options.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); options[(idx + 1) % options.length].focus(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); options[(idx - 1 + options.length) % options.length].focus(); return; }
    if (e.key === 'Home') { e.preventDefault(); options[0].focus(); return; }
    if (e.key === 'End') { e.preventDefault(); options[options.length - 1].focus(); return; }
    if (e.key === 'Tab') {
      var first = options[0], last = options[options.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', function (e) {
    if (!isOpen || !outsideArmed) return;
    if (e.target.closest('#om-lang-popover') || e.target.closest('#lang-btn')) return;
    close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });
  window.addEventListener('resize', function () { if (isOpen) place(); });
  window.addEventListener('scroll', function () { if (isOpen) place(); }, { passive: true });

  window.OMLanguage = { open: open, close: close, set: go, toggle: function () { isOpen ? close() : open(); } };
})();
