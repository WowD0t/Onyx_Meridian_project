(function () {
  if (window.__omPlayerV16) return;
  window.__omPlayerV16 = true;
  var mount = document.getElementById('om-player');
  if (!mount) return;
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var library = document.getElementById('om-video-library');
  var searchInput = document.getElementById('om-library-search');
  var sortSelect = document.getElementById('om-library-sort');
  var filterWrap = document.getElementById('om-library-filters');
  var countEl = document.getElementById('om-library-count');
  var T = lang === 'ru' ? {
    empty: 'Медиатека готовится', emptyBody: 'Официальные трейлеры, обзоры и гайды появятся здесь после публикации.',
    emptyCta: 'Следить за анонсами', chapters: 'Главы', noChapters: 'Главы не заданы', upNext: 'Далее', desc: 'Описание',
    play: 'Воспроизвести', pause: 'Пауза', back: '−10 секунд', forward: '+10 секунд', mute: 'Выключить звук', unmute: 'Включить звук',
    volume: 'Громкость', speed: 'Скорость', quality: 'Качество', captions: 'Субтитры', off: 'Выключены', settings: 'Настройки',
    pip: 'Картинка в картинке', theater: 'Кинотеатр', full: 'Полный экран', exitFull: 'Выйти из полного экрана',
    loop: 'Повтор видео', autoplayNext: 'Автовоспроизведение следующего', remember: 'Запоминать позицию', ambient: 'Фоновая подсветка',
    stats: 'Статистика воспроизведения', accent: 'Акцент плеера', captionSize: 'Размер субтитров', captionBg: 'Фон субтитров',
    playback: 'Воспроизведение', appearance: 'Оформление', shortcuts: 'Клавиши', normal: 'Обычная', large: 'Крупная', small: 'Мелкая',
    none: 'Без фона', semi: 'Полупрозрачный', solid: 'Плотный', resolution: 'Разрешение', buffered: 'Буфер', dropped: 'Потерянные кадры',
    rate: 'Скорость', source: 'Источник', file: 'Прямой файл', vkNote: 'VK Видео использует встроенный плеер: качество, скорость и звук управляются внутри него.',
    ytNote: 'YouTube управляет качеством автоматически. Доступны скорость, звук, главы и перемотка.',
    fileNote: 'Прямой файл: плеер полностью управляет качеством, скоростью, звуком, субтитрами и главами.',
    error: 'Не удалось загрузить видео', errorBody: 'Проверьте ссылку, CORS и доступность файла. Можно попробовать другой источник.',
    retry: 'Повторить', open: 'Открыть источник', loading: 'Загрузка…', noVideos: 'Видео пока нет', search: 'Поиск по медиатеке',
    sort: 'Сортировка', sortNew: 'Сначала новые', sortOld: 'Сначала старые', sortAz: 'По названию', sortDuration: 'По длительности',
    all: 'Все', shown: 'Показано', resume: 'Продолжить с', copied: 'Ссылка скопирована', share: 'Поделиться', next: 'Следующее видео',
    keys: 'Space/K — пауза · J/L — ±10 с · ←/→ — ±5 с · ↑/↓ — громкость · M — звук · F — полный экран · T — кинотеатр · C — субтитры · I — PiP · S — статистика · A — подсветка · ? — клавиши'
  } : {
    empty: 'The media library is being prepared', emptyBody: 'Official trailers, showcases and guides will appear here after publication.',
    emptyCta: 'Follow announcements', chapters: 'Chapters', noChapters: 'No chapters defined', upNext: 'Up next', desc: 'Description',
    play: 'Play', pause: 'Pause', back: '−10 seconds', forward: '+10 seconds', mute: 'Mute', unmute: 'Unmute',
    volume: 'Volume', speed: 'Speed', quality: 'Quality', captions: 'Captions', off: 'Off', settings: 'Settings',
    pip: 'Picture in picture', theater: 'Theater', full: 'Fullscreen', exitFull: 'Exit fullscreen',
    loop: 'Loop video', autoplayNext: 'Autoplay next', remember: 'Remember position', ambient: 'Ambient glow',
    stats: 'Playback statistics', accent: 'Player accent', captionSize: 'Caption size', captionBg: 'Caption background',
    playback: 'Playback', appearance: 'Appearance', shortcuts: 'Shortcuts', normal: 'Normal', large: 'Large', small: 'Small',
    none: 'None', semi: 'Semi-transparent', solid: 'Solid', resolution: 'Resolution', buffered: 'Buffered', dropped: 'Dropped frames',
    rate: 'Speed', source: 'Source', file: 'Direct file', vkNote: 'VK Video uses its embedded player: quality, speed and sound are controlled inside it.',
    ytNote: 'YouTube manages quality automatically. Speed, sound, chapters and seeking are available.',
    fileNote: 'Direct file: the player fully controls quality, speed, sound, subtitles and chapters.',
    error: 'Could not load the video', errorBody: 'Check the URL, CORS and file availability. You can try another source.',
    retry: 'Retry', open: 'Open source', loading: 'Loading…', noVideos: 'No videos yet', search: 'Search the media library',
    sort: 'Sort', sortNew: 'Newest first', sortOld: 'Oldest first', sortAz: 'By title', sortDuration: 'By duration',
    all: 'All', shown: 'Showing', resume: 'Resume from', copied: 'Link copied', share: 'Share', next: 'Next video',
    keys: 'Space/K pause · J/L ±10s · ←/→ ±5s · ↑/↓ volume · M mute · F fullscreen · T theater · C captions · I PiP · S stats · A ambient · ? keys'
  };
  var ACCENTS = { navy: '#3A6391', indigo: '#5A67D8', cyan: '#2B7A9E', emerald: '#2F7D46', amber: '#B07A1E', rose: '#B85C7A', mono: '#8A93A6' };
  var RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
  var PREF_KEY = 'om-player-prefs-v2';
  var prefs = { accent: 'navy', volume: 0.9, muted: false, rate: 1, loop: false, autoplayNext: false, remember: true, ambient: true, stats: false, captionSize: 'normal', captionBg: 'semi' };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (e) {}
  try { var old = JSON.parse(localStorage.getItem('om-player-prefs-v1') || '{}'); if (!localStorage.getItem(PREF_KEY)) Object.assign(prefs, old); } catch (e) {}
  function savePrefs() { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) {} }
  var videos = [], filtered = [], current = null, source = null, video = null, yt = null, timer = null, hideTimer = null, seekDragging = false, activeFilter = 'all', activeQuery = '', activeSort = 'new';
  mount.className = 'om-player-root';
  mount.innerHTML = '<div class="om-player-shell"><div class="om-player-topbar"><div class="om-player-now"><span class="om-player-live-dot"></span><span id="om-now-label">' + T.source + '</span></div><div class="om-platform-tabs" id="om-platforms" hidden></div></div><div class="om-player-layout"><div class="om-player-main"><div class="om-player-stage paused" id="om-stage" tabindex="0"><div class="om-player-empty" id="om-empty"><div class="om-empty-visual"><span></span><span></span><span></span><span></span><span></span></div><strong>' + T.empty + '</strong><p>' + T.emptyBody + '</p></div><div class="om-player-error" id="om-error" hidden><strong>' + T.error + '</strong><p>' + T.errorBody + '</p><div class="om-player-error-actions"><button type="button" class="om-player-btn" data-act="retry">' + T.retry + '</button></div></div><div class="om-player-loading" id="om-loading" hidden><i></i><span>' + T.loading + '</span></div><div class="om-player-stats-overlay" id="om-stats-overlay" hidden></div><div class="om-player-menu" id="om-menu" hidden></div></div><div class="om-player-info"><div class="om-player-info-head"><h2 class="om-player-title" id="om-title"></h2><button type="button" class="om-player-share" data-act="share" aria-label="' + T.share + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-3.4M8.6 13.3l6.8 3.4"/></svg></button></div><p class="om-player-desc" id="om-desc"></p><div class="om-player-tags" id="om-tags"></div><div class="om-player-note" id="om-note" hidden></div></div></div><aside class="om-player-side"><div class="om-player-card"><h3>' + T.chapters + '</h3><div id="om-chapters" class="om-chapter-list"></div></div><div class="om-player-card"><h3>' + T.upNext + '</h3><div id="om-side-list" class="om-side-list"></div></div></aside></div></div>';
  var stage = mount.querySelector('#om-stage');
  var empty = mount.querySelector('#om-empty');
  var errorBox = mount.querySelector('#om-error');
  var loading = mount.querySelector('#om-loading');
  var statsOverlay = mount.querySelector('#om-stats-overlay');
  var menu = mount.querySelector('#om-menu');
  var platforms = mount.querySelector('#om-platforms');
  var nowLabel = mount.querySelector('#om-now-label');
  var titleEl = mount.querySelector('#om-title');
  var descEl = mount.querySelector('#om-desc');
  var tagsEl = mount.querySelector('#om-tags');
  var noteEl = mount.querySelector('#om-note');
  var chaptersEl = mount.querySelector('#om-chapters');
  var sideList = mount.querySelector('#om-side-list');
  var controls = null, seek = null, fill = null, buffer = null, timeEl = null, playBtn = null, vol = null, muteBtn = null, chapterName = null, seekTip = null;
  function fmt(s) { s = Math.max(0, Math.floor(s || 0)); var m = Math.floor(s / 60), h = Math.floor(m / 60); m %= 60; return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
  function txt(v, k) { return lang === 'ru' ? (v[k + '_ru'] || v[k + '_en'] || '') : (v[k + '_en'] || v[k + '_ru'] || ''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function setAccent(name) { prefs.accent = ACCENTS[name] ? name : 'navy'; mount.style.setProperty('--om-player-accent', ACCENTS[prefs.accent]); savePrefs(); }
  function applyPrefs() {
    mount.classList.toggle('om-ambient', !!prefs.ambient);
    mount.dataset.captionSize = prefs.captionSize;
    mount.dataset.captionBg = prefs.captionBg;
    statsOverlay.hidden = !prefs.stats;
    if (video) { video.loop = prefs.loop; video.playbackRate = prefs.rate; video.volume = prefs.volume; video.muted = prefs.muted; }
  }
  setAccent(prefs.accent);
  function posKey(id) { return 'om-player-pos-' + id; }
  function getPos(id) { try { return parseFloat(localStorage.getItem(posKey(id)) || '0'); } catch (e) { return 0; } }
  function setPos(id, t) { try { if (prefs.remember) localStorage.setItem(posKey(id), String(t)); } catch (e) {} }
  function closeMenu() { menu.hidden = true; menu.innerHTML = ''; menu.dataset.menu = ''; }
  function destroy() {
    if (timer) { clearInterval(timer); timer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (video) { try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {} video = null; }
    if (yt && yt.destroy) { try { yt.destroy(); } catch (e) {} yt = null; }
    stage.querySelectorAll('video,iframe,.om-player-controls,.om-player-bigplay').forEach(function (el) { el.remove(); });
    controls = null; closeMenu();
  }
  function showNote(text) { noteEl.hidden = !text; noteEl.textContent = text || ''; }
  function renderChapters() {
    chaptersEl.innerHTML = '';
    var ch = (current && current.chapters) || [];
    if (!ch.length) { chaptersEl.innerHTML = '<p class="om-player-muted">' + T.noChapters + '</p>'; return; }
    ch.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'om-chapter'; b.dataset.index = String(i);
      b.innerHTML = '<time>' + fmt(c.t) + '</time><span></span>';
      b.querySelector('span').textContent = lang === 'ru' ? (c.ru || c.en) : (c.en || c.ru);
      b.addEventListener('click', function () { seekTo(c.t); });
      chaptersEl.appendChild(b);
    });
  }
  function seekTo(t) {
    if (video) { video.currentTime = t; video.play().catch(function () {}); }
    else if (yt && yt.seekTo) { yt.seekTo(t, true); yt.playVideo(); }
  }
  function sourceLabel(s) { return s.platform === 'youtube' ? 'YouTube' : s.platform === 'vk' ? 'VK Video' : (s.label || ((s.height ? s.height + 'p' : T.file))); }
  function renderPlatforms() {
    platforms.innerHTML = '';
    if (!current) { platforms.hidden = true; return; }
    var seen = {}, list = [];
    (current.sources || []).forEach(function (s) { var k = s.platform === 'file' ? 'file' : s.platform; if (!seen[k]) { seen[k] = true; list.push(k); } });
    platforms.hidden = list.length < 2;
    list.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'om-platform-tab' + (source && (source.platform === p || (p === 'file' && source.platform === 'file')) ? ' active' : '');
      b.textContent = p === 'youtube' ? 'YouTube' : p === 'vk' ? 'VK' : T.file;
      b.addEventListener('click', function () { var s = (current.sources || []).filter(function (x) { return p === 'file' ? x.platform === 'file' : x.platform === p; })[0]; if (s) playSource(s, true); });
      platforms.appendChild(b);
    });
  }
  function videoTags(v) { var tags = (v.tags || []).slice(); return tags; }
  function renderFilters() {
    if (!filterWrap) return;
    var tags = {};
    videos.forEach(function (v) { videoTags(v).forEach(function (t) { tags[t] = true; }); });
    filterWrap.innerHTML = '';
    var all = document.createElement('button'); all.type = 'button'; all.className = 'om-filter-chip' + (activeFilter === 'all' ? ' active' : ''); all.textContent = T.all;
    all.addEventListener('click', function () { activeFilter = 'all'; applyLibrary(); });
    filterWrap.appendChild(all);
    Object.keys(tags).forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'om-filter-chip' + (activeFilter === t ? ' active' : ''); b.textContent = t;
      b.addEventListener('click', function () { activeFilter = t; applyLibrary(); });
      filterWrap.appendChild(b);
    });
  }
  function applyLibrary() {
    filtered = videos.slice();
    if (activeQuery) filtered = filtered.filter(function (v) { return (txt(v, 'title') + ' ' + txt(v, 'desc') + ' ' + videoTags(v).join(' ')).toLowerCase().indexOf(activeQuery) >= 0; });
    if (activeFilter !== 'all') filtered = filtered.filter(function (v) { return videoTags(v).indexOf(activeFilter) >= 0; });
    if (activeSort === 'az') filtered.sort(function (a, b) { return txt(a, 'title').localeCompare(txt(b, 'title')); });
    else if (activeSort === 'duration') filtered.sort(function (a, b) { return (b.duration || 0) - (a.duration || 0); });
    else if (activeSort === 'old') filtered.reverse();
    renderCards(library, false);
    renderFilters();
    if (countEl) countEl.textContent = T.shown + ': ' + filtered.length + ' / ' + videos.length;
  }
  function renderCards(target, compact) {
    if (!target) return;
    target.innerHTML = '';
    var list = compact ? videos : filtered;
    if (!list.length) { target.innerHTML = '<div class="om-library-empty"><strong>' + T.noVideos + '</strong><span>' + T.emptyBody + '</span></div>'; return; }
    list.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'om-video-card' + (current && current.id === v.id ? ' active' : '');
      var poster = v.poster || '';
      var badges = (v.sources || []).map(function (s) { return s.platform === 'youtube' ? 'YouTube' : s.platform === 'vk' ? 'VK' : (lang === 'ru' ? 'Файл' : 'File'); }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' · ');
      b.innerHTML = '<div class="om-video-thumb">' + (poster ? '<img alt="" loading="lazy"/>' : '<div class="om-thumb-fallback"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></svg></div>') + (v.duration ? '<span class="om-video-duration">' + fmt(v.duration) + '</span>' : '') + '<span class="om-video-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div><div class="om-video-card-body"><strong></strong><small></small><div class="om-video-card-tags"></div></div>';
      if (poster) b.querySelector('img').src = poster;
      b.querySelector('strong').textContent = txt(v, 'title');
      b.querySelector('small').textContent = badges;
      var tagWrap = b.querySelector('.om-video-card-tags');
      videoTags(v).slice(0, 3).forEach(function (t) { var s = document.createElement('span'); s.textContent = t; tagWrap.appendChild(s); });
      b.addEventListener('click', function () { selectVideo(v); if (!compact) mount.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      target.appendChild(b);
    });
  }
  function icon(name) {
    var p = {
      play: '<path d="M8 5v14l11-7z"/>', pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
      back: '<path d="M11 19 2 12l9-7v14zM22 19l-9-7 9-7v14z"/>', forward: '<path d="m13 19 9-7-9-7v14zM2 19l9-7-9-7v14z"/>',
      volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>', mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
      captions: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15h4M13 15h4M7 11h2M13 11h4"/>',
      quality: '<path d="M4 7h16M4 12h10M4 17h7"/><circle cx="18" cy="16" r="3"/>',
      rate: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/>',
      pip: '<rect x="3" y="5" width="18" height="14" rx="2"/><rect x="12" y="12" width="7" height="5" rx="1"/>',
      theater: '<rect x="3" y="6" width="18" height="12" rx="2"/>',
      full: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',
      exitFull: '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>'
    };
    var fill = name === 'play' || name === 'pause' || name === 'back' || name === 'forward';
    return '<svg viewBox="0 0 24 24" ' + (fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') + '>' + (p[name] || '') + '</svg>';
  }
  function btn(act, label, ic, text) { return '<button type="button" class="om-player-btn" data-act="' + act + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + (ic ? icon(ic) : '') + (text ? '<span>' + esc(text) + '</span>' : '') + '</button>'; }
  function buildFileControls() {
    controls = document.createElement('div');
    controls.className = 'om-player-controls force';
    controls.innerHTML = '<div class="om-player-seek"><div class="om-player-seek-track"><div class="om-player-seek-buffer"></div><div class="om-player-seek-fill"></div><div class="om-player-seek-marks"></div></div><div class="om-player-seek-tip" hidden>0:00</div><input type="range" min="0" max="1000" value="0" aria-label="' + T.play + '"/></div><div class="om-player-row"><div class="om-player-row-left">' + btn('play', T.play, 'play') + btn('back', T.back, null, '−10') + btn('forward', T.forward, null, '+10') + '<div class="om-player-volume">' + btn('mute', T.mute, 'volume') + '<input type="range" min="0" max="100" value="' + Math.round(prefs.volume * 100) + '" aria-label="' + T.volume + '"/></div><span class="om-player-time">0:00 / 0:00</span><span class="om-player-chapter-name"></span></div><div class="om-player-row-right">' + btn('captions', T.captions, 'captions') + btn('quality', T.quality, 'quality') + btn('rate', T.speed, null, '1×') + btn('settings', T.settings, 'settings') + btn('pip', T.pip, 'pip') + btn('theater', T.theater, 'theater') + btn('full', T.full, 'full') + '</div></div>';
    stage.appendChild(controls);
    seek = controls.querySelector('.om-player-seek input');
    fill = controls.querySelector('.om-player-seek-fill');
    buffer = controls.querySelector('.om-player-seek-buffer');
    timeEl = controls.querySelector('.om-player-time');
    playBtn = controls.querySelector('[data-act="play"]');
    vol = controls.querySelector('.om-player-volume input');
    muteBtn = controls.querySelector('[data-act="mute"]');
    chapterName = controls.querySelector('.om-player-chapter-name');
    seekTip = controls.querySelector('.om-player-seek-tip');
    var marks = controls.querySelector('.om-player-seek-marks');
    function drawMarks() {
      marks.innerHTML = '';
      if (!video || !video.duration) return;
      (current.chapters || []).forEach(function (c) { var m = document.createElement('span'); m.className = 'om-player-seek-mark'; m.style.left = (c.t / video.duration * 100) + '%'; marks.appendChild(m); });
    }
    playBtn.addEventListener('click', togglePlay);
    controls.querySelector('[data-act="back"]').addEventListener('click', function () { if (video) video.currentTime = Math.max(0, video.currentTime - 10); });
    controls.querySelector('[data-act="forward"]').addEventListener('click', function () { if (video) video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); });
    muteBtn.addEventListener('click', function () { if (!video) return; video.muted = !video.muted; prefs.muted = video.muted; savePrefs(); syncVolume(); });
    vol.addEventListener('input', function () { if (!video) return; video.volume = vol.value / 100; video.muted = false; prefs.volume = video.volume; prefs.muted = false; savePrefs(); syncVolume(); });
    seek.addEventListener('input', function () { seekDragging = true; if (video && video.duration) { var t = video.duration * seek.value / 1000; fill.style.width = (seek.value / 10) + '%'; timeEl.textContent = fmt(t) + ' / ' + fmt(video.duration); } });
    seek.addEventListener('change', function () { seekDragging = false; if (video && video.duration) video.currentTime = video.duration * seek.value / 1000; });
    var seekWrap = controls.querySelector('.om-player-seek');
    seekWrap.addEventListener('mousemove', function (e) { if (!video || !video.duration) return; var r = seekWrap.getBoundingClientRect(); var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); seekTip.hidden = false; seekTip.style.left = (p * 100) + '%'; seekTip.textContent = fmt(p * video.duration); });
    seekWrap.addEventListener('mouseleave', function () { seekTip.hidden = true; });
    controls.querySelector('[data-act="captions"]').addEventListener('click', function () { openMenu('captions'); });
    controls.querySelector('[data-act="quality"]').addEventListener('click', function () { openMenu('quality'); });
    controls.querySelector('[data-act="rate"]').addEventListener('click', function () { openMenu('rate'); });
    controls.querySelector('[data-act="settings"]').addEventListener('click', function () { openMenu('settings'); });
    controls.querySelector('[data-act="pip"]').addEventListener('click', togglePip);
    controls.querySelector('[data-act="theater"]').addEventListener('click', toggleTheater);
    controls.querySelector('[data-act="full"]').addEventListener('click', toggleFull);
    timer = setInterval(function () {
      if (!video) return;
      var dur = video.duration || 0, cur = video.currentTime || 0;
      if (!seekDragging && dur) { seek.value = Math.round(cur / dur * 1000); fill.style.width = (cur / dur * 100) + '%'; }
      if (video.buffered.length && dur) buffer.style.width = (video.buffered.end(video.buffered.length - 1) / dur * 100) + '%';
      timeEl.textContent = fmt(cur) + ' / ' + fmt(dur);
      playBtn.innerHTML = icon(video.paused ? 'play' : 'pause');
      playBtn.setAttribute('aria-label', video.paused ? T.play : T.pause);
      stage.classList.toggle('paused', video.paused);
      var active = -1; (current.chapters || []).forEach(function (c, i) { if (cur >= c.t) active = i; });
      chaptersEl.querySelectorAll('.om-chapter').forEach(function (el, i) { el.classList.toggle('active', i === active); });
      if (chapterName) chapterName.textContent = active >= 0 ? ((lang === 'ru' ? (current.chapters[active].ru || current.chapters[active].en) : (current.chapters[active].en || current.chapters[active].ru)) || '') : '';
      if (prefs.stats) {
        var q = video.getVideoPlaybackQuality ? video.getVideoPlaybackQuality() : null;
        var buf = video.buffered.length && dur ? Math.round(video.buffered.end(video.buffered.length - 1) / dur * 100) : 0;
        statsOverlay.innerHTML = '<span>' + T.resolution + ': ' + (video.videoWidth || '—') + '×' + (video.videoHeight || '—') + '</span><span>' + T.rate + ': ' + video.playbackRate + '×</span><span>' + T.buffered + ': ' + buf + '%</span><span>' + T.dropped + ': ' + (q ? q.droppedVideoFrames : '—') + '</span><span>' + T.source + ': ' + esc(sourceLabel(source)) + '</span>';
      }
      if (dur && cur > 0) setPos(current.id, cur);
      syncVolume();
    }, 250);
    video.addEventListener('loadedmetadata', drawMarks);
    syncVolume();
  }
  function syncVolume() {
    if (!video || !muteBtn) return;
    muteBtn.innerHTML = icon(video.muted || video.volume === 0 ? 'mute' : 'volume');
    muteBtn.setAttribute('aria-label', video.muted ? T.unmute : T.mute);
    if (vol && document.activeElement !== vol) vol.value = String(Math.round((video.muted ? 0 : video.volume) * 100));
  }
  function menuItem(label, active, onClick, extra) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'om-menu-item' + (active ? ' active' : '');
    b.innerHTML = '<span>' + esc(label) + '</span>' + (extra ? '<small>' + esc(extra) + '</small>' : '') + (active ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12 5 5 9-10"/></svg>' : '');
    b.addEventListener('click', onClick);
    return b;
  }
  function openMenu(name) {
    if (!menu.hidden && menu.dataset.menu === name) { closeMenu(); return; }
    menu.dataset.menu = name; menu.hidden = false; menu.innerHTML = '';
    var head = document.createElement('div'); head.className = 'om-menu-head';
    head.textContent = name === 'quality' ? T.quality : name === 'rate' ? T.speed : name === 'captions' ? T.captions : T.settings;
    menu.appendChild(head);
    if (name === 'quality') {
      var fileSources = (current.sources || []).filter(function (s) { return s.platform === 'file'; });
      fileSources.forEach(function (s) { menu.appendChild(menuItem(sourceLabel(s), source === s, function () { closeMenu(); playSource(s, true); }, s.height ? s.height + 'p' : '')); });
      if (!fileSources.length) menu.appendChild(menuItem(T.off, true, function () {}));
    } else if (name === 'rate') {
      RATES.forEach(function (r) { menu.appendChild(menuItem(r + '×', prefs.rate === r, function () { prefs.rate = r; savePrefs(); if (video) video.playbackRate = r; var b = controls && controls.querySelector('[data-act="rate"] span'); if (b) b.textContent = r + '×'; closeMenu(); })); });
    } else if (name === 'captions') {
      menu.appendChild(menuItem(T.off, !video || !Array.prototype.some.call(video.textTracks, function (t) { return t.mode === 'showing'; }), function () { if (video) Array.prototype.forEach.call(video.textTracks, function (t) { t.mode = 'disabled'; }); closeMenu(); }));
      (current.subtitles || []).forEach(function (s, i) {
        menu.appendChild(menuItem(s.label || s.lang, video && video.textTracks[i] && video.textTracks[i].mode === 'showing', function () { if (video) Array.prototype.forEach.call(video.textTracks, function (t, j) { t.mode = j === i ? 'showing' : 'disabled'; }); closeMenu(); }));
      });
    } else if (name === 'settings') {
      menu.classList.add('om-menu-settings');
      var tabs = document.createElement('div'); tabs.className = 'om-menu-tabs';
      var body = document.createElement('div'); body.className = 'om-menu-body';
      var sections = { playback: T.playback, appearance: T.appearance, shortcuts: T.shortcuts };
      function showTab(key) {
        tabs.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === key); });
        body.innerHTML = '';
        if (key === 'playback') {
          [['loop', T.loop], ['autoplayNext', T.autoplayNext], ['remember', T.remember], ['stats', T.stats]].forEach(function (row) {
            var label = document.createElement('label'); label.className = 'om-menu-toggle';
            label.innerHTML = '<span>' + row[1] + '</span><input type="checkbox" ' + (prefs[row[0]] ? 'checked' : '') + '/>';
            label.querySelector('input').addEventListener('change', function (e) { prefs[row[0]] = e.target.checked; savePrefs(); applyPrefs(); });
            body.appendChild(label);
          });
        } else if (key === 'appearance') {
          var acc = document.createElement('div'); acc.className = 'om-menu-accents';
          Object.keys(ACCENTS).forEach(function (k) {
            var b = document.createElement('button'); b.type = 'button'; b.className = 'om-player-accent' + (prefs.accent === k ? ' active' : ''); b.style.background = ACCENTS[k]; b.setAttribute('aria-label', k);
            b.addEventListener('click', function () { setAccent(k); acc.querySelectorAll('.om-player-accent').forEach(function (x) { x.classList.toggle('active', x === b); }); });
            acc.appendChild(b);
          });
          body.appendChild(acc);
          var amb = document.createElement('label'); amb.className = 'om-menu-toggle'; amb.innerHTML = '<span>' + T.ambient + '</span><input type="checkbox" ' + (prefs.ambient ? 'checked' : '') + '/>';
          amb.querySelector('input').addEventListener('change', function (e) { prefs.ambient = e.target.checked; savePrefs(); applyPrefs(); });
          body.appendChild(amb);
          var size = document.createElement('div'); size.className = 'om-menu-seg';
          [['small', T.small], ['normal', T.normal], ['large', T.large]].forEach(function (o) {
            var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1]; b.className = prefs.captionSize === o[0] ? 'active' : '';
            b.addEventListener('click', function () { prefs.captionSize = o[0]; savePrefs(); applyPrefs(); size.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); }); });
            size.appendChild(b);
          });
          body.appendChild(size);
          var bg = document.createElement('div'); bg.className = 'om-menu-seg';
          [['none', T.none], ['semi', T.semi], ['solid', T.solid]].forEach(function (o) {
            var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1]; b.className = prefs.captionBg === o[0] ? 'active' : '';
            b.addEventListener('click', function () { prefs.captionBg = o[0]; savePrefs(); applyPrefs(); bg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); }); });
            bg.appendChild(b);
          });
          body.appendChild(bg);
        } else {
          var p = document.createElement('p'); p.className = 'om-menu-keys'; p.textContent = T.keys; body.appendChild(p);
        }
      }
      Object.keys(sections).forEach(function (k) {
        var b = document.createElement('button'); b.type = 'button'; b.dataset.tab = k; b.textContent = sections[k];
        b.addEventListener('click', function () { showTab(k); });
        tabs.appendChild(b);
      });
      menu.appendChild(tabs); menu.appendChild(body); showTab('playback');
    }
  }
  function togglePlay() { if (!video) return; if (video.paused) video.play().catch(function () {}); else video.pause(); }
  function togglePip() { if (!video) return; if (document.pictureInPictureElement) document.exitPictureInPicture().catch(function () {}); else if (video.requestPictureInPicture) video.requestPictureInPicture().catch(function () {}); }
  function toggleTheater() { mount.classList.toggle('theater'); }
  function toggleFull() {
    var fs = document.fullscreenElement;
    var fullBtn = controls && controls.querySelector('[data-act="full"]');
    if (fs) document.exitFullscreen().catch(function () {});
    else if (mount.requestFullscreen) mount.requestFullscreen().catch(function () {});
    if (fullBtn) fullBtn.innerHTML = icon(fs ? 'full' : 'exitFull');
  }
  document.addEventListener('fullscreenchange', function () { var b = controls && controls.querySelector('[data-act="full"]'); if (b) b.innerHTML = icon(document.fullscreenElement ? 'exitFull' : 'full'); });
  function scheduleHide() {
    if (!controls) return;
    controls.classList.add('force');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { if (video && !video.paused && menu.hidden) controls.classList.remove('force'); }, 2600);
  }
  stage.addEventListener('mousemove', scheduleHide);
  stage.addEventListener('focusin', scheduleHide);
  stage.addEventListener('click', function (e) { if (e.target === video || e.target.classList.contains('om-player-bigplay')) return; if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('[data-act]')) closeMenu(); });
  stage.addEventListener('dblclick', function (e) { if (e.target === video) toggleFull(); });
  stage.addEventListener('keydown', function (e) {
    if (!video || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    var k = e.key.toLowerCase();
    if (k === ' ' || k === 'k') { e.preventDefault(); togglePlay(); }
    else if (k === 'j') video.currentTime = Math.max(0, video.currentTime - 10);
    else if (k === 'l') video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    else if (k === 'arrowleft') { e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); }
    else if (k === 'arrowright') { e.preventDefault(); video.currentTime = Math.min(video.duration || 0, video.currentTime + 5); }
    else if (k === 'arrowup') { e.preventDefault(); video.volume = Math.min(1, video.volume + 0.05); prefs.volume = video.volume; savePrefs(); }
    else if (k === 'arrowdown') { e.preventDefault(); video.volume = Math.max(0, video.volume - 0.05); prefs.volume = video.volume; savePrefs(); }
    else if (k === 'm') { video.muted = !video.muted; prefs.muted = video.muted; savePrefs(); }
    else if (k === 'f') toggleFull();
    else if (k === 't') toggleTheater();
    else if (k === 'i') togglePip();
    else if (k === 's') { prefs.stats = !prefs.stats; savePrefs(); applyPrefs(); }
    else if (k === 'a') { prefs.ambient = !prefs.ambient; savePrefs(); applyPrefs(); }
    else if (k === 'c') { var tr = video.textTracks[0]; if (tr) tr.mode = tr.mode === 'showing' ? 'disabled' : 'showing'; }
    else if (k === '?') openMenu('settings');
    else if (k === '[') { prefs.rate = Math.max(0.25, prefs.rate - 0.25); savePrefs(); video.playbackRate = prefs.rate; }
    else if (k === ']') { prefs.rate = Math.min(3, prefs.rate + 0.25); savePrefs(); video.playbackRate = prefs.rate; }
  });
  function playSource(s, keepTime) {
    var t = keepTime && video ? video.currentTime : (keepTime && yt && yt.getCurrentTime ? yt.getCurrentTime() : 0);
    var wasPlaying = keepTime && video ? !video.paused : false;
    destroy();
    source = s;
    empty.style.display = 'none';
    errorBox.hidden = true;
    renderPlatforms();
    nowLabel.textContent = sourceLabel(s);
    showNote(s.platform === 'vk' ? T.vkNote : s.platform === 'youtube' ? T.ytNote : T.fileNote);
    if (s.platform === 'file') {
      video = document.createElement('video');
      video.playsInline = true;
      video.preload = 'metadata';
      if (s.cors) video.crossOrigin = 'anonymous';
      if (current.poster) video.poster = current.poster;
      (current.subtitles || []).forEach(function (sub) { var tr = document.createElement('track'); tr.kind = 'subtitles'; tr.srclang = sub.lang || 'ru'; tr.label = sub.label || sub.lang; tr.src = sub.url; video.appendChild(tr); });
      video.src = s.url;
      video.volume = prefs.volume; video.muted = prefs.muted; video.playbackRate = prefs.rate; video.loop = prefs.loop;
      stage.appendChild(video);
      var big = document.createElement('button');
      big.type = 'button'; big.className = 'om-player-bigplay'; big.setAttribute('aria-label', T.play);
      big.innerHTML = '<span>' + icon('play') + '</span>';
      big.addEventListener('click', togglePlay);
      stage.appendChild(big);
      buildFileControls();
      applyPrefs();
      var rateBtn = controls.querySelector('[data-act="rate"] span'); if (rateBtn) rateBtn.textContent = prefs.rate + '×';
      loading.hidden = false;
      video.addEventListener('loadedmetadata', function () {
        loading.hidden = true;
        var saved = getPos(current.id);
        if (keepTime && t) video.currentTime = t;
        else if (prefs.remember && saved > 1 && saved < (video.duration || 0) - 5) video.currentTime = saved;
        if (wasPlaying) video.play().catch(function () {});
      });
      video.addEventListener('waiting', function () { loading.hidden = false; });
      video.addEventListener('playing', function () { loading.hidden = true; });
      video.addEventListener('canplay', function () { loading.hidden = true; });
      video.addEventListener('error', function () { loading.hidden = true; errorBox.hidden = false; });
      video.addEventListener('ended', function () { setPos(current.id, 0); if (prefs.autoplayNext) nextVideo(); });
      video.addEventListener('play', scheduleHide);
      video.addEventListener('pause', function () { stage.classList.add('paused'); if (controls) controls.classList.add('force'); });
      errorBox.querySelector('[data-act="retry"]').addEventListener('click', function () { playSource(s, false); });
    } else if (s.platform === 'youtube') {
      var div = document.createElement('div'); div.id = 'om-yt'; div.className = 'om-player-embed'; stage.appendChild(div);
      loadYT(function () {
        yt = new YT.Player('om-yt', {
          videoId: s.videoId,
          playerVars: { controls: 1, rel: 0, playsinline: 1, modestbranding: 1 },
          events: { onReady: function (ev) { var p = ev && ev.target ? ev.target : yt; if (!p) return; if (keepTime && t && p.seekTo) p.seekTo(t, true); if (p.setPlaybackRate) p.setPlaybackRate(prefs.rate); } }
        });
      });
    } else if (s.platform === 'vk') {
      var parts = String(s.videoId).split('_');
      var iframe = document.createElement('iframe');
      iframe.className = 'om-player-embed';
      var src = 'https://vk.com/video_ext.php?oid=' + encodeURIComponent(parts[0]) + '&id=' + encodeURIComponent(parts[1] || '');
      if (s.hash) src += '&hash=' + encodeURIComponent(s.hash);
      iframe.src = src;
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      stage.appendChild(iframe);
    }
  }
  function nextVideo() {
    if (!current || !videos.length) return;
    var i = videos.indexOf(current);
    var n = videos[(i + 1) % videos.length];
    if (n) selectVideo(n);
  }
  function selectVideo(v) {
    current = v;
    titleEl.textContent = txt(v, 'title');
    descEl.textContent = txt(v, 'desc');
    tagsEl.innerHTML = '';
    videoTags(v).forEach(function (t) { var s = document.createElement('span'); s.className = 'om-player-tag'; s.textContent = t; tagsEl.appendChild(s); });
    renderChapters();
    renderCards(sideList, true);
    applyLibrary();
    var s = (v.sources || []).filter(function (x) { return x.platform === 'file'; })[0] || (v.sources || [])[0];
    if (s) playSource(s, false);
    try { history.replaceState(null, '', '#' + encodeURIComponent(v.id)); } catch (e) {}
  }
  function loadYT(cb) {
    if (window.YT && window.YT.Player) { cb(); return; }
    window.onYouTubeIframeAPIReady = function () { cb(); };
    if (!document.getElementById('yt-api')) { var s = document.createElement('script'); s.id = 'yt-api'; s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); }
  }
  mount.querySelector('[data-act="share"]').addEventListener('click', function () {
    var url = location.href.split('#')[0] + (current ? '#' + encodeURIComponent(current.id) : '');
    if (navigator.share) navigator.share({ title: current ? txt(current, 'title') : document.title, url: url }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { if (window.OMToast) window.OMToast.show({ kind: 'success', title: T.copied, body: url, timeout: 2400 }); });
  });
  if (searchInput) searchInput.addEventListener('input', function () { activeQuery = searchInput.value.trim().toLowerCase(); applyLibrary(); });
  if (sortSelect) sortSelect.addEventListener('change', function () { activeSort = sortSelect.value; applyLibrary(); });
  fetch(root + 'videos.json?ts=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
    videos = (j && j.videos) || [];
    if (j && j.settings && j.settings.accent && !localStorage.getItem(PREF_KEY)) setAccent(j.settings.accent);
    filtered = videos.slice();
    applyLibrary();
    renderCards(sideList, true);
    var hash = decodeURIComponent(location.hash.replace('#', ''));
    var initial = videos.filter(function (v) { return v.id === hash; })[0] || videos[0];
    if (initial) selectVideo(initial);
    else { empty.style.display = 'flex'; titleEl.textContent = T.empty; descEl.textContent = T.emptyBody; renderChapters(); nowLabel.textContent = T.source; }
  }).catch(function () { empty.style.display = 'flex'; titleEl.textContent = T.empty; descEl.textContent = T.emptyBody; });
  applyPrefs();
  window.OMPlayer = { select: function (id) { var v = videos.filter(function (x) { return x.id === id; })[0]; if (v) selectVideo(v); }, refresh: applyLibrary };
})();
