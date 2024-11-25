#!/bin/bash

# Обновление системы
echo "Обновление системы..."
apt-get update
apt-get upgrade -y

# Установка необходимых пакетов
echo "Установка необходимых пакетов..."
apt-get install -y curl git nginx sqlite3 ufw

# Установка Node.js
echo "Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Создание рабочей директории
echo "Создание рабочей директории..."
mkdir -p /var/www/multimodel-chat-ru
chown www-data:www-data /var/www/multimodel-chat-ru

# Настройка Nginx
echo "Настройка Nginx..."
cp scripts/nginx.conf /etc/nginx/sites-available/multimodel-chat-ru
ln -s /etc/nginx/sites-available/multimodel-chat-ru /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Настройка systemd сервиса
echo "Настройка systemd сервиса..."
cp scripts/multimodel-chat.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable multimodel-chat
systemctl start multimodel-chat

# Настройка брандмауэра
echo "Настройка брандмауэра..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw --force enable

echo "Установка завершена!"
echo "Проверьте работу приложения по адресу http://localhost" 