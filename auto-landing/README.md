# Auto landing

Демо-лендинг по подбору и ввозу автомобилей от группы «Ренессанс страхование».

## Как открыть

Откройте файл:

```text
/Users/dshiryaev/Documents/Codex/auto-landing/index.html
```

## Изображения

Локальные SVG-ассеты в `assets/images/` используются как демо-заглушки с правильными именами.

Фотореалистичные изображения можно сгенерировать через OpenAI Images API:

```bash
cd /Users/dshiryaev/Documents/Codex/auto-landing
OPENAI_API_KEY="sk-..." node scripts/generate-openai-images.mjs
```

Скрипт использует `gpt-image-2` и сохраняет PNG прямо в `assets/images/`.

Готовые OpenAI-промпты также продублированы в:

```text
artifacts/openai-image-prompts.md
```

После генерации можно заменить:

- положить `assets/images/hero-cars.png`
- положить `assets/images/case-china.png`
- положить `assets/images/case-korea.png`
- положить `assets/images/case-japan.png`
- положить `assets/images/case-uae.png`

HTML уже умеет автоматически подхватывать эти PNG, если они существуют рядом с SVG-заглушками.
