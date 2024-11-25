#!/bin/bash

# Обновление системы
echo "Обновление системы..."
sudo apt-get update
sudo apt-get upgrade -y

# Установка необходимых пакетов
echo "Установка необходимых пакетов..."
sudo apt-get install -y curl git nginx sqlite3

# Установка Node.js
echo "Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Создание рабочей директории
echo "Создание рабочей директории..."
sudo mkdir -p /var/www/multimodel-chat
sudo chown www-data:www-data /var/www/multimodel-chat

# Настройка Nginx
echo "Настройка Nginx..."
sudo cp scripts/nginx.conf /etc/nginx/sites-available/multimodel-chat
sudo ln -s /etc/nginx/sites-available/multimodel-chat /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Настройка systemd сервиса
echo "Настройка systemd сервиса..."
sudo cp scripts/multimodel-chat.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable multimodel-chat
sudo systemctl start multimodel-chat

# Настройка брандмауэра
echo "Настройка брандмауэра..."
sudo apt-get install -y ufw
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "Установка завершена!"
echo "Проверьте работу приложения по адресу http://your-domain.com" 