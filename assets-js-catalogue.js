(function () {
  var bar = document.querySelector('[data-catalogue-filters]');
  if (!bar) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-catalogue-item]'));
  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter]');
    if (!btn) return;
    Array.prototype.forEach.call(bar.querySelectorAll('[data-filter]'), function (b) { b.classList.toggle('active', b === btn); });
    var f = btn.getAttribute('data-filter');
    cards.forEach(function (c) { c.style.display = (f === 'all' || c.getAttribute('data-status') === f) ? '' : 'none'; });
  });
})();
