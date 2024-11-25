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
    nginx -s reload
    # Перезапускаем приложение через kill и npm start
    if [ -f /var/www/multimodel-chat-ru/tmp/app.pid ]; then
        kill $(cat /var/www/multimodel-chat-ru/tmp/app.pid)
    fi
    cd /var/www/multimodel-chat-ru && npm start &
    echo "Готово! Приложение доступно по адресу: http://$SERVER_IP"
else
    echo "Ошибка в конфигурации nginx"
    exit 1
fi 