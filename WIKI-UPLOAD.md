# Wiki upload guide

## Files

The wiki archive contains flat Markdown files with no folders:

- `Home.md` — bilingual wiki home.
- 16 topic pages: `quick-start.md`, `engine.md`, `decoy-block.md`, `spy-glass.md`, `doors.md`, `trapdoors.md`, `torch-levers.md`, `recipes.md`, `redstone.md`, `survival.md`, `installation.md`, `compatibility.md`, `limitations.md`, `faq.md`, `changelog.md`, `license.md`.
- `_Sidebar.md` — bilingual navigation.

Every topic page contains the English documentation first and the official Russian translation below it. No extra files are required; images link to their original public URLs.

## Upload to the repository

1. Open the repository on GitHub.
2. Choose **Add file → Upload files**.
3. Drag all Markdown files into the upload area. They stay in the repository root; no folder is created.
4. Commit the changes.
5. Link to `Home.md` or to a topic page such as `quick-start.md`.

## Upload to the GitHub Wiki tab

The **Wiki** tab is a separate repository. To mirror these files there:

1. Open **Wiki → Create the first page** and save any page to initialise the wiki.
2. Create a classic personal access token with the `repo` scope and add it as the repository secret `WIKI_TOKEN`.
3. Choose **Add file → Create new file**, name it `.github/workflows/wiki-sync.yml`, and paste the provided workflow.
4. Upload the Markdown files to the repository root.
5. Run **Actions → Sync GitHub Wiki → Run workflow**.

The workflow copies the files into the wiki repository and converts `.md` links into wiki page links.

---

## Официальный русский перевод

## Файлы

Архив вики содержит плоские Markdown-файлы без папок:

- `Home.md` — двуязычная главная вики.
- 16 тематических страниц: `quick-start.md`, `engine.md`, `decoy-block.md`, `spy-glass.md`, `doors.md`, `trapdoors.md`, `torch-levers.md`, `recipes.md`, `redstone.md`, `survival.md`, `installation.md`, `compatibility.md`, `limitations.md`, `faq.md`, `changelog.md`, `license.md`.
- `_Sidebar.md` — двуязычная навигация.

Каждая тематическая страница содержит сначала английскую документацию, затем официальный русский перевод. Дополнительные файлы не нужны; изображения ссылаются на оригинальные публичные URL.

## Загрузка в репозиторий

1. Откройте репозиторий на GitHub.
2. Выберите **Add file → Upload files**.
3. Перетащите все Markdown-файлы в область загрузки. Они останутся в корне репозитория; папка не создаётся.
4. Закоммитьте изменения.
5. Ставьте ссылку на `Home.md` или на тематическую страницу, например `quick-start.md`.

## Загрузка во вкладку GitHub Wiki

Вкладка **Wiki** — отдельный репозиторий. Чтобы зеркалировать файлы туда:

1. Откройте **Wiki → Create the first page** и сохраните любую страницу для инициализации вики.
2. Создайте classic PAT со scope `repo` и добавьте его как секрет репозитория `WIKI_TOKEN`.
3. Выберите **Add file → Create new file**, имя `.github/workflows/wiki-sync.yml`, вставьте предоставленный workflow.
4. Загрузите Markdown-файлы в корень репозитория.
5. Запустите **Actions → Sync GitHub Wiki → Run workflow**.

Workflow копирует файлы в репозиторий вики и преобразует ссылки `.md` в ссылки страниц вики.
