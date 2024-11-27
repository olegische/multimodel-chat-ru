# Multimodel Chat

## Развертывание на Debian 11

### Подготовка хоста

1. Установка необходимых пакетов:
```bash
apt-get update && apt-get install -y docker.io nginx git
```

2. Клонирование репозитория:
```bash
git clone https://github.com/your-username/multimodel-chat.git /opt/multimodel-chat-ru
cd /opt/multimodel-chat-ru
```

3. Настройка Nginx:
```bash
cp scripts/nginx.conf /etc/nginx/sites-available/multimodel-chat-ru
ln -sf /etc/nginx/sites-available/multimodel-chat-ru /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # удаляем дефолтный конфиг
nginx -t && nginx -s reload
```

4. Настройка IP адреса:
```bash
chmod +x scripts/update-ip.sh
./scripts/update-ip.sh
```

### Настройка приложения

1. Создание директории для данных:
```bash
mkdir -p /opt/multimodel-chat-ru/data/prisma
```

2. Настройка переменных окружения:
```bash
cp .env.example .env
vi .env
```

### Запуск контейнера

1. Сборка образа:
```bash
docker build -t multimodel-chat-ru .
```

2. Запуск контейнера:
```bash
docker run -d \
  --name multimodel-chat \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -v /opt/multimodel-chat-ru/.env:/app/.env \
  -v /opt/multimodel-chat-ru/data/prisma:/app/prisma \
  multimodel-chat-ru
```

### Проверка работы

1. Проверка статуса контейнера:
```bash
docker ps
docker logs multimodel-chat
```

2. Проверка доступности приложения:
```bash
curl http://localhost
```

### Обновление приложения

1. Получение обновлений:
```bash
cd /opt/multimodel-chat-ru
git pull
```

2. Пересборка и перезапуск контейнера:
```bash
docker build -t multimodel-chat-ru .
docker stop multimodel-chat
docker rm multimodel-chat
docker run -d \
  --name multimodel-chat \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -v /opt/multimodel-chat-ru/.env:/app/.env \
  -v /opt/multimodel-chat-ru/data/prisma:/app/prisma \
  multimodel-chat-ru
```

## Важные замечания

1. База данных хранится в `/opt/multimodel-chat-ru/data/prisma`
2. Переменные окружения хранятся в `/opt/multimodel-chat-ru/.env`
3. Контейнер автоматически перезапускается при перезагрузке системы
4. Nginx проксирует запросы с 80 порта на контейнер

