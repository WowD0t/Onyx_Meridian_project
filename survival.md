# Survival, performance & safety

Break times, drops, explosion behaviour and the engineering guarantees that keep a survival world clean.

## Survival properties

| Property | Value | Note |
| --- | --- | --- |
| Break by hand, pickaxe or shovel | ~10 s (feels like ~15 s) | Deliberate: no punching a hole by accident |
| Break by any axe | 1.2 speed → 0.15–0.90 s | Fast, clean removal |
| Door drops | Exactly one item, from the lower half | Three handlers cannot duplicate it |
| Orphan halves | Removed on the next block update | No floating half doors |
| Explosion resistance | 3 (torches 0) | Vanilla-like behaviour |
| Light dampening | 0 on ghost blocks | No light leaks through a fake wall |
| Pistons | Cannot move decoys | By design — use a remote torch for moving contraptions |

## Performance

Scripted work

Only event-driven; torch registry scans within 64 blocks of a player every 10 ticks

Tick cost

Negligible

Saved data

Torch links and door IDs in world dynamic properties, sharded

Network

No calls, no telemetry, no analytics

## Block IDs & permutation states

`gg:super_block⧉` `gg:super_glass⧉` `gg:super_door⧉` `gg:super_door_rs⧉` `gg:super_trapdoor⧉` `gg:super_trapdoor_rs⧉` `gg:torch_lever⧉` `gg:torch_lever_remote⧉` `gg:soul_torch_lever⧉` `gg:soul_torch_lever_remote⧉`

States: `gg:s0`, `gg:s1`, `gg:s2` (skin index, base 8), `gg:axis`, `gg:face`, `gg:mode`, `gg:orient`, `gg:open`, `gg:variant`. Recipes use the standard `crafting_table` tag; no custom station.

> **Single-drop rule** — One door = one drop, always. The lower half owns the drop; the upper half is cleaned up on the next block update.

## Mining, drops, and cleanup

| Property | Value | Note |
| --- | --- | --- |
| Break by hand, pickaxe, or shovel | ~10 s (feels like ~15 s) | No accidental punching. |
| Break by any axe | 0.15–0.90 s | Fast, clean removal. |
| Door drops | Exactly one item, from the lower half | Three handlers cannot duplicate it. |
| Orphan halves | Removed on the next block update | No floating half doors. |
| Explosion resistance | 3 (torches 0) | Vanilla-like behaviour. |

## Performance and saved data

Scripted work is event-driven. The torch registry scans within 64 blocks of a player every 10 ticks, so tick cost is negligible. Torch links and door IDs live in world dynamic properties, sharded, and survive reloads and pack updates.

## World safety

- No vanilla block is replaced and no vanilla file is overwritten.
- Removing the pack leaves vanilla blocks behind; back up before uninstalling if you built with decoys.
- Light dampening is 0 on ghost blocks, so no light leaks through a fake wall.
- Pistons cannot move decoys by design.

---

## Official Russian translation / Официальный русский перевод

Время добычи, дроп, поведение при взрывах и инженерные гарантии, которые держат мир выживания в чистоте.

## Свойства в выживании

| Свойство | Значение | Примечание |
| --- | --- | --- |
| Добыча рукой, киркой или лопатой | ~10 с (ощущается как ~15 с) | Намеренно: нельзя случайно пробить дыру |
| Добыча любым топором | Скорость 1.2 → 0.15–0.90 с | Быстрое, чистое удаление |
| Дроп двери | Ровно один предмет, с нижней половинки | Три обработчика не могут его удвоить |
| Осиротевшие половинки | Удаляются при следующем обновлении блока | Никаких висящих половинок дверей |
| Взрывоустойчивость | 3 (факелы 0) | Поведение как в ваниле |
| Ослабление света | 0 у призрачных блоков | Ни одной утечки света сквозь фальшивую стену |
| Поршни | Не могут двигать маскировку | По замыслу — для движущихся механизмов используйте беспроводной факел |

## Производительность

Скриптовая работа

Только событийная; реестр факелов сканирует 64 блока вокруг игрока каждые 10 тиков

Нагрузка на тики

Ничтожная

Сохраняемые данные

Привязки факелов и ID дверей в динамических свойствах мира, шардированно

Сеть

Никаких запросов, телеметрии и аналитики

## ID блоков и состояния пермутации

`gg:super_block⧉` `gg:super_glass⧉` `gg:super_door⧉` `gg:super_door_rs⧉` `gg:super_trapdoor⧉` `gg:super_trapdoor_rs⧉` `gg:torch_lever⧉` `gg:torch_lever_remote⧉` `gg:soul_torch_lever⧉` `gg:soul_torch_lever_remote⧉`

Состояния: `gg:s0`, `gg:s1`, `gg:s2` (индекс скина, основание 8), `gg:axis`, `gg:face`, `gg:mode`, `gg:orient`, `gg:open`, `gg:variant`. Рецепты используют стандартный тег `crafting_table`; отдельной станции нет.

> **Правило одного дропа** — Одна дверь = один дроп, всегда. Дропом владеет нижняя половинка; верхняя убирается при следующем обновлении блока.

## Добыча, дроп и очистка

| Свойство | Значение | Примечание |
| --- | --- | --- |
| Разрушение рукой, киркой или лопатой | ~10 с (ощущается как ~15 с) | Нельзя пробить случайно. |
| Разрушение любым топором | 0.15–0.90 с | Быстрое и чистое удаление. |
| Дроп двери | Ровно один предмет из нижней половины | Три обработчика не могут продублировать. |
| Осиротевшие половины | Удаляются при следующем обновлении блока | Нет висящих половин дверей. |
| Взрывоустойчивость | 3 (факелы 0) | Поведение как у ванильных. |

## Производительность и сохраняемые данные

Скриптовая работа событийная. Реестр факелов сканирует область в 64 блоках от игрока каждые 10 тиков, поэтому стоимость тика ничтожна. Привязки факелов и ID дверей хранятся в динамических свойствах мира, шардированно, и переживают перезагрузки и обновления пака.

## Безопасность мира

- Ванильные блоки не заменяются и ванильные файлы не перезаписываются.
- Удаление пака оставляет ванильные блоки; сделайте резервную копию перед удалением, если строили с маскировками.
- Ослабление света у призрачных блоков 0, поэтому свет не просачивается сквозь фальшивую стену.
- Поршни не могут двигать маскировки по замыслу.
