(function () {
  function setLang(lang) {
    try { localStorage.setItem('om-lang', lang); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var langBtn = e.target.closest ? e.target.closest('#lang-btn') : null;
    if (langBtn) {
      var target = langBtn.getAttribute('data-target') || '';
      setLang(/(^|[\/-])ru([\/.-]|$)/.test(target) ? 'ru' : 'en');
    }
    var licenseLang = e.target.closest ? e.target.closest('[data-license-site-lang]') : null;
    if (licenseLang) setLang(licenseLang.getAttribute('data-license-site-lang'));
  }, true);
  try {
    var q = new URLSearchParams(window.location.search).get('q');
    if (q && !/search\.html$/.test(window.location.pathname)) {
      window.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
          var opener = document.querySelector('[data-search-open]');
          if (opener) opener.click();
          var input = document.getElementById('search-input');
          if (input) {
            input.value = q;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 180);
      });
    }
  } catch (e) {}
})();
