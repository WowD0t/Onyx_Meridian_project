# Compatibility

Versions, platforms, servers and other packs — what works out of the box.

| Item | Status | Details |
| --- | --- | --- |
| Minecraft Bedrock | 1.26.40 – current | No beta APIs, no experiments |
| Script API | `@minecraft/server 2.9.0` | Bundled dependency, no separate install |
| Multiplayer | Supported | Host or server installs the pack; clients get blocks and subtitles |
| Realms | Supported | Upload both packs to the Realm slot |
| Other add-ons | Compatible | Own `gg:` namespace, no vanilla block is replaced |
| Texture packs | Mostly | Packs that retexture stone or wood change the copied look too — expected |
| Worlds with older versions | Upgradeable | Remove v2.0.x packs first, then import the current file |

> **Your textures, your disguise** — The camouflage copies whatever *your* resource packs show for the neighbouring block, so the disguise always matches your own visual style.

## Platform list

Windows, Android, iOS, Xbox, PlayStation, Switch, Realms and dedicated servers. Languages: English and Russian — all tooltips, subtitles and messages.

> **Java Edition** — This is a Bedrock add-on. It does not run on Java Edition, and porting is not permitted by the licence.

## Own namespace, no vanilla replacement

Gloamguise uses its own `gg:` namespace and does not replace any vanilla block. The camouflage copies whatever your resource packs show for the neighbouring block, so the disguise always matches your own visual style. Packs that retexture stone or wood will change the copied look as well; that is expected.

## Upgrading older worlds

1. **Remove old packs** — Delete v2.0.x packs first.

2. **Import the current file** — Import the current .mcaddon and activate both packs.

3. **Restart and verify** — Torch links and door IDs migrate automatically from world dynamic properties.

---

## Official Russian translation / Официальный русский перевод

Версии, платформы, серверы и другие паки — что работает из коробки.

| Пункт | Статус | Подробности |
| --- | --- | --- |
| Minecraft Bedrock | 1.26.40 – текущая | Без бета-API, без экспериментов |
| Script API | `@minecraft/server 2.9.0` | Встроенная зависимость, отдельная установка не нужна |
| Мультиплеер | Поддерживается | Хост или сервер ставит пак; клиенты получают блоки и субтитры |
| Realms | Поддерживается | Загрузите оба пака в слот Realm |
| Другие аддоны | Совместимо | Собственное пространство имён `gg:`, ни один ванильный блок не заменяется |
| Текстур-паки | В основном | Паки, меняющие камень или дерево, меняют и скопированный вид — это ожидаемо |
| Миры со старыми версиями | Обновляемо | Сначала удалите паки v2.0.x, затем импортируйте текущий файл |

> **Ваши текстуры — ваша маскировка** — Камуфляж копирует то, что показывают *ваши* паки ресурсов для соседнего блока, поэтому маскировка всегда соответствует вашему визуальному стилю.

## Список платформ

Windows, Android, iOS, Xbox, PlayStation, Switch, Realms и выделенные серверы. Языки: английский и русский — все подсказки, субтитры и сообщения.

> **Java Edition** — Это аддон для Bedrock. Он не работает на Java Edition, а перенос запрещён лицензией.

## Своё пространство имён, без замены ванили

Gloamguise использует собственное пространство имён `gg:` и не заменяет ванильные блоки. Камуфляж копирует то, что ваши ресурспаки показывают для соседнего блока, поэтому маскировка всегда соответствует вашему визуальному стилю. Паки, перетекстурирующие камень или дерево, изменят и скопированный вид; это ожидаемо.

## Обновление старых миров

1. **Удалите старые паки** — Сначала удалите паки v2.0.x.

2. **Импортируйте текущий файл** — Импортируйте текущий .mcaddon и активируйте оба пака.

3. **Перезапустите и проверьте** — Привязки факелов и ID дверей автоматически мигрируют из динамических свойств мира.
