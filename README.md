# Развертывание Multimodel Chat в Debian Container

Инструкция по установке и настройке приложения Multimodel Chat в контейнере Debian.

## Подготовка системы

1. Клонирование репозитория:
```bash
cd /var/www
git clone https://github.com/your-username/multimodel-chat.git multimodel-chat-ru
cd multimodel-chat-ru
```

2. Установка прав на исполнение скриптов:
```bash
chmod +x scripts/*.sh
```

3. Запуск скрипта установки:
```bash
./scripts/setup-debian.sh
```
Скрипт выполнит:
- Обновление системы
- Установку необходимых пакетов (curl, git, nginx, sqlite3, ufw)
- Установку Node.js 20.x
- Настройку рабочей директории
- Настройку Nginx
- Настройку systemd сервиса
- Настройку брандмауэра (только порт 80)

4. Настройка переменных окружения:
```bash
cp .env.example .env
vi .env
```

5. Сборка и запуск приложения:
```bash
./scripts/build.sh  # Установка зависимостей и сборка
./scripts/start.sh  # Запуск приложения
```

## Проверка работоспособности

1. Проверка статуса службы:
```bash
systemctl status multimodel-chat
```

2. Просмотр логов:
```bash
journalctl -u multimodel-chat -f
```

## Полезные команды

- Перезапуск приложения: `systemctl restart multimodel-chat`
- Остановка приложения: `systemctl stop multimodel-chat`
- Просмотр логов nginx: `tail -f /var/log/nginx/error.log`
- Проверка порта: `netstat -tulpn | grep 3000`

## Устранение неполадок

1. Если порт 3000 занят:
```bash
lsof -i :3000
kill -9 <PID>
```

2. Если не хватает прав:
```bash
chown -R www-data:www-data /var/www/multimodel-chat-ru
chmod -R 755 /var/www/multimodel-chat-ru
```

3. Если проблемы с npm:
```bash
npm cache clean --force
rm -rf node_modules
rm -rf .next
./scripts/build.sh
```

## Требования к системе

- Debian 10+ или Ubuntu 20.04+
- Минимум 1GB RAM
- 10GB свободного места
- Порт 80 должен быть свободен

## Обновление приложения

1. Получение обновлений:
```bash
cd /var/www/multimodel-chat-ru
git pull                 # Получаем обновления из репозитория
```

2. Обновление IP адреса и перезапуск сервисов:
```bash
chmod +x scripts/update-ip.sh  # Только при первом использовании
./scripts/update-ip.sh
```

Примечание: Скрипт update-ip.sh изменяет только рабочую копию конфигурации nginx в 
/etc/nginx/sites-available/multimodel-chat-ru, не затрагивая файлы в репозитории. 
Поэтому нет необходимости использовать git stash при обновлении.
