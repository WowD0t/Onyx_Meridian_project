(function () {
  if (window.__omToastV15) return;
  window.__omToastV15 = true;
  var stack = null;
  var active = {};
  function ensure() {
    if (stack) return stack;
    stack = document.createElement('div');
    stack.className = 'om-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
    return stack;
  }
  function icon(kind) {
    if (kind === 'success') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m5 13 4 4L19 7"/></svg>';
    if (kind === 'error') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>';
    if (kind === 'warning') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3 2 21h20z"/><path d="M12 10v4M12 17.5v.5"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>';
  }
  function show(opts) {
    opts = typeof opts === 'string' ? { body: opts } : (opts || {});
    var s = ensure();
    var key = opts.id || (opts.title || '') + '|' + (opts.body || '');
    if (active[key]) return active[key].dismiss;
    while (s.children.length >= 4) s.firstChild.remove();
    var el = document.createElement('div');
    el.className = 'om-toast';
    el.innerHTML = '<div class="om-toast-ico">' + icon(opts.kind) + '</div><div class="om-toast-content"><strong></strong><p></p><div class="om-toast-actions"></div></div><button type="button" class="om-toast-close" aria-label="Close">×</button><i class="om-toast-progress"></i>';
    el.querySelector('strong').textContent = opts.title || '';
    el.querySelector('p').textContent = opts.body || '';
    if (!opts.title) el.querySelector('strong').remove();
    var actions = el.querySelector('.om-toast-actions');
    (opts.actions || []).forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ' + (a.primary ? 'btn-primary' : 'btn-ghost');
      b.style.padding = '7px 12px'; b.style.fontSize = '.78rem';
      b.textContent = a.label;
      b.addEventListener('click', function () { if (a.onClick) a.onClick(); dismiss(); });
      actions.appendChild(b);
    });
    if (!actions.children.length) actions.remove();
    s.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    var timeout = typeof opts.timeout === 'number' ? opts.timeout : 5600;
    var timer = null, start = Date.now(), remaining = timeout, progress = el.querySelector('.om-toast-progress');
    function tick() {
      if (!timeout) { progress.style.display = 'none'; return; }
      var left = Math.max(0, remaining - (Date.now() - start));
      progress.style.transform = 'scaleX(' + (left / timeout) + ')';
      if (left <= 0) dismiss();
    }
    function arm() { if (!timeout) return; start = Date.now(); timer = setTimeout(dismiss, remaining); requestAnimationFrame(tick); }
    function pause() { if (!timeout) return; clearTimeout(timer); remaining = Math.max(0, remaining - (Date.now() - start)); }
    function dismiss() {
      clearTimeout(timer);
      delete active[key];
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 380);
    }
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', arm);
    el.querySelector('.om-toast-close').addEventListener('click', dismiss);
    active[key] = { dismiss: dismiss };
    arm();
    return dismiss;
  }
  window.OMToast = { show: show };
})();
