(function () {
  if (window.__omWikiV13) return;
  window.__omWikiV13 = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? { print: 'Печать', copy: 'Ссылка', copied: 'Скопировано', version: 'Версия', current: 'актуальная', settings: 'Настройки' } : { print: 'Print', copy: 'Link', copied: 'Copied', version: 'Version', current: 'current', settings: 'Settings' };
  var main = document.querySelector('.wiki-main');
  var body = document.querySelector('.wiki-body');
  if (!main || !body) return;
  var progress = document.createElement('div');
  progress.className = 'wiki-progress';
  document.body.appendChild(progress);
  function updateProgress() { var h = document.documentElement; var max = h.scrollHeight - h.clientHeight; progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%'; }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  var crumb = main.querySelector('.wiki-crumb');
  var toolbar = document.createElement('div');
  toolbar.className = 'wiki-toolbar-v13';
  toolbar.innerHTML = '<span class="wiki-chip">' + T.version + ' <strong>v2.1.5</strong> · ' + T.current + '</span><button type="button" class="wiki-action" data-wiki-action="copy">' + T.copy + '</button><button type="button" class="wiki-action" data-wiki-action="print">' + T.print + '</button><button type="button" class="wiki-action" data-wiki-action="settings">' + T.settings + '</button>';
  if (crumb && crumb.nextSibling) main.insertBefore(toolbar, crumb.nextSibling);
  else main.insertBefore(toolbar, main.firstChild);
  toolbar.addEventListener('click', function (e) {
    var el = e.target.closest('[data-wiki-action]');
    if (!el) return;
    var a = el.getAttribute('data-wiki-action');
    if (a === 'print') window.print();
    if (a === 'settings' && window.OMSettings) window.OMSettings.open();
    if (a === 'copy') { var url = location.href.split('#')[0]; if (navigator.clipboard) navigator.clipboard.writeText(url); el.textContent = T.copied; setTimeout(function () { el.textContent = T.copy; }, 1400); }
  });
  Array.prototype.forEach.call(body.querySelectorAll('h2[id],h3[id]'), function (h) {
    if (h.querySelector('.heading-anchor')) return;
    var a = document.createElement('a');
    a.className = 'heading-anchor';
    a.href = '#' + h.id;
    a.setAttribute('aria-label', 'Link to section');
    a.textContent = '#';
    h.appendChild(a);
  });
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.wiki-toc a'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { var id = a.getAttribute('href').slice(1); var h = document.getElementById(id); if (h) map[id] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { tocLinks.forEach(function (a) { a.classList.remove('active'); }); var a = map[en.target.id]; if (a) a.classList.add('active'); } });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { obs.observe(document.getElementById(id)); });
  }
})();
