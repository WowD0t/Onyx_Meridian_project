(function () {
  if (window.__omMediaViewer) return;
  window.__omMediaViewer = true;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var labels = lang === 'ru'
    ? { zoomIn: 'Увеличить', zoomOut: 'Уменьшить', reset: 'Сбросить', original: 'Оригинал', close: 'Закрыть' }
    : { zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset', original: 'Original', close: 'Close' };
  var viewer = document.createElement('div');
  viewer.className = 'om-media-viewer';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.innerHTML = '<div class="om-media-cap"></div><div class="om-media-stage"><img alt=""></div><div class="om-media-bar"><button type="button" data-mv="out" aria-label="' + labels.zoomOut + '">−</button><span class="om-media-zoom">100%</span><button type="button" data-mv="in" aria-label="' + labels.zoomIn + '">+</button><button type="button" data-mv="reset" aria-label="' + labels.reset + '">1:1</button><a data-mv="original" target="_blank" rel="noopener">' + labels.original + '</a><button type="button" data-mv="close" aria-label="' + labels.close + '">✕</button></div>';
  document.body.appendChild(viewer);
  var img = viewer.querySelector('img');
  var cap = viewer.querySelector('.om-media-cap');
  var zoomLabel = viewer.querySelector('.om-media-zoom');
  var original = viewer.querySelector('[data-mv="original"]');
  var scale = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0;
  function apply() {
    img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    zoomLabel.textContent = Math.round(scale * 100) + '%';
  }
  function open(src, caption) {
    img.src = src;
    img.alt = caption || '';
    cap.textContent = caption || '';
    cap.style.display = caption ? '' : 'none';
    original.href = src;
    scale = 1; tx = 0; ty = 0; apply();
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    viewer.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }
  function zoom(delta) {
    scale = Math.min(6, Math.max(0.5, scale + delta));
    apply();
  }
  document.addEventListener('click', function (e) {
    var target = e.target.closest ? e.target.closest('.wiki-body img, .v9-preview img, .figure-media img, .gif-card img, .media-grid img') : null;
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      var fig = target.closest('figure');
      var caption = fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : target.alt;
      open(target.getAttribute('data-full') || target.currentSrc || target.src, caption);
      return;
    }
    if (!viewer.classList.contains('open')) return;
    var btn = e.target.closest('[data-mv]');
    if (btn) {
      var action = btn.getAttribute('data-mv');
      if (action === 'close') close();
      if (action === 'in') zoom(0.25);
      if (action === 'out') zoom(-0.25);
      if (action === 'reset') { scale = 1; tx = 0; ty = 0; apply(); }
      return;
    }
    if (e.target === viewer || e.target.classList.contains('om-media-stage')) close();
  }, true);
  viewer.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.15 : -0.15);
  }, { passive: false });
  img.addEventListener('pointerdown', function (e) {
    dragging = true;
    sx = e.clientX - tx;
    sy = e.clientY - ty;
    img.classList.add('dragging');
    img.setPointerCapture(e.pointerId);
  });
  img.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    tx = e.clientX - sx;
    ty = e.clientY - sy;
    apply();
  });
  img.addEventListener('pointerup', function () { dragging = false; img.classList.remove('dragging'); });
  img.addEventListener('dblclick', function () {
    if (scale === 1) scale = 2; else { scale = 1; tx = 0; ty = 0; }
    apply();
  });
  document.addEventListener('keydown', function (e) {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoom(0.25);
    if (e.key === '-') zoom(-0.25);
    if (e.key === '0') { scale = 1; tx = 0; ty = 0; apply(); }
  });
})();
