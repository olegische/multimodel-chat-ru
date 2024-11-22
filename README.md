# Multimodel Chat

Веб-приложение для общения с Yandex GPT с поддержкой контекста беседы.

## Технологии

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- SQLite

## Начало работы

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл .env и настройте переменные окружения:
```bash
cp .env.example .env
```

3. Запустите приложение в режиме разработки:
```bash
npm run dev
```

## Структура проекта

```
multimodel-chat/
├── src/
│   ├── components/    # React компоненты
│   ├── lib/          # Библиотеки и утилиты
│   ├── styles/       # CSS стили
│   ├── types/        # TypeScript типы
│   └── utils/        # Вспомогательные функции
├── prisma/           # Схемы и миграции базы данных
├── public/           # Статические файлы
└── docs/            # Документация
```

## Скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка проекта
- `npm run start` - Запуск production версии
- `npm run lint` - Проверка кода линтером
- `npm run format` - Форматирование кода
