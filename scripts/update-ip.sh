#!/bin/bash

# Запрос IP адреса
echo "Введите внешний IP адрес сервера:"
read SERVER_IP

# Проверка что IP введен
if [ -z "$SERVER_IP" ]; then
    echo "IP адрес не может быть пустым"
    exit 1
fi

# Обновление конфигурации nginx
echo "Обновление конфигурации nginx..."
sed -i "s/server_name localhost;/server_name localhost $SERVER_IP;/" /etc/nginx/sites-available/multimodel-chat-ru

# Проверка конфигурации nginx
echo "Проверка конфигурации nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Перезапуск сервисов..."
    systemctl restart nginx
    systemctl restart multimodel-chat
    echo "Готово! Приложение доступно по адресу: http://$SERVER_IP"
else
    echo "Ошибка в конфигурации nginx"
    exit 1
fi 