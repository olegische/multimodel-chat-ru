# Multimodel Chat

## Запуск в Docker

1. Сборка образа:
```bash
docker build -t multimodel-chat-ru .
```

2. Настройка переменных окружения:

Создайте файл .env с необходимыми переменными:
```bash
cp .env.example .env
vi .env
```

3. Создание директории для базы данных:
```bash
mkdir -p $(pwd)/data/prisma
```

4. Запуск контейнера:

Вариант 1 - через монтирование .env файла:
```bash
docker run -p 3000:3000 \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/data/prisma:/app/prisma \
  multimodel-chat-ru
```

Вариант 2 - через передачу переменных напрямую:
```bash
docker run -p 3000:3000 \
  -e YANDEX_GPT_API_URL=your_url \
  -e YANDEX_IAM_TOKEN=your_token \
  -e YANDEX_FOLDER_ID=your_folder_id \
  -e DATABASE_URL=file:/app/prisma/dev.db \
  -v $(pwd)/data/prisma:/app/prisma \
  multimodel-chat-ru
```

## Требования

- Docker
- 1GB RAM
- 10GB свободного места

## Доступ к приложению

После запуска контейнера приложение будет доступно по адресу:
http://localhost:3000

## База данных

1. База данных SQLite хранится в директории `./data/prisma` на хост-машине
2. Эта директория монтируется в контейнер как `/app/prisma`
3. При первом запуске база данных будет создана автоматически
4. Все данные сохраняются между перезапусками контейнера
5. Для резервного копирования достаточно сохранить содержимое директории `./data/prisma`

## Важные замечания

1. Убедитесь, что директория `./data/prisma` имеет правильные права доступа
2. Не изменяйте путь к базе данных в DATABASE_URL внутри контейнера
3. При необходимости перенести данные, копируйте всю директорию `./data/prisma`

