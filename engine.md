# The camouflage engine

Most disguise add-ons swap one texture. Gloamguise rebuilds the **whole appearance** of the neighbouring block across five independent channels, so a fake wall survives close inspection.

## The five channels

| Channel | What is copied | Why it matters |
| --- | --- | --- |
| **Textures** | Every visible face, including the bottom you cannot see | No seams on a mixed-material wall |
| **Axis** | X / Y / Z grain of logs, basalt, purpur | A rotated log keeps the bark direction |
| **Biome** | Grass colour resolved from the current biome | The entrance melts into any landscape |
| **Sound** | Step and break sounds of the original block | Stone still sounds like stone |
| **Light** | Light emission of the copied block | A disguised lamp really lights the room |

![A decoy wall next to real blocks with matching directional log grain](https://iili.io/nNVeLn1.png)

*A decoy wall next to real blocks — directional log grain (X / Y / Z) matches exactly.*

## Faces

Top, bottom and all four sides of multi-face blocks are resolved independently: grass, podzol, mycelium and nylium keep their green top, dirt bottom and unique sides.

## Orientation

Bark, cut and pillar direction is preserved on every log, basalt, deepslate, hay and bamboo block. A decoy placed against a sideways log lies sideways too.

## Biome tint

Nineteen grass palettes are sampled from the world, so the entrance matches the meadow it stands in — meadow green, swamp olive, badlands dry.

## Sound & light

Footsteps and break sounds stay stone-or-wood, and glowing blocks keep their real light level — 3, 10 or 15. A disguised sea lantern still lights the room.

> **The chain trick** — Place a new decoy directly onto an existing one and it inherits the already-resolved camouflage instantly — you can build a fake tunnel from a single real block of stone.

## Under the hood

The registry knows **290+ blocks** and **411 structural states**. Skins are stored as a base-8 index across three permutation states, with axis, face, mode and orientation kept separately:

Skin index

gg:s0

,

gg:s1

,

gg:s2

(base 8)

Orientation

gg:axis

,

gg:face

,

gg:orient

Behaviour

gg:mode

,

gg:open

,

gg:variant

Sampling

Camouflage is resolved at placement, from the tapped neighbour

> **Sampling is a snapshot** — If you replace the neighbouring wall later, break and re-place the decoy to refresh it. The pack does not watch neighbours for changes — that is what keeps the tick cost negligible.

## What each channel really copies

- **Textures:** top, bottom, and all four sides of multi-face blocks such as grass, podzol, mycelium, and nylium.
- **Axis:** X / Y / Z grain for logs, basalt, deepslate, hay, bamboo, and purpur.
- **Biome:** grass colour resolved from the current biome; nineteen palettes are sampled from the world.
- **Sound:** step and break sounds stay stone-or-wood, matching the original block.
- **Light:** glowing blocks keep light level 3, 10, or 15, so a disguised lamp still lights the room.

## The chain trick

1. **Start from one real block** — Place a Decoy Block against a real stone block.

2. **Extend from the decoy** — Place another Decoy Block directly onto the first one. It inherits the already-resolved camouflage instantly.

3. **Build a tunnel** — Repeat to make a fake tunnel from a single real block of stone.

## Camouflage is a placement snapshot

> **Refresh after editing the wall** — The decoy samples the neighbour when placed. If you later replace the neighbouring wall, break and re-place the decoy to refresh its appearance. Only supported blocks are copied; an unsupported block may fall back to the default decoy texture.

---

## Official Russian translation / Официальный русский перевод

Большинство аддонов на маскировку подменяют одну текстуру. Gloamguise воссоздаёт **весь внешний вид** соседнего блока по пяти независимым каналам, поэтому поддельная стена выдерживает внимательный осмотр.

## Пять каналов

| Канал | Что копируется | Почему это важно |
| --- | --- | --- |
| **Текстуры** | Каждая видимая грань, включая невидимое дно | Нет швов на стене из смешанных материалов |
| **Ось** | Направление волокон X / Y / Z у брёвен, базальта, пурпура | Повёрнутое бревно сохраняет направление коры |
| **Биом** | Цвет травы, вычисленный по текущему биому | Вход сливается с любым ландшафтом |
| **Звук** | Звуки шагов и разрушения исходного блока | Камень по-прежнему звучит как камень |
| **Свет** | Свечение скопированного блока | Замаскированная лампа действительно освещает комнату |

![Маскировочная стена рядом с настоящими блоками: направление волокон брёвен совпадает](https://iili.io/nNVeLn1.png)

*Маскировочная стена рядом с настоящими блоками — направление волокон брёвен (X / Y / Z) совпадает точно.*

## Грани

Верх, низ и все четыре стороны многогранных блоков разрешаются независимо: трава, подзол, мицелий и нилий сохраняют зелёный верх, земляной низ и уникальные бока.

## Ориентация

Направление коры, среза и колонн сохраняется у всех брёвен, базальта, глубинного сланца, сена и бамбука. Маскировка, поставленная к лежащему бревну, тоже лежит.

## Оттенок биома

Девятнадцать палитр травы считываются из мира, поэтому вход соответствует лугу, на котором стоит: луговая зелень, болотная олива, сухие бесплодные земли.

## Звук и свет

Шаги и звуки разрушения остаются каменными или деревянными, а светящиеся блоки сохраняют реальный уровень света — 3, 10 или 15. Замаскированный морской фонарь всё равно освещает комнату.

> **Цепной трюк** — Поставьте новую маскировку прямо на существующую — она мгновенно унаследует уже разрешённый камуфляж. Целый фальшивый туннель можно построить от одного настоящего блока камня.

## Под капотом

Реестр знает **290+ блоков** и **411 структурных состояний**. Скины хранятся как индекс в восьмеричной системе в трёх состояниях пермутации, а ось, грань, режим и ориентация — отдельно:

Индекс скина

gg:s0

,

gg:s1

,

gg:s2

(основание 8)

Ориентация

gg:axis

,

gg:face

,

gg:orient

Поведение

gg:mode

,

gg:open

,

gg:variant

Считывание

Камуфляж разрешается при установке, по соседнему блоку

> **Считывание — это снимок** — Если позже вы замените соседнюю стену, сломайте и поставьте маскировку заново, чтобы обновить её. Пак не следит за изменениями соседей — именно поэтому нагрузка на тики ничтожна.

## Что именно копирует каждый канал

- **Текстуры:** верх, низ и все четыре стороны многогранных блоков: трава, подзол, мицелий, нилий.
- **Ось:** направление волокон X / Y / Z у брёвен, базальта, глубинного сланца, сена, бамбука и пурпура.
- **Биом:** цвет травы вычисляется по текущему биому; из мира берутся девятнадцать палитр.
- **Звук:** звуки шагов и разрушения остаются каменными или деревянными, как у исходного блока.
- **Свет:** светящиеся блоки сохраняют уровень 3, 10 или 15, поэтому замаскированная лампа действительно освещает комнату.

## Цепочка маскировок

1. **Начните с одного настоящего блока** — Поставьте маскировочный блок вплотную к настоящему камню.

2. **Продолжите от маскировки** — Поставьте следующий маскировочный блок прямо на первый. Он мгновенно унаследует уже вычисленный камуфляж.

3. **Постройте туннель** — Повторяйте, чтобы получить фальшивый туннель из одного настоящего блока камня.

## Камуфляж — снимок на момент установки

> **Обновляйте после изменения стены** — Маскировка считывает соседа в момент установки. Если позже заменить соседнюю стену, сломайте и поставьте маскировку заново. Копируются только поддерживаемые блоки; неподдерживаемый может получить стандартную текстуру маскировки.
