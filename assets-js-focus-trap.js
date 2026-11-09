(function () {
  if (window.__omFocusTrapV14) return;
  window.__omFocusTrapV14 = true;
  var SEL = '.om-drawer, .om-sheet, .notification-panel.open, .om-modal, .om-settings-panel';
  function visible(el) {
    if (!el || el.hidden) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function topDialog() {
    var list = Array.prototype.filter.call(document.querySelectorAll(SEL), visible);
    return list.length ? list[list.length - 1] : null;
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var d = topDialog();
    if (!d) return;
    var f = Array.prototype.filter.call(d.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'), function (el) { return el.offsetParent !== null || el === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!d.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  });
})();
