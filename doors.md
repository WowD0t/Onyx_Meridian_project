# Decoy Doors

Two halves, two disguises. Each half of a decoy door resolves its camouflage independently.

`gg:super_door⧉` · `gg:super_door_rs⧉`

## The four-step resolution

01. **Hinge side first** — Look at the wall on the **hinge side** at that half’s height.

02. **Opposite side** — If that is empty, look at the **opposite side**.

03. **Upper copies lower** — If the upper half finds nothing, it **copies the lower half**.

04. **Floor fallback** — If there is no wall at all, both halves **copy the floor block** — which is how you get a diamond bottom and an emerald top in the same door.

![Independent door halves: diamond bottom, emerald top, single and double](https://iili.io/nNVk2nt.png)

*Independent halves — diamond at the bottom, emerald at the top, single and double.*

## Depth, hinges and pairing

- Depth (near or far edge) and hinge side are chosen by where you click.
- Holding **Sneak** inverts the depth.
- Two doors placed side by side pair up and swing together.

![Double decoy doors opening together, seams aligned](https://iili.io/nNVNAPa.gif)

*Double decoy doors opening together, seams aligned.*

![Log grain preserved in both door states](https://iili.io/nNVkBSf.png)

*Log grain preserved in both states — the decoy is indistinguishable from the frame.*

## Variants

| Variant | By hand | Redstone | Linked torch |
| --- | --- | --- | --- |
| `gg:super_door⧉` | ✓ | ✓ power > 0 | ✓ |
| `gg:super_door_rs⧉` | ✗ locked | ✓ | ✓ |

> **Do not mix variants** — Never combine `gg:super_door` with `gg:super_door_rs` in one frame — the lock state differs and the door will misbehave. See [first aid](installation.md).

Recipes: [03 · Decoy Door](recipes.md) and [04 · Redstone Decoy Door](recipes.md).

## How each half chooses its camouflage

1. **Hinge-side wall** — Look at the wall on the hinge side at that half’s height.

2. **Opposite side** — If that is empty, look at the opposite side.

3. **Upper copies lower** — If the upper half finds nothing, it copies the lower half.

4. **Floor fallback** — If there is no wall at all, both halves copy the floor block.

## Depth, hinge, and pairing

Depth (near or far edge) and hinge side are chosen by where you click. Holding Sneak inverts the depth. Two doors placed side by side pair up and swing together. This is how you get a diamond bottom and an emerald top in the same door: each half resolves independently.

## Hand, redstone, and wireless variants

| Variant | By hand | Redstone | Linked torch |
| --- | --- | --- | --- |
| `gg:super_door` | Yes | Yes, power > 0 | Yes |
| `gg:super_door_rs` | Locked | Yes | Yes |

> **Do not mix variants in one frame** — The lock state differs. Break the mismatched half and replace it with the same variant.

---

## Official Russian translation / Официальный русский перевод

Две половинки, два камуфляжа. Каждая половинка маскировочной двери разрешает свой камуфляж независимо.

`gg:super_door⧉` · `gg:super_door_rs⧉`

## Четыре шага разрешения

01. **Сначала сторона петель** — Пак смотрит на стену со **стороны петель** на высоте этой половинки.

02. **Противоположная сторона** — Если там пусто — смотрит на **противоположную сторону**.

03. **Верх копирует низ** — Если верхняя половинка ничего не нашла, она **копирует нижнюю**.

04. **Запасной вариант — пол** — Если стены нет вообще, обе половинки **копируют блок пола** — так получаются алмазный низ и изумрудный верх в одной двери.

![Независимые половинки двери: алмазный низ, изумрудный верх, одинарная и двойная](https://iili.io/nNVk2nt.png)

*Независимые половинки — алмазный низ, изумрудный верх, одинарная и двойная.*

## Глубина, петли и пара

- Глубина (ближний или дальний край) и сторона петель выбираются местом клика.
- Зажатый **Shift** инвертирует глубину.
- Две двери, поставленные рядом, образуют пару и открываются вместе.

![Двойные маскировочные двери открываются синхронно, стыки совпадают](https://iili.io/nNVNAPa.gif)

*Двойные маскировочные двери открываются синхронно, стыки совпадают.*

![Направление волокон сохраняется в обоих состояниях двери](https://iili.io/nNVkBSf.png)

*Направление волокон сохраняется в обоих состояниях — маскировка неотличима от рамы.*

## Варианты

| Вариант | Рукой | Редстоун | Привязанный факел |
| --- | --- | --- | --- |
| `gg:super_door⧉` | ✓ | ✓ сигнал > 0 | ✓ |
| `gg:super_door_rs⧉` | ✗ заперта | ✓ | ✓ |

> **Не смешивайте варианты** — Никогда не сочетайте `gg:super_door` и `gg:super_door_rs` в одной раме — состояние замка различается, и дверь будет вести себя неправильно. См. [первую помощь](installation.md).

Рецепты: [03 · Маскировочная дверь](recipes.md) и [04 · Редстоун-дверь](recipes.md).

## Как каждая половина выбирает камуфляж

1. **Стена со стороны петли** — Смотрится стена со стороны петли на высоте этой половины.

2. **Противоположная сторона** — Если там пусто, смотрится противоположная сторона.

3. **Верх копирует низ** — Если верхняя половина ничего не нашла, она копирует нижнюю.

4. **Запасной вариант — пол** — Если стены нет совсем, обе половины копируют блок пола.

## Глубина, петля и спаривание

Глубина (ближняя или дальняя кромка) и сторона петли выбираются местом клика. Удержание Shift инвертирует глубину. Две двери, поставленные рядом, спариваются и открываются вместе. Так получается алмазный низ и изумрудный верх в одной двери: каждая половина подбирает камуфляж независимо.

## Варианты: рука, редстоун и беспроводной

| Вариант | Рукой | Редстоун | Привязанный факел |
| --- | --- | --- | --- |
| `gg:super_door` | Да | Да, сигнал > 0 | Да |
| `gg:super_door_rs` | Заблокирована | Да | Да |

> **Не смешивайте варианты в одной раме** — Состояние блокировки отличается. Сломайте неподходящую половину и поставьте такой же вариант.
