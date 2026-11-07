(function () {
  if (window.__omSettingsV13) return;
  window.__omSettingsV13 = true;
  var KEY = 'om-settings-v1';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = {
    en: { title: 'Settings', appearance: 'Appearance', theme: 'Theme', dark: 'Dark', light: 'Light', system: 'System', accent: 'Accent', indigo: 'Indigo', violet: 'Violet', cyan: 'Cyan', emerald: 'Emerald', amber: 'Amber', rose: 'Rose', font: 'Text size', sm: 'Small', md: 'Medium', lg: 'Large', xl: 'Extra large', density: 'Density', comfortable: 'Comfortable', compact: 'Compact', hero: 'Hero layout', default: 'Default', compactHero: 'Compact', focus: 'Focus', width: 'Article width', normal: 'Normal', wide: 'Wide', full: 'Full', links: 'Underline links', on: 'On', off: 'Off', performance: 'Performance', mode: 'Performance mode', auto: 'Auto', lite: 'Lite', motion: 'Animations', reduced: 'Reduced', effects: 'Background effects', language: 'Language', reset: 'Reset settings', close: 'Close settings', hint: 'Lite mode keeps layout and colours but disables heavy effects for weak devices.' },
    ru: { title: 'Настройки', appearance: 'Оформление', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', system: 'Системная', accent: 'Акцент', indigo: 'Индиго', violet: 'Фиолетовый', cyan: 'Циан', emerald: 'Изумруд', amber: 'Янтарь', rose: 'Роза', font: 'Размер текста', sm: 'Маленький', md: 'Средний', lg: 'Большой', xl: 'Очень большой', density: 'Плотность', comfortable: 'Свободная', compact: 'Компактная', hero: 'Главный блок', default: 'Обычный', compactHero: 'Компактный', focus: 'Фокус', width: 'Ширина статьи', normal: 'Обычная', wide: 'Широкая', full: 'Полная', links: 'Подчёркивать ссылки', on: 'Вкл', off: 'Выкл', performance: 'Производительность', mode: 'Режим производительности', auto: 'Авто', lite: 'Облегчённый', motion: 'Анимации', reduced: 'Уменьшены', effects: 'Фоновые эффекты', language: 'Язык', reset: 'Сбросить настройки', close: 'Закрыть настройки', hint: 'Облегчённый режим сохраняет макет и цвета, но отключает тяжёлые эффекты для слабых устройств.' }
  }[lang];
  var defaults = { theme: 'dark', accent: 'indigo', font: 'md', density: 'comfortable', perf: 'auto', motion: 'full', effects: 'full', hero: 'default', width: 'normal', links: 'off' };
  function load() { try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return Object.assign({}, defaults); } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function weakDevice() { try { if (navigator.connection && navigator.connection.saveData) return true; if (navigator.deviceMemory && navigator.deviceMemory <= 4) return true; if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true; } catch (e) {} return false; }
  function apply(s) {
    var r = document.documentElement;
    var theme = s.theme;
    if (theme === 'system') theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    r.setAttribute('data-theme', theme);
    try { localStorage.setItem('om-theme', theme); } catch (e) {}
    r.setAttribute('data-accent', s.accent);
    r.setAttribute('data-font', s.font);
    r.setAttribute('data-density', s.density);
    r.setAttribute('data-hero', s.hero);
    r.setAttribute('data-width', s.width);
    r.setAttribute('data-links', s.links);
    var lite = s.perf === 'lite' || (s.perf === 'auto' && weakDevice());
    r.setAttribute('data-perf', lite ? 'lite' : 'full');
    r.setAttribute('data-motion', lite || s.motion === 'reduced' ? 'reduced' : 'full');
    r.setAttribute('data-effects', lite || s.effects === 'off' ? 'off' : 'full');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f8fb' : '#0b0d12');
  }
  var state = load();
  apply(state);
  var overlay = document.createElement('div');
  overlay.className = 'om-settings-overlay om-drawer-overlay';
  overlay.hidden = true;
  var panel = document.createElement('aside');
  panel.className = 'om-settings-panel om-drawer';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', T.title);
  function opt(v, l, c) { return '<option value="' + v + '"' + (v === c ? ' selected' : '') + '>' + l + '</option>'; }
  panel.innerHTML = '<div class="om-drawer-head"><strong>' + T.title + '</strong><button type="button" class="iconbtn om-settings-close" aria-label="' + T.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><div class="om-drawer-body">' +
    '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.appearance + '</h3><div class="om-settings-row"><label>' + T.theme + '<select data-set="theme">' + opt('dark', T.dark, state.theme) + opt('light', T.light, state.theme) + opt('system', T.system, state.theme) + '</select></label><label>' + T.accent + '<select data-set="accent">' + opt('indigo', T.indigo, state.accent) + opt('violet', T.violet, state.accent) + opt('cyan', T.cyan, state.accent) + opt('emerald', T.emerald, state.accent) + opt('amber', T.amber, state.accent) + opt('rose', T.rose, state.accent) + '</select></label></div><div class="om-settings-row"><label>' + T.font + '<select data-set="font">' + opt('sm', T.sm, state.font) + opt('md', T.md, state.font) + opt('lg', T.lg, state.font) + opt('xl', T.xl, state.font) + '</select></label><label>' + T.density + '<select data-set="density">' + opt('comfortable', T.comfortable, state.density) + opt('compact', T.compact, state.density) + '</select></label></div><div class="om-settings-row"><label>' + T.hero + '<select data-set="hero">' + opt('default', T.default, state.hero) + opt('compact', T.compactHero, state.hero) + opt('focus', T.focus, state.hero) + '</select></label><label>' + T.width + '<select data-set="width">' + opt('normal', T.normal, state.width) + opt('wide', T.wide, state.width) + opt('full', T.full, state.width) + '</select></label></div><label>' + T.links + '<select data-set="links">' + opt('off', T.off, state.links) + opt('on', T.on, state.links) + '</select></label></section>' +
    '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.performance + '</h3><p class="om-settings-hint">' + T.hint + '</p><label>' + T.mode + '<select data-set="perf">' + opt('auto', T.auto, state.perf) + opt('full', T.full, state.perf) + opt('lite', T.lite, state.perf) + '</select></label><div class="om-settings-row"><label>' + T.motion + '<select data-set="motion">' + opt('full', T.on, state.motion) + opt('reduced', T.reduced, state.motion) + '</select></label><label>' + T.effects + '<select data-set="effects">' + opt('full', T.on, state.effects) + opt('off', T.off, state.effects) + '</select></label></div></section>' +
    '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.language + '</h3><label>EN / RU<select data-lang-select><option value="en"' + (lang === 'en' ? ' selected' : '') + '>English</option><option value="ru"' + (lang === 'ru' ? ' selected' : '') + '>Русский</option></select></label></section>' +
    '<button type="button" class="btn btn-ghost om-settings-reset">' + T.reset + '</button></div>';
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  var lastFocus = null;
  function open() { lastFocus = document.activeElement; overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('open'); }); document.body.classList.add('om-settings-open'); var f = panel.querySelector('select'); if (f) f.focus(); }
  function close() { overlay.classList.remove('open'); document.body.classList.remove('om-settings-open'); setTimeout(function () { overlay.hidden = true; }, 220); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  panel.querySelector('.om-settings-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
  panel.addEventListener('change', function (e) {
    var el = e.target;
    if (el.matches('[data-set]')) { state[el.getAttribute('data-set')] = el.value; save(state); apply(state); }
    if (el.matches('[data-lang-select]')) { var target = document.documentElement.getAttribute(el.value === 'ru' ? 'data-alt-ru' : 'data-alt-en'); try { localStorage.setItem('om-lang', el.value); } catch (err) {} if (target) window.location.href = target; }
  });
  panel.querySelector('.om-settings-reset').addEventListener('click', function () { state = Object.assign({}, defaults); save(state); apply(state); window.location.reload(); });
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if (state.theme === 'system') apply(state); });
  window.OMSettings = { open: open, close: close, apply: apply, state: state };
})();
