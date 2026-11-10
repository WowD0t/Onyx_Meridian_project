# Onyx Meridian Interactive Studio

**English**

Onyx Meridian Interactive Studio builds gameplay systems for Minecraft Bedrock. This repository contains the studio website, shared licence documents, official-source rules, support materials and studio-level documentation.

Add-ons are published as separate projects. Each project has its own page, repository and wiki.

## Official links

- Website: https://wowd0t.github.io/Onyx_Meridian_project/
- Studio Wiki: https://github.com/WowD0t/Onyx_Meridian_project/wiki/Home
- Add-on repository: https://github.com/WowD0t/Gloamguise-False-Facades
- Add-on Wiki: https://github.com/WowD0t/Gloamguise-False-Facades/wiki/Home
- CurseForge: https://www.curseforge.com/members/wowdot
- VK: https://vk.ru/onyx_meridian

Everything published by the GitHub account **WowD0t** — repositories, Wikis, releases, files and Pages — is an official source. Every studio-controlled site under `wowd0t.github.io` is official.

## Repository contents

- Public website for GitHub Pages.
- Add-on catalogue, releases, documentation, licence and support pages.
- **OM Studio EULA v3.1** in English, Russian and combined form.
- Studio wiki sources and service tools.

## Licence

All studio works are governed by **OM Studio EULA v3.1** unless a separate written licence says otherwise. English is authoritative; Russian is an official translation.

- `LICENSE-EN.md` — English text.
- `LICENSE-RU.md` — official Russian translation.
- `LICENSE.md` — combined English + Russian document.
- Website licence page: https://wowd0t.github.io/Onyx_Meridian_project/license.html

Permissions for bundles, mirrors, group uploads, translations, ports, commercial use and other restricted acts require written permission from the rights holder. Silence is not approval.

## Support

- English support form: https://wowd0t.github.io/Onyx_Meridian_project/en-support.html
- Russian support form: https://wowd0t.github.io/Onyx_Meridian_project/ru-support.html
- Licensing e-mail: yarik.internet@atomicmail.io

---

## Официальный русский перевод

Onyx Meridian Interactive Studio создаёт игровые системы для Minecraft Bedrock. Этот репозиторий содержит сайт студии, общие лицензионные документы, правила официальных источников, материалы поддержки и документацию уровня студии.

Аддоны публикуются как отдельные проекты. У каждого проекта есть своя страница, репозиторий и вики.

## Официальные ссылки

- Сайт: https://wowd0t.github.io/Onyx_Meridian_project/
- Вики студии: https://github.com/WowD0t/Onyx_Meridian_project/wiki/Home
- Репозиторий аддона: https://github.com/WowD0t/Gloamguise-False-Facades
- Вики аддона: https://github.com/WowD0t/Gloamguise-False-Facades/wiki/Home
- CurseForge: https://www.curseforge.com/members/wowdot
- VK: https://vk.ru/onyx_meridian

Всё, что выпущено GitHub-аккаунтом **WowD0t** — репозитории, Wiki, релизы, файлы и Pages — является официальным источником. Каждый сайт в `wowd0t.github.io` под контролем студии является официальным.

## Содержимое репозитория

- Публичный сайт для GitHub Pages.
- Каталог аддонов, релизы, документация, лицензия и поддержка.
- **OM Studio EULA v3.1** на английском, русском и в объединённом виде.
- Исходники вики студии и служебные инструменты.

## Лицензия

Все Работы студии регулируются **OM Studio EULA v3.1**, если отдельная письменная лицензия не устанавливает иное. Английский текст имеет силу; русский — официальный перевод.

- `LICENSE-EN.md` — английский текст.
- `LICENSE-RU.md` — официальный русский перевод.
- `LICENSE.md` — объединённый документ EN + RU.
- Страница лицензии: https://wowd0t.github.io/Onyx_Meridian_project/license.html

Разрешения на сборки, зеркала, загрузки в группы, переводы, порты, коммерческое использование и другие ограниченные действия требуют письменного разрешения правообладателя. Молчание не является согласием.

## Поддержка

- Английская форма: https://wowd0t.github.io/Onyx_Meridian_project/en-support.html
- Русская форма: https://wowd0t.github.io/Onyx_Meridian_project/ru-support.html
- Почта по лицензиям: yarik.internet@atomicmail.io

## Development / Разработка

The website is static. Run `python3 -m http.server 8000` and open the local URL.
For browser regression tests: `npm ci`, `npx playwright install chromium`, then `npm test`.

Before publishing, run `npm run release:prepare -- 33.0.0` (using a new version),
then run the tests and commit the resulting HTML, cache and build metadata together.
This synchronizes the page build identifier, asset URLs and service worker cache.
If the legacy layer at the beginning of `assets-css-style.css` changes, regenerate
`assets-css-legacy.css` from the contents of that layer. The fallback is loaded only
by browsers without CSS cascade layer support. The download counter is a third-party,
best-effort click estimate, not a verified download count; previous values used a
per-device rule. Accurate counts require a server-side download endpoint and storage.

### Support form diagnostics

The primary Apps Script URL is configured in `assets-js-form-config.js`. Its
`?action=health` response only checks the deployed script and mail quota; it does
not prove a form submission or delivery to the configured mailboxes. After any
change, test a real request without attachments, then one with an attachment,
from the published site and check both recipient inboxes and spam folders.

A confirmed rejection from Apps Script is shown with a safe error code. In the
supplied server script, `site-key` means the site's `appsScriptSiteKey` and the
script property `SITE_KEY` differ; `owner-not-configured` means the recipient
property needs attention; `mail-quota` is a Google mail quota issue. Verify the
web app is deployed as the owner with access for everyone and that the latest
version is deployed. A key included in public JavaScript is not a secret.

If the response is lost or blocked, delivery is **unknown**, not necessarily
failed: the form does not automatically use Web3Forms in this case. The visitor
can explicitly select the fallback, with a warning about possible duplicates.
Retrying the unchanged request through the primary channel uses the same ID so
the supplied script's short-lived deduplication can help. Neither deduplication
nor delivery is guaranteed when a server response is lost. Fallback attachments
are uploaded to tmpfiles.org as temporary public links, as the form explains.
Never include personal message contents, email addresses, or keys in public
bug reports or screenshots.
