(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;
  function animate() {
    if (reduced) return;
    root.classList.add('om-theme-anim');
    clearTimeout(timer);
    timer = setTimeout(function () { root.classList.remove('om-theme-anim'); }, 650);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#theme-btn')) animate();
  }, true);
})();
