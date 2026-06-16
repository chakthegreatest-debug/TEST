# Directive: quickstart (Renaissance UI Design System)

Стартовая директива для агента. Пользователь говорит «выполни quickstart» — агент брифует, читает спеку, собирает UI строго по `components-visual-spec.json`.

**Дальше — инструкции для агента. Пользователь их не читает.**

---

## Источники правды

| Ресурс | Путь | Назначение |
|--------|------|------------|
| Спека ДС | `ui-design-system-develop/AI_design_system/components-visual-spec.json` | **Единственный источник** токенов, цветов, типографики, компонентов и привязок иконок |
| Иконки | `icons/` | **Единственный набор SVG** — только файлы из этой папки |

Других JSON-файлов с токенами/цветами нет. Не читай и не используй `colors.json` и прочие устаревшие артефакты.

**Перед любой UI-задачей** — прочитай `components-visual-spec.json` (нужные секции) и `icons.catalog` в спеке.

---

## Что агент делает

1. Брифует пользователя — что строим и на чём.
2. Читает `components-visual-spec.json` — токены, компоненты, `icons`.
3. Разворачивает или подключает проект (React + Vite / существующий репо).
4. Реализует UI по спеке: CSS-переменные из `designTokens.cssVariables`, визуал из `components.*`, SVG из `icons/`.
5. Проверяет соответствие спеке.
6. Спрашивает, что дальше.

Не делай ничего деструктивного без подтверждения.

---

## Структура `components-visual-spec.json`

```
{
  "meta": { ... },
  "icons": {
    "source": "icons/",
    "catalog": [ ... ],              ← полный список SVG
    "usage": "..."
  },
  "designTokens": {
    "fonts", "typography", "borderRadius", "shadows", "animation",
    "colors": { Light, Dark },
    "cssVariables": { Light, Dark }
  },
  "sharedStyles": { "ControlBox": { ... } },
  "components": {
    "accessories", "controls", "wrappers", "pages", "grid"
  }
}
```

У компонента с иконками — поле `icons` (например `Step.icons.byStatus.completed` → `Check.svg`).

---

## Шаг 0 — Брифинг

Прочитай папку проекта и `components-visual-spec.json` (минимум `meta`, `designTokens`, `icons`, список компонентов).

Через `AskUserQuestion` (multiSelect = true):

> «Что у тебя уже есть на старте?»
> - **Git-репозиторий** — React/Next, URL
> - **Локальная папка с React** — путь к корню
> - **Только спека** — верстаем по JSON
> - **Figma-макет** — сверка с ДС
> - **Только идея** — с нуля по спеке

Зафиксируй ответы в `artifacts/quickstart-context.json`.

---

## Шаг 1 — Правила работы с ДС

### 1.1 — Токены

- Цвета — только из `designTokens.colors` через `designTokens.cssVariables`.
- Никакого хардкода `#330066`, радиусов и шрифтов вне спеки.
- Типографика: Gerbera (h1–h6), Inter (body/caption/micro).
- Скругления — `designTokens.borderRadius`.
- Тени — `designTokens.shadows`.

### 1.2 — Иконки

- **Только** SVG из `icons/` (каталог — `icons.catalog` в спеке).
- Путь в коде: `icons/CheckCircle.svg` или импорт из `icons/`.
- Для компонента смотри `components.*.icons` — там указаны файлы по variant/status.
- Примеры из спеки:
  - `Step` completed → `Check.svg`
  - `Spoiler` collapsed → `ChevronDown.svg`, expanded → `ChevronUp.svg`
  - `Alert` error → `AlertCircle.svg`, close → `X.svg`
  - `Button` loading → `Loader.svg`
- Нет нужной иконки в `icons/` — не подставляй из других наборов; сообщи пользователю.

### 1.3 — Компоненты

| Категория | Примеры |
|-----------|---------|
| `accessories` | Button, Alert, Typography, StepsProgressBar, Step |
| `controls` | Input, Select, Checkbox, Datepicker |
| `wrappers` | Card, ModalWindow, Tabs, Spoiler |
| `pages` | CommonPageWrapper, NotFound |
| `grid` | Container, Row, Column |

Алгоритм: найти по `name` → прочитать `visual`, `variants`, `icons` → сверстать. Имена и variant 1:1 со спекой.

### 1.4 — ControlBox

Input, Select, Textarea, Datepicker наследуют `sharedStyles.ControlBox`.

### 1.5 — Чеклист перед сдачей

- [ ] Прочитан `components-visual-spec.json` для использованных компонентов
- [ ] Цвета через CSS variables, не хардкод
- [ ] Иконки только из `icons/` по полю `icons` компонента
- [ ] variant / size — только из списка в JSON
- [ ] Border-radius из `designTokens.borderRadius`

---

## Шаг 2 — Развернуть среду

```
.
├── quickstart.md
├── icons/                              ← SVG-иконки (единственный набор)
├── components-visual-spec.json         ← копия или ссылка на AI_design_system/...
├── CLAUDE.md
├── app/
│   └── src/
│       ├── tokens/tokens.css
│       ├── tokens/typography.css
│       └── components/
└── artifacts/quickstart-context.json
```

`tokens.css` — из `designTokens.colors.Light` + `cssVariables.Light`.

---

## Шаг 3 — Ветки по старту

**A. Git / локальная папка** — подключить проект, положить спеку и `icons/`, токены из JSON.

**B. Только спека** — `npm create vite@latest app -- --template react-ts`, токены, компоненты по спеке.

**C. Figma + спека** — сверка макета; расхождения в пользу спеки.

**D. Только идея** — уточнить задачу → ветка B.

---

## Шаг 4 — Запуск

```bash
cd app && npm install && npm run dev
```

URL: `http://localhost:5173/`

---

## Обязательно

1. `components-visual-spec.json` — единственный источник визуала ДС.
2. `icons/` — единственный источник иконок.
3. Имена компонентов 1:1 со спекой (`Button`, не `Btn`).
4. Тема по умолчанию: Light.
