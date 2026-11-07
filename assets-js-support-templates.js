(function () {
  var message = document.getElementById('message');
  var topic = document.getElementById('topic');
  var project = document.getElementById('project');
  var summary = document.getElementById('summary');
  if (!message) return;
  var lang = document.documentElement.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var T = lang === 'ru' ? {
    title: 'Шаблоны запроса разрешения',
    video: 'Видео / обзор', modpack: 'Сборка / модпак', server: 'Сервер / Realm', translation: 'Перевод', port: 'Порт', commercial: 'Коммерция',
    templates: {
      video: 'Здравствуйте! Я хочу использовать Gloamguise: False Facades в видео/обзоре. Ссылка на канал: … Я укажу автора и ссылку на официальный проект: …',
      modpack: 'Здравствуйте! Я хочу добавить Gloamguise: False Facades в сборку/модпак. Название и ссылка: … Сборка будет распространяться: … Я сохраню лицензию и укажу автора.',
      server: 'Здравствуйте! Я хочу использовать Gloamguise: False Facades на сервере/Realm. Название и адрес: … Доступ: … Я не буду распространять файлы аддона отдельно.',
      translation: 'Здравствуйте! Я хочу сделать перевод документации/страницы на язык: … Ссылка на пример: … Я сохраню авторство и официальную лицензию.',
      port: 'Здравствуйте! Я хочу сделать порт/адаптацию под: … Цель и платформа: … Я прошу письменное разрешение и сохраню авторство.',
      commercial: 'Здравствуйте! Я хочу коммерческое использование: … Описание проекта: … Условия и ссылка: … Я прошу письменное разрешение.'
    }
  } : {
    title: 'Permission request templates',
    video: 'Video / showcase', modpack: 'Modpack', server: 'Server / Realm', translation: 'Translation', port: 'Port', commercial: 'Commercial',
    templates: {
      video: 'Hello! I would like to use Gloamguise: False Facades in a video/showcase. Channel link: … I will credit the author and link the official project: …',
      modpack: 'Hello! I would like to include Gloamguise: False Facades in a modpack. Name and link: … Distribution: … I will keep the licence and credit the author.',
      server: 'Hello! I would like to use Gloamguise: False Facades on a server/Realm. Name and address: … Access: … I will not redistribute the addon files separately.',
      translation: 'Hello! I would like to translate documentation/pages into: … Sample link: … I will keep authorship and the official licence.',
      port: 'Hello! I would like to port/adapt the project to: … Goal and platform: … I ask for written permission and will keep authorship.',
      commercial: 'Hello! I would like commercial use: … Project description: … Terms and link: … I ask for written permission.'
    }
  };
  var bar = document.createElement('div');
  bar.className = 'om-templatebar';
  bar.setAttribute('aria-label', T.title);
  ['video', 'modpack', 'server', 'translation', 'port', 'commercial'].forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'om-template';
    b.textContent = T[k];
    b.addEventListener('click', function () {
      if (topic) topic.value = 'permission';
      if (project) project.value = 'gloamguise';
      if (summary && !summary.value) summary.value = T[k];
      message.value = T.templates[k];
      message.dispatchEvent(new Event('input', { bubbles: true }));
      message.focus();
    });
    bar.appendChild(b);
  });
  message.parentNode.insertBefore(bar, message);
})();
