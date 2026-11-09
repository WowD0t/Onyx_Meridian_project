(function () {
  if (window.__omSettingsV13) return;
  window.__omSettingsV13 = true;
  var KEY = 'om-settings-v1';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = {
    en: { title: 'Settings', appearance: 'Appearance', theme: 'Theme', dark: 'Dark', light: 'Light', system: 'System', accent: 'Accent', blue: 'Navy', mail: 'Cobalt', graphite: 'Graphite', indigo: 'Indigo', violet: 'Violet', cyan: 'Teal', emerald: 'Emerald', amber: 'Amber', rose: 'Rose', font: 'Text size', sm: 'Small', md: 'Medium', lg: 'Large', xl: 'Extra large', density: 'Density', comfortable: 'Comfortable', compact: 'Compact', hero: 'Hero layout', default: 'Default', compactHero: 'Compact', focus: 'Focus', width: 'Article width', normal: 'Normal', wide: 'Wide', full: 'Full', links: 'Underline links', on: 'On', off: 'Off', performance: 'Performance', mode: 'Performance mode', auto: 'Auto', lite: 'Lite', motion: 'Animations', reduced: 'Reduced', effects: 'Background effects', language: 'Language', palette: 'Palette', paletteHint: 'Each card previews the accent on buttons, links and badges in the current theme. Contrast is measured for white text on the accent.', emblem: 'Emblem style', eA: 'Left of heading', eB: 'Centered above heading', eC: 'Inline in heading', eD: 'Background watermark', eE: 'Cover with overlap', reset: 'Reset settings', close: 'Close settings', hint: 'Lite mode disables heavy effects while keeping layout and colours.' },
    ru: { title: 'Настройки', appearance: 'Оформление', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', system: 'Системная', accent: 'Акцент', blue: 'Тёмно-синий', mail: 'Кобальт', graphite: 'Графит', indigo: 'Индиго', violet: 'Фиолетовый', cyan: 'Бирюзовый', emerald: 'Изумрудный', amber: 'Янтарный', rose: 'Розовый', font: 'Размер текста', sm: 'Маленький', md: 'Средний', lg: 'Большой', xl: 'Очень большой', density: 'Плотность', comfortable: 'Свободная', compact: 'Компактная', hero: 'Главный блок', default: 'Обычный', compactHero: 'Компактный', focus: 'Фокус', width: 'Ширина статьи', normal: 'Обычная', wide: 'Широкая', full: 'Полная', links: 'Подчёркивать ссылки', on: 'Вкл', off: 'Выкл', performance: 'Производительность', mode: 'Режим производительности', auto: 'Авто', lite: 'Облегчённый', motion: 'Анимации', reduced: 'Уменьшены', effects: 'Фоновые эффекты', language: 'Язык', palette: 'Палитра', paletteHint: 'Карточка показывает акцент на кнопке, ссылке и бейдже в текущей теме. Контраст — для белого текста на акценте.', emblem: 'Стиль эмблемы', eA: 'Слева от заголовка', eB: 'По центру над заголовком', eC: 'В строке заголовка', eD: 'Фоновый водяной знак', eE: 'Обложка с наложением', reset: 'Сбросить настройки', close: 'Закрыть настройки', hint: 'Облегчённый режим отключает тяжёлые эффекты, сохраняя макет и цвета.' }
  }[lang];
  var defaults = { theme: 'system', accent: 'blue', font: 'md', density: 'comfortable', perf: 'auto', motion: 'full', effects: 'full', hero: 'default', width: 'normal', links: 'off', emblem: 'A' };
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
    r.setAttribute('data-emblem', s.emblem || 'A');
    var lite = s.perf === 'lite' || (s.perf === 'auto' && weakDevice());
    r.setAttribute('data-perf', lite ? 'lite' : 'full');
    r.setAttribute('data-motion', lite || s.motion === 'reduced' ? 'reduced' : 'full');
    r.setAttribute('data-effects', lite || s.effects === 'off' ? 'off' : 'full');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F6F8FA' : '#0D1117');
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
    '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.appearance + '</h3><div class="om-settings-row"><label>' + T.theme + '<select data-set="theme">' + opt('dark', T.dark, state.theme) + opt('light', T.light, state.theme) + opt('system', T.system, state.theme) + '</select></label></div><div class="om-palette-block" data-palette-block></div><div class="om-settings-row"><label>' + T.font + '<select data-set="font">' + opt('sm', T.sm, state.font) + opt('md', T.md, state.font) + opt('lg', T.lg, state.font) + opt('xl', T.xl, state.font) + '</select></label><label>' + T.density + '<select data-set="density">' + opt('comfortable', T.comfortable, state.density) + opt('compact', T.compact, state.density) + '</select></label></div><div class="om-settings-row"><label>' + T.hero + '<select data-set="hero">' + opt('default', T.default, state.hero) + opt('compact', T.compactHero, state.hero) + opt('focus', T.focus, state.hero) + '</select></label><label>' + T.width + '<select data-set="width">' + opt('normal', T.normal, state.width) + opt('wide', T.wide, state.width) + opt('full', T.full, state.width) + '</select></label></div><label>' + T.links + '<select data-set="links">' + opt('off', T.off, state.links) + opt('on', T.on, state.links) + '</select></label><label>' + T.emblem + '<select data-set="emblem">' + opt('A', T.eA, state.emblem) + opt('B', T.eB, state.emblem) + opt('C', T.eC, state.emblem) + opt('D', T.eD, state.emblem) + opt('E', T.eE, state.emblem) + '</select></label></section>' +
    '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.performance + '</h3><p class="om-settings-hint">' + T.hint + '</p><label>' + T.mode + '<select data-set="perf">' + opt('auto', T.auto, state.perf) + opt('full', T.full, state.perf) + opt('lite', T.lite, state.perf) + '</select></label><div class="om-settings-row"><label>' + T.motion + '<select data-set="motion">' + opt('full', T.on, state.motion) + opt('reduced', T.reduced, state.motion) + '</select></label><label>' + T.effects + '<select data-set="effects">' + opt('full', T.on, state.effects) + opt('off', T.off, state.effects) + '</select></label></div></section>' +
    '<section class="om-drawer-group"><h3 class="om-drawer-title">' + T.language + '</h3><label>EN / RU<select data-lang-select><option value="en"' + (lang === 'en' ? ' selected' : '') + '>English</option><option value="ru"' + (lang === 'ru' ? ' selected' : '') + '>Русский</option></select></label></section>' +
    '<button type="button" class="btn btn-ghost om-settings-reset">' + T.reset + '</button></div>';
  overlay.appendChild(panel);
  var accentColors = { blue: '#173B63', mail: '#0B57D0', graphite: '#24292F', indigo: '#4338CA', violet: '#5A32A3', cyan: '#0E7490', emerald: '#047857', amber: '#9A6700', rose: '#99286E' };
  var accentFamily = { blue: 'blue', mail: 'blue', indigo: 'blue', cyan: 'cool', emerald: 'cool', violet: 'purple', rose: 'purple', amber: 'warm', graphite: 'neutral' };
  var familyLabel = { blue: { en: 'Blues', ru: 'Синие' }, cool: { en: 'Cool', ru: 'Холодные' }, purple: { en: 'Purples', ru: 'Фиолетовые' }, warm: { en: 'Warm', ru: 'Тёплые' }, neutral: { en: 'Neutral', ru: 'Нейтральные' } };
  function lum(hex) {
    var c = hex.replace('#', '');
    var v = [0, 1, 2].map(function (i) { var x = parseInt(c.substr(i * 2, 2), 16) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function contrastOnWhite(hex) { return (1.05) / (lum(hex) + 0.05); }
  function wcag(r) { return r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large' : 'low'; }
  var palBlock = panel.querySelector('[data-palette-block]');
  if (palBlock) {
    var html = '<div class="om-palette-head"><h3 class="om-drawer-title">' + T.palette + '</h3><p class="om-settings-hint">' + T.paletteHint + '</p></div><div class="om-palette-cards" role="radiogroup" aria-label="' + T.palette + '">';
    Object.keys(accentColors).forEach(function (k) {
      var hex = accentColors[k];
      var r = contrastOnWhite(hex);
      var name = T[k] || k;
      var fam = familyLabel[accentFamily[k]][lang];
      html += '<button type="button" role="radio" aria-checked="false" class="om-accent-card om-accent-swatch" data-accent-swatch="' + k + '" data-wcag="' + wcag(r) + '" style="--ac:' + hex + '">' +
        '<span class="om-ac-preview" aria-hidden="true"><svg class="om-ac-svg" viewBox="0 0 96 64" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision" focusable="false"><rect x="0.5" y="0.5" width="95" height="63" rx="8" fill="var(--bg)" stroke="var(--border)"></rect><rect x="6" y="6" width="84" height="52" rx="6" fill="var(--panel)" stroke="var(--border)"></rect><rect x="12" y="13" width="34" height="5" rx="2.5" fill="var(--text)"></rect><rect x="66" y="12" width="18" height="8" rx="4" fill="var(--ac)" fill-opacity="0.16" stroke="var(--ac)"></rect><rect x="12" y="26" width="52" height="4" rx="2" fill="var(--muted)"></rect><rect x="12" y="34" width="40" height="4" rx="2" fill="var(--muted)" opacity="0.65"></rect><rect x="12" y="45" width="28" height="11" rx="4" fill="var(--ac)"></rect><rect x="17" y="49" width="18" height="3" rx="1.5" fill="#ffffff" opacity="0.92"></rect><rect x="46" y="48" width="22" height="4" rx="2" fill="var(--ac)"></rect></svg></span>' +
        '<span class="om-ac-meta"><b>' + name + '</b><small>' + fam + ' · <code>' + hex + '</code></small>' +
        '<span class="om-ac-contrast"><i class="c-dot"></i>' + r.toFixed(1) + ':1 · ' + wcag(r) + '</span></span>' +
        '<span class="om-ac-check" aria-hidden="true">✓</span></button>';
    });
    html += '</div>';
    palBlock.innerHTML = html;
    var cards = Array.prototype.slice.call(palBlock.querySelectorAll('.om-accent-card'));
    function syncCards() {
      cards.forEach(function (c) {
        var on = c.getAttribute('data-accent-swatch') === state.accent;
        c.classList.toggle('active', on);
        c.setAttribute('aria-checked', on ? 'true' : 'false');
        c.setAttribute('tabindex', on ? '0' : '-1');
      });
    }
    function pick(k) { state.accent = k; save(state); apply(state); syncCards(); }
    syncCards();
    palBlock.addEventListener('click', function (e) {
      var c = e.target.closest('.om-accent-card');
      if (c) pick(c.getAttribute('data-accent-swatch'));
    });
    palBlock.addEventListener('keydown', function (e) {
      var i = cards.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % cards.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + cards.length) % cards.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = cards.length - 1;
      if (n !== null) { e.preventDefault(); cards[n].focus(); pick(cards[n].getAttribute('data-accent-swatch')); }
    });
    window.__omSyncPalette = syncCards;
  }
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
