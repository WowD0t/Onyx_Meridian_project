# Redstone & wireless

Locked variants, power rules and the wireless link system — how Gloamguise talks to redstone without looking like it.

## The two families

| Family | By hand | Redstone | Linked torch | Output |
| --- | --- | --- | --- | --- |
| Doors & trapdoors (plain) | ✓ | ✓ power > 0 | ✓ | — |
| `_rs` variants | ✗ locked | ✓ | ✓ | — |
| Wired torch levers | ✓ toggle | — | — | **15** |
| Wireless torch levers | ✓ toggle linked door | — | — | **0** |

## Why wireless outputs zero

A remote torch is not a redstone component at all. It stores a door ID and sends a scripted open/close command straight to that door — through walls, at any distance. No dust, no repeaters, no signal to trace.

## Link lifecycle

01. **Bind** — Hold a wireless torch, **Shift + tap** a decoy door or trapdoor. The link is stored in the item.

02. **Place** — Put the torch anywhere — a wall, a ceiling, a flower-pot illusion two rooms away.

03. **Copy or free** — **Shift + tap** a placed torch while holding a fresh torch to copy its link; empty-handed to remove it.

04. **Use** — Tap the placed torch to toggle its door. Paired double doors swing together.

## Persistence

Torch links and door IDs are stored in **world dynamic properties, sharded**. They survive reloads, restarts and pack updates — nothing needs to be re-bound after an update.

> **Tick cost** — All scripted work is event-driven. The torch registry scans within 64 blocks of a player every 10 ticks — negligible even on busy servers.

> **Locked means locked** — An `_rs` door tapped empty-handed explains itself with a message. It will never open by hand — that is the point.

## Power 15 versus power 0

| Item | Output | What it can drive |
| --- | --- | --- |
| Wired torch lever | 15 | Dust, pistons, lamps, redstone doors. |
| Remote torch lever | 0 | Only its linked door; no redstone network. |
| `_rs` door / trapdoor | Input only | Opens from redstone power or a linked torch; hand-locked. |

## A wireless entrance, step by step

1. **Place a locked door** — Use `gg:super_door_rs` or `gg:super_trapdoor_rs` so nobody opens it by hand.

2. **Bind a remote** — Hold a Remote Torch Lever, Shift + tap the door.

3. **Hide the torch** — Place it anywhere; it opens the door through walls from any distance.

4. **Add more remotes** — Shift + tap the placed torch while holding a fresh torch to copy the link.

## What redstone does not do here

> **No moving decoys** — Pistons cannot move decoys. Use a remote torch for moving contraptions. A remote torch outputs nothing, so it cannot power a lamp or dust line.

---

## Official Russian translation / Официальный русский перевод

Запертые варианты, правила сигнала и система беспроводных привязок — как Gloamguise говорит с редстоуном, не выдавая себя.

## Два семейства

| Семейство | Рукой | Редстоун | Привязанный факел | Выход |
| --- | --- | --- | --- | --- |
| Двери и люки (обычные) | ✓ | ✓ сигнал > 0 | ✓ | — |
| Варианты `_rs` | ✗ заперты | ✓ | ✓ | — |
| Проводные факелы-рычаги | ✓ переключение | — | — | **15** |
| Беспроводные факелы-рычаги | ✓ переключение привязанной двери | — | — | **0** |

## Почему беспроводной выход — ноль

Беспроводной факел вообще не является компонентом редстоуна. Он хранит ID двери и отправляет скриптовую команду открытия/закрытия прямо этой двери — сквозь стены, на любом расстоянии. Ни пыли, ни повторителей, ни сигнала, который можно отследить.

## Жизненный цикл привязки

01. **Привязать** — Держа беспроводной факел, **Shift + клик** по маскировочной двери или люку. Привязка сохраняется в предмете.

02. **Поставить** — Установите факел где угодно — на стену, потолок, в иллюзию цветочного горшка в двух комнатах от двери.

03. **Скопировать или освободить** — **Shift + клик** по установленному факелу, держа свежий факел, копирует привязку; пустой рукой — удаляет её.

04. **Использовать** — Клик по установленному факелу переключает его дверь. Парные двойные двери открываются вместе.

## Сохранность

Привязки факелов и ID дверей хранятся в **динамических свойствах мира, шардированно**. Они переживают перезагрузки, рестарты и обновления пака — после обновления ничего не нужно привязывать заново.

> **Нагрузка на тики** — Вся скриптовая работа событийная. Реестр факелов сканирует область в 64 блоках от игрока каждые 10 тиков — ничтожно даже на загруженных серверах.

> **Заперто — значит заперто** — Дверь `_rs` при клике пустой рукой объясняет себя сообщением. Рукой она не откроется никогда — в этом и смысл.

## Сила 15 против силы 0

| Предмет | Сигнал | Что может питать |
| --- | --- | --- |
| Проводной факел-рычаг | 15 | Пыль, поршни, лампы, редстоун-двери. |
| Дистанционный факел-рычаг | 0 | Только привязанную дверь; без редстоун-сети. |
| Дверь / люк `_rs` | Только вход | Открывается редстоуном или привязанным факелом; рукой заблокирован. |

## Беспроводной вход по шагам

1. **Поставьте запираемую дверь** — Используйте `gg:super_door_rs` или `gg:super_trapdoor_rs`, чтобы никто не открыл рукой.

2. **Привяжите пульт** — Держите дистанционный факел-рычаг, Shift + клик по двери.

3. **Спрячьте факел** — Поставьте его где угодно; он открывает дверь сквозь стены с любого расстояния.

4. **Добавьте пульты** — Shift + клик по поставленному факелу, держа новый факел, копирует связь.

## Чего редстоун здесь не делает

> **Маскировки не двигаются** — Поршни не могут двигать маскировки. Для движущихся механизмов используйте дистанционный факел. Дистанционный факел ничего не питает, поэтому не включит лампу или линию пыли.
