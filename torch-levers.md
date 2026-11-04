# Torch Levers

The switch that is not a switch: a normal lever wearing a torch costume.

## Wired

`gg:torch_lever⧉` · `gg:soul_torch_lever⧉`

Outputs **power 15** into dust, pistons, lamps and redstone doors. Behaves exactly like a vanilla lever — it just looks like a torch.

## Wireless

`gg:torch_lever_remote⧉` · `gg:soul_torch_lever_remote⧉`

Outputs **nothing**. Link it to one door and it opens that door through walls, from any distance, without a wire in sight.

![Bind a torch to a door, place it far away, open the door from there](https://iili.io/nNVON1a.gif)

*Bind a torch to a door, place it far away, open the door from there.*

## The four gestures

| Gesture | Where | Result |
| --- | --- | --- |
| **Shift + tap** | Any decoy door or trapdoor | Stores the link in the torch you are holding — place it anywhere |
| **Shift + tap** | An already placed wireless torch (holding a torch) | Copies its link, so you can build a second remote for the same door |
| **Shift + tap**, empty hand | An already placed wireless torch | Removes the link and frees the torch |
| **Tap** | A linked torch | Opens or closes its door through walls — including a paired double door |

> **Every action answers** — A coloured message, a chat line and a short chime confirm whether the link took. A redstone-only door explains itself when you tap it empty-handed.

## Sharing

Every player can link their own torch to the same door; all linked torches stay in sync. Links survive reloads and pack updates — they live in world dynamic properties, sharded.

Recipes: [07–10 · the four torch crafts](recipes.md). Power rules: [Redstone & wireless](redstone.md).

## Wired versus wireless

| Family | IDs | Redstone output | Use |
| --- | --- | --- | --- |
| Wired | `gg:torch_lever`, `gg:soul_torch_lever` | Power 15 | Vanilla lever behaviour: dust, pistons, lamps, redstone doors. |
| Wireless | `gg:torch_lever_remote`, `gg:soul_torch_lever_remote` | 0 | Opens one linked door through walls from any distance. |

## The four gestures

| Gesture | Where | Result |
| --- | --- | --- |
| Shift + tap | Any decoy door or trapdoor | Stores the link in the torch you are holding; place it anywhere. |
| Shift + tap | An already placed wireless torch, holding a torch | Copies its link so you can build a second remote for the same door. |
| Shift + tap, empty hand | An already placed wireless torch | Removes the link and frees the torch. |
| Tap | A linked torch | Opens or closes its door through walls, including a paired double door. |

## Feedback and multiplayer

Every action answers with a coloured message, a chat line, and a short chime, so you always know whether the link took. A redstone-only door explains itself when you tap it empty-handed. Every player can link their own torch to the same door; all linked torches stay in sync.

---

## Official Russian translation / Официальный русский перевод

Переключатель, который не переключатель: обычный рычаг в костюме факела.

## Проводные

`gg:torch_lever⧉` · `gg:soul_torch_lever⧉`

Выдают **сигнал 15** на пыль, поршни, лампы и редстоун-двери. Ведут себя в точности как ванильный рычаг — просто выглядят как факел.

## Беспроводные

`gg:torch_lever_remote⧉` · `gg:soul_torch_lever_remote⧉`

Не выдают **ничего**. Привяжите к одной двери — и он открывает её сквозь стены, с любого расстояния, без единого провода.

![Привязка факела к двери: поставьте его далеко и открывайте дверь оттуда](https://iili.io/nNVON1a.gif)

*Привязка факела к двери: поставьте его далеко и открывайте дверь оттуда.*

## Четыре жеста

| Жест | Где | Результат |
| --- | --- | --- |
| **Shift + клик** | Любая маскировочная дверь или люк | Привязка сохраняется в факеле в руке — ставьте его где угодно |
| **Shift + клик** | Уже установленный беспроводной факел (держа факел) | Копирует его привязку — можно сделать второй пульт для той же двери |
| **Shift + клик** пустой рукой | Уже установленный беспроводной факел | Удаляет привязку и освобождает факел |
| **Клик** | Привязанный факел | Открывает или закрывает свою дверь сквозь стены — включая парную двойную дверь |

> **Каждое действие отвечает** — Цветное сообщение, строка в чате и короткий звон подтверждают, принялась ли привязка. Дверь только для редстоуна сама объясняет себя при клике пустой рукой.

## Совместное использование

Каждый игрок может привязать свой факел к той же двери; все привязанные факелы синхронны. Привязки переживают перезагрузки и обновления пака — они живут в динамических свойствах мира, шардированно.

Рецепты: [07–10 · четыре крафта факелов](recipes.md). Правила сигнала: [Редстоун и беспроводная связь](redstone.md).

## Проводные и беспроводные

| Семейство | ID | Редстоун-сигнал | Применение |
| --- | --- | --- | --- |
| Проводные | `gg:torch_lever`, `gg:soul_torch_lever` | Сила 15 | Поведение ванильного рычага: пыль, поршни, лампы, редстоун-двери. |
| Беспроводные | `gg:torch_lever_remote`, `gg:soul_torch_lever_remote` | 0 | Открывает одну привязанную дверь сквозь стены с любого расстояния. |

## Четыре жеста

| Жест | Где | Результат |
| --- | --- | --- |
| Shift + клик | Любая маскировочная дверь или люк | Связь сохраняется в факеле в руке; поставьте его где угодно. |
| Shift + клик | Уже поставленный беспроводной факел, в руке факел | Копирует связь, чтобы сделать второй пульт для той же двери. |
| Shift + клик пустой рукой | Уже поставленный беспроводной факел | Удаляет связь и освобождает факел. |
| Клик | Привязанный факел | Открывает или закрывает дверь сквозь стены, включая парную двойную дверь. |

## Обратная связь и мультиплеер

Каждое действие отвечает цветным сообщением, строкой в чате и коротким звоном, поэтому всегда понятно, принялась ли связь. Дверь только для редстоуна объясняет себя при клике пустой рукой. Каждый игрок может привязать свой факел к той же двери; все привязанные факелы остаются синхронными.
