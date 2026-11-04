(function () {
  'use strict';
  var root = document.documentElement;
  var lang = root.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var center = document.getElementById('notification-center');
  if (!center || window.__omNotifications) return;
  window.__omNotifications = true;
  var addonTarget = center.getAttribute('data-target') || 'gloamguise/index.html#updates';
  var licenseTarget = center.getAttribute('data-target-license') || 'license.html';
  var officialTarget = center.getAttribute('data-target-official') || 'index.html#official';
  var key = 'om-notifications-read-v2';
  var items = [
    {
      id: 'gloamguise-next-update-2026-10',
      kind: { en: 'Add-on update', ru: 'Обновление аддона' },
      title: { en: 'Gloamguise: a new update is coming', ru: 'Gloamguise: совсем скоро выйдет обновление' },
      body: {
        en: 'Bug fixes, reworked logic, more vanilla glass blocks and a larger camouflage registry are in progress. Open the add-on page to see what is planned.',
        ru: 'Готовятся исправления багов, переработанная логика, больше ванильных стеклянных блоков и расширенный реестр камуфляжа. Откройте страницу аддона, чтобы посмотреть, что планируется.'
      },
      when: { en: 'Coming soon', ru: 'Совсем скоро' },
      cta: { en: 'See what is coming', ru: 'Посмотреть, что добавят' },
      href: addonTarget
    },
    {
      id: 'om-eula-v3-1-2026-11',
      kind: { en: 'Licence', ru: 'Лицензия' },
      title: { en: 'OM Studio EULA v3.1 is published', ru: 'Опубликована OM Studio EULA v3.1' },
      body: {
        en: 'One general studio licence for every Work. English authoritative text, official Russian translation, clearer official channels and a written permission process.',
        ru: 'Одна общая лицензия студии для каждой Работы. Английский текст имеет силу, русский — официальный перевод, яснее официальные каналы и письменный процесс разрешений.'
      },
      when: { en: '4 Nov 2026', ru: '4 ноя 2026' },
      cta: { en: 'Read licence v3.1', ru: 'Читать лицензию v3.1' },
      href: licenseTarget
    },
    {
      id: 'official-sources-2026-11',
      kind: { en: 'Official channels', ru: 'Официальные каналы' },
      title: { en: 'Official sources', ru: 'Официальные источники' },
      body: {
        en: 'The studio website, studio Wiki, add-on repository, add-on Wiki, CurseForge and VK are listed. Everything published by the GitHub account WowD0t is official by rule. Mirrors and reposts are not official unless announced in writing.',
        ru: 'Перечислены сайт студии, вики студии, репозиторий аддона, вики аддона, CurseForge и VK. Всё, что выпущено GitHub-аккаунтом WowD0t, официально по правилу. Зеркала и репосты не официальны, если не объявлены письменно.'
      },
      when: { en: '4 Nov 2026', ru: '4 ноя 2026' },
      cta: { en: 'View official sources', ru: 'Смотреть источники' },
      href: officialTarget
    }
  ];
  var text = {
    en: { open: 'Studio notifications', title: 'Studio bulletin', sub: 'Releases, licence and official channels', markAll: 'Mark all read', mark: 'Mark read', read: 'Read', empty: 'No unread updates', foot: 'Read status is saved on this device.', close: 'Close notifications', new: 'New', unread: 'unread updates' },
    ru: { open: 'Уведомления студии', title: 'Бюллетень студии', sub: 'Релизы, лицензия и официальные каналы', markAll: 'Прочитать всё', mark: 'Отметить прочитанным', read: 'Прочитано', empty: 'Непрочитанных обновлений нет', foot: 'Статус прочтения хранится на этом устройстве.', close: 'Закрыть уведомления', new: 'Новое', unread: 'непрочитанных обновлений' }
  }[lang];
  var read = {};
  try {
    var saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) saved.forEach(function (id) { read[id] = true; });
  } catch (e) {}
  function save() {
    try { localStorage.setItem(key, JSON.stringify(Object.keys(read))); } catch (e) {}
  }
  function unreadCount() {
    return items.filter(function (item) { return !read[item.id]; }).length;
  }
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'iconbtn notification-btn';
  button.id = 'notification-btn';
  button.setAttribute('aria-controls', 'notification-panel');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg><span class="notification-count" aria-hidden="true"></span>';
  center.appendChild(button);
  var panel = document.createElement('section');
  panel.className = 'notification-panel';
  panel.id = 'notification-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', text.title);
  panel.hidden = true;
  document.body.appendChild(panel);
  var count = button.querySelector('.notification-count');
  var isOpen = false;
  function render() {
    var n = unreadCount();
    count.textContent = n > 9 ? '9+' : String(n);
    count.hidden = n === 0;
    button.classList.toggle('has-unread', n > 0);
    button.setAttribute('aria-label', text.open + (n ? ' · ' + n + ' ' + text.unread : ''));
    panel.innerHTML = '';
    var head = document.createElement('div');
    head.className = 'notification-head';
    var heading = document.createElement('div');
    var h = document.createElement('h2');
    h.textContent = text.title;
    var p = document.createElement('p');
    p.textContent = text.sub;
    heading.appendChild(h);
    heading.appendChild(p);
    var actions = document.createElement('div');
    actions.className = 'notification-head-actions';
    var markAll = document.createElement('button');
    markAll.type = 'button';
    markAll.className = 'notification-mark-all';
    markAll.textContent = text.markAll;
    markAll.disabled = n === 0;
    markAll.addEventListener('click', function () {
      items.forEach(function (item) { read[item.id] = true; });
      save();
      render();
    });
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'notification-close';
    close.setAttribute('aria-label', text.close);
    close.textContent = '×';
    close.addEventListener('click', function () { setOpen(false); });
    actions.appendChild(markAll);
    actions.appendChild(close);
    head.appendChild(heading);
    head.appendChild(actions);
    panel.appendChild(head);
    var list = document.createElement('div');
    list.className = 'notification-list';
    items.forEach(function (item) {
      var isRead = !!read[item.id];
      var article = document.createElement('article');
      article.className = 'notification-item' + (isRead ? ' is-read' : '');
      var top = document.createElement('div');
      top.className = 'notification-item-top';
      var kind = document.createElement('span');
      kind.className = 'notification-kind';
      kind.textContent = item.kind[lang];
      var when = document.createElement('span');
      when.className = 'notification-when';
      when.textContent = item.when[lang];
      top.appendChild(kind);
      top.appendChild(when);
      var title = document.createElement('h3');
      title.textContent = item.title[lang];
      if (!isRead) {
        var badge = document.createElement('span');
        badge.className = 'notification-new';
        badge.textContent = text.new;
        title.appendChild(badge);
      }
      var body = document.createElement('p');
      body.textContent = item.body[lang];
      var foot = document.createElement('div');
      foot.className = 'notification-item-foot';
      var link = document.createElement('a');
      link.className = 'notification-cta';
      link.href = item.href;
      link.textContent = item.cta[lang] + ' →';
      link.addEventListener('click', function () {
        read[item.id] = true;
        save();
      });
      var mark = document.createElement('button');
      mark.type = 'button';
      mark.className = 'notification-mark';
      mark.textContent = isRead ? text.read : text.mark;
      mark.disabled = isRead;
      mark.addEventListener('click', function () {
        read[item.id] = true;
        save();
        render();
      });
      foot.appendChild(link);
      foot.appendChild(mark);
      article.appendChild(top);
      article.appendChild(title);
      article.appendChild(body);
      article.appendChild(foot);
      list.appendChild(article);
    });
    panel.appendChild(list);
    var foot = document.createElement('div');
    foot.className = 'notification-foot';
    foot.textContent = n ? text.foot : text.empty + ' · ' + text.foot;
    panel.appendChild(foot);
  }
  function setOpen(open) {
    isOpen = open;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      render();
      panel.hidden = false;
      requestAnimationFrame(function () { panel.classList.add('open'); });
      var close = panel.querySelector('.notification-close');
      if (close) close.focus();
    } else {
      panel.classList.remove('open');
      panel.hidden = true;
      button.focus();
    }
  }
  button.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!isOpen);
  });
  document.addEventListener('click', function (e) {
    var opener = e.target.closest ? e.target.closest('[data-notification-open]') : null;
    if (opener) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (isOpen && !panel.contains(e.target) && !button.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setOpen(false);
    }
  });
  window.addEventListener('pageshow', function () {
    panel.classList.remove('open');
    panel.hidden = true;
    isOpen = false;
    button.setAttribute('aria-expanded', 'false');
    render();
  });
  render();
})();
