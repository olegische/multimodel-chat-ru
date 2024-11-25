# Multimodel Chat

Веб-приложение для общения с различными языковыми моделями.

## Требования

- Node.js 18.x или выше
- npm 9.x или выше
- SQLite 3.x

## Развертывание на Debian

1. Скопируйте файлы на сервер:
```bash
scp -r ./* user@your-server:/var/www/multimodel-chat/
```

2. Подключитесь к серверу:
```bash
ssh user@your-server
```

3. Перейдите в директорию проекта:
```bash
cd /var/www/multimodel-chat
```

4. Сделайте скрипты исполняемыми:
```bash
chmod +x scripts/*.sh
```

5. Запустите скрипт установки:
```bash
sudo ./scripts/setup-debian.sh
```

6. Настройте переменные окружения:
```bash
sudo nano .env
```

7. Проверьте статус сервиса:
```bash
sudo systemctl status multimodel-chat
```

### Полезные команды

- Просмотр логов: `sudo journalctl -u multimodel-chat`
- Перезапуск приложения: `sudo systemctl restart multimodel-chat`
- Проверка конфигурации nginx: `sudo nginx -t`
- Перезапуск nginx: `sudo systemctl restart nginx`



## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/multimodel-chat.git
cd multimodel-chat
```

2. Сделайте скрипты исполняемыми:
```bash
chmod +x scripts/build.sh scripts/start.sh
```

3. Запустите скрипт сборки:
```bash
./scripts/build.sh
```

4. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл, добавив необходимые ключи API
```

5. Запустите приложение:
```bash
./scripts/start.sh
```

Приложение будет доступно по адресу http://localhost:3000

## Переменные окружения

- `DATABASE_URL` - URL для подключения к SQLite базе данных
- `YANDEX_GPT_API_URL` - URL API Yandex GPT
- `YANDEX_IAM_TOKEN` - IAM токен для доступа к API
- `YANDEX_FOLDER_ID` - Идентификатор каталога в Yandex Cloud

## Разработка

Для запуска в режиме разработки:
```bash
npm run dev
```

## Тестирование

Запуск тестов:
```bash
npm test
```
