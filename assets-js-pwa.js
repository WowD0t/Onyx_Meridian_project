(function () {
  if (!('serviceWorker' in navigator)) return;
  var root = document.documentElement.getAttribute('data-root') || '';
  window.addEventListener('load', function () {
    navigator.serviceWorker.register(root + 'sw.js', { scope: root || './' }).catch(function () {});
  });
})();
