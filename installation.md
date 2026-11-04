# Installation & first aid

One file, both packs. The `.mcaddon` contains the behaviour pack and the resource pack; the game imports them together.

> **Download from this site** — The original .mcaddon is hosted on the official studio site. One file contains both packs. [Gloamguise_False_Facades_v2.1.5.mcaddon](../../../Gloamguise_False_Facades_v2.1.5.mcaddon)

## Install by platform

| Platform | What to do |
| --- | --- |
| Windows / Android / iOS | Open the downloaded `.mcaddon` — Minecraft imports both packs automatically |
| Xbox / PlayStation / Switch | Import on a phone or PC, then transfer the world; or add the packs through a Realm |
| Existing world | World settings → Behaviour Packs and Resource Packs → activate both |
| Realms / dedicated server | Place the packs in `behavior_packs` and `resource_packs`, then reference them in `world_behavior_packs.json` and `world_resource_packs.json` |

## Updating

Delete the old packs, import the new `.mcaddon`, restart the world. Torch links and door IDs migrate automatically from world dynamic properties, so nothing needs to be re-bound.

## First aid

### The pack does not appear in the list

Check that **both** packs are activated — the behaviour pack alone shows nothing, and the resource pack alone shows untextured blocks. If the pack list is filtered, switch the filter from “Add-Ons” to “All”. On a server, the manifests must carry the same pack versions as the files on disk.

### Blocks are pink or untextured

The resource pack is not active, or another texture pack overrides `gg_super_block`. Move Gloamguise above the conflicting pack in the resource pack list.

### Doors open twice or not at all

Do not mix `gg:super_door` with `gg:super_door_rs` in the same frame — the lock state differs. Break the mismatched half and replace it with the same variant.

> **Back up before uninstalling** — Removing the pack leaves vanilla blocks behind. If you built with decoys, back up the world first — the hidden entrance becomes a real hole.

Download the latest file on [CurseForge](https://www.curseforge.com/minecraft-bedrock/addons/gloamguise-false-facades/files).

## Install in five steps

1. **Download the .mcaddon** — One file contains both the behaviour pack and the resource pack.

2. **Open it with Minecraft** — On Windows, Android, or iOS the game imports both packs automatically.

3. **Activate both packs** — World settings → Behaviour Packs and Resource Packs → activate both.

4. **Check the filter** — If the pack list is filtered, switch from Add-Ons to All.

5. **Restart the world** — Enter the world and craft a Decoy Block to confirm both packs are live.

## Realms and dedicated servers

Upload both packs to the Realm slot, or place the packs in `behavior_packs` and `resource_packs` on a dedicated server and reference them in `world_behavior_packs.json` and `world_resource_packs.json`. The manifests must carry the same pack versions as the files on disk. The host needs the pack; clients receive it automatically.

## First aid table

| Symptom | Cause | Fix |
| --- | --- | --- |
| Pack does not appear | Only one pack active, or list filtered | Activate both; switch filter to All; match manifest versions on servers. |
| Pink or untextured blocks | Resource pack inactive or overridden | Activate resources; move Gloamguise above the conflicting pack. |
| Door opens twice or not at all | Mixed `super_door` and `super_door_rs` in one frame | Break the mismatched half; replace with the same variant. |

---

## Official Russian translation / Официальный русский перевод

Один файл, оба пака. `.mcaddon` содержит пакет поведения и пакет ресурсов; игра импортирует их вместе.

> **Скачать с этого сайта** — Оригинальный .mcaddon размещён на официальном сайте студии. Один файл содержит оба пака. [Gloamguise_False_Facades_v2.1.5.mcaddon](../../../Gloamguise_False_Facades_v2.1.5.mcaddon)

## Установка по платформам

| Платформа | Что делать |
| --- | --- |
| Windows / Android / iOS | Откройте скачанный `.mcaddon` — Minecraft импортирует оба пака автоматически |
| Xbox / PlayStation / Switch | Импортируйте на телефоне или ПК, затем перенесите мир; либо добавьте паки через Realm |
| Существующий мир | Настройки мира → Пакеты поведения и Пакеты ресурсов → активируйте оба |
| Realms / выделенный сервер | Положите паки в `behavior_packs` и `resource_packs`, затем пропишите их в `world_behavior_packs.json` и `world_resource_packs.json` |

## Обновление

Удалите старые паки, импортируйте новый `.mcaddon`, перезапустите мир. Привязки факелов и ID дверей автоматически мигрируют из динамических свойств мира — ничего не нужно привязывать заново.

## Первая помощь

### Пак не появляется в списке

Проверьте, что активированы **оба** пака: пакет поведения сам по себе ничего не показывает, а пакет ресурсов сам по себе даёт блоки без текстур. Если список паков отфильтрован, переключите фильтр с «Add-Ons» на «All». На сервере манифесты должны содержать те же версии паков, что и файлы на диске.

### Блоки розовые или без текстур

Пакет ресурсов не активен, или другой текстур-пак переопределяет `gg_super_block`. Поднимите Gloamguise выше конфликтующего пака в списке пакетов ресурсов.

### Двери открываются дважды или не открываются вовсе

Не смешивайте `gg:super_door` и `gg:super_door_rs` в одной раме — состояние замка различается. Сломайте неподходящую половинку и поставьте такой же вариант.

> **Сделайте резервную копию перед удалением** — Удаление пака оставляет ванильные блоки. Если вы строили с маскировкой, сначала сохраните копию мира — скрытый вход станет настоящей дырой.

Скачать свежий файл можно на [CurseForge](https://www.curseforge.com/minecraft-bedrock/addons/gloamguise-false-facades/files).

## Установка за пять шагов

1. **Скачайте .mcaddon** — Один файл содержит пак поведения и пак ресурсов.

2. **Откройте в Minecraft** — На Windows, Android или iOS игра импортирует оба пака автоматически.

3. **Активируйте оба пака** — Настройки мира → пакеты поведения и пакеты ресурсов → активируйте оба.

4. **Проверьте фильтр** — Если список паков отфильтрован, переключите с «Аддоны» на «Все».

5. **Перезапустите мир** — Войдите в мир и скрафтите маскировочный блок, чтобы убедиться, что оба пака работают.

## Realms и выделенные серверы

Загрузите оба пака в слот Realm либо положите паки в `behavior_packs` и `resource_packs` на выделенном сервере и пропишите их в `world_behavior_packs.json` и `world_resource_packs.json`. Манифесты должны совпадать по версиям с файлами на диске. Пак нужен хосту; клиенты получают его автоматически.

## Таблица первой помощи

| Симптом | Причина | Решение |
| --- | --- | --- |
| Пак не появляется | Активен только один пак или список отфильтрован | Активируйте оба; переключите фильтр на «Все»; совпадение версий манифестов на сервере. |
| Розовые блоки или без текстур | Пак ресурсов не активен или переопределён | Активируйте ресурсы; поднимите Gloamguise выше конфликтующего пака. |
| Дверь открывается дважды или не открывается | Смешаны `super_door` и `super_door_rs` в одной раме | Сломайте неподходящую половину; поставьте такой же вариант. |
