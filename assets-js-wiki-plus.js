(function () {
  if (window.__omWikiPlus) return;
  window.__omWikiPlus = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? { copy: 'Копировать', copied: 'Скопировано', related: 'Связанные страницы', link: 'Ссылка на раздел' } : { copy: 'Copy', copied: 'Copied', related: 'Related pages', link: 'Link to section' };
  Array.prototype.forEach.call(document.querySelectorAll('.wiki-body pre, .wiki-body .idchip'), function (el) {
    if (el.querySelector('.wiki-copy')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wiki-copy';
    btn.textContent = T.copy;
    btn.addEventListener('click', function () {
      var text = el.textContent.replace(T.copy, '').trim();
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      btn.textContent = T.copied;
      setTimeout(function () { btn.textContent = T.copy; }, 1400);
    });
    el.style.position = 'relative';
    el.appendChild(btn);
  });
  var body = document.querySelector('.wiki-body');
  var side = document.getElementById('wiki-side');
  if (body && side && !body.querySelector('.wiki-related')) {
    var active = side.querySelector('a.active');
    if (active) {
      var group = active.closest('.wiki-side-group');
      if (group) {
        var links = Array.prototype.filter.call(group.querySelectorAll('a'), function (a) { return !a.classList.contains('active'); }).slice(0, 4);
        if (links.length) {
          var box = document.createElement('div');
          box.className = 'wiki-related';
          box.innerHTML = '<h2>' + T.related + '</h2>';
          var grid = document.createElement('div');
          grid.className = 'wiki-related-grid';
          links.forEach(function (a) {
            var c = document.createElement('a');
            c.href = a.getAttribute('href');
            c.className = 'wiki-related-card';
            c.textContent = a.textContent;
            grid.appendChild(c);
          });
          box.appendChild(grid);
          body.appendChild(box);
        }
      }
    }
  }
})();
