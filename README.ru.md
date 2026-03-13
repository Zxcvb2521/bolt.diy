# bolt.diy (Русская версия README)

[![bolt.diy: AI-Powered Full-Stack Web Development in the Browser](./public/social_preview_index.jpg)](https://bolt.diy)

Это русскоязычная версия краткого руководства по `bolt.diy` — open-source версии Bolt.new.

> Полная англоязычная документация: [README.md](./README.md)

## Возможности

- AI-помощник для full-stack разработки прямо в браузере.
- Поддержка множества LLM-провайдеров (OpenAI, Anthropic, Ollama, OpenRouter и др.).
- Встроенный терминал и предпросмотр.
- Electron-версия для desktop.
- Docker и деплой на Netlify / Vercel / GitHub Pages.

## Быстрый старт (локально)

### 1) Установите зависимости

```bash
pnpm install
```

### 2) Запустите dev-сервер

```bash
pnpm run dev
```

Для более быстрого локального старта (без pre-start проверки):

```bash
pnpm run dev:fast
```

## Windows: автоматическая установка и сборка .exe

### Автонастройка окружения

```bat
scripts\setup-windows.bat
```

Скрипт:
- установит `Git` и `Node.js LTS` (через `winget`, либо `choco`);
- активирует/установит `pnpm`;
- выполнит `pnpm install`.

### Сборка установщика `.exe`

```bat
scripts\build-exe.bat
```

Или напрямую:

```bash
pnpm electron:build:exe
```

Артефакты обычно находятся в папке `dist/` (например, `*-setup.exe`).

## Полезные команды

- `pnpm run dev` — запустить проект в режиме разработки.
- `pnpm run dev:fast` — быстрый dev-старт.
- `pnpm run build` — production сборка.
- `pnpm run preview` — локальный запуск production сборки.
- `pnpm run lint` — проверка ESLint.
- `pnpm run typecheck` — проверка TypeScript.
- `pnpm test` — запуск тестов Vitest.
- `pnpm electron:build:win` — сборка Windows desktop-версии.
- `pnpm electron:build:exe` — сборка Windows установщика `.exe`.

## Документация и сообщество

- Документация: https://stackblitz-labs.github.io/bolt.diy/
- Сообщество: https://thinktank.ottomator.ai


## Быстрый доступ на Windows (батники в корне)

Если не можете найти bat-файлы в `scripts`, используйте батники в корне репозитория:

```bat
install-windows.bat
build-windows-exe.bat
```

Это ярлыки-обёртки для:
- `scripts\setup-windows.bat`
- `scripts\build-exe.bat`
