(function () {
  if (window.__omTransitionV16) return;
  window.__omTransitionV16 = true;
  var veil = document.querySelector('.page-veil');
  if (veil) veil.remove();
  document.documentElement.classList.remove('leaving');
  try {
    if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
      var rules = document.createElement('script');
      rules.type = 'speculationrules';
      rules.textContent = JSON.stringify({ prefetch: [{ source: 'document', where: { and: [{ href_matches: '/*' }, { not: { href_matches: '/api/*' } }] }, eagerness: 'conservative' }] });
      document.head.appendChild(rules);
    }
  } catch (e) {}
  var prefetched = {};
  function canPrefetch(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.hash) return false;
    if (!/\.html?$/.test(url.pathname) && url.pathname !== '/' && !/\/$/.test(url.pathname)) return false;
    return url.href;
  }
  function prefetch(href) {
    if (!href || prefetched[href]) return;
    prefetched[href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'document';
    document.head.appendChild(link);
  }
  document.addEventListener('pointerenter', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    var href = canPrefetch(a);
    if (href) prefetch(href);
  }, true);
  document.addEventListener('focusin', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    var href = canPrefetch(a);
    if (href) prefetch(href);
  });
  document.addEventListener('pointermove', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (!b) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    b.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
})();
