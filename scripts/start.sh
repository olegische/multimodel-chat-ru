#!/bin/bash

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "Файл .env не найден"
    echo "Копирование .env.example в .env..."
    cp .env.example .env
    echo "Пожалуйста, настройте переменные окружения в файле .env"
    exit 1
fi

# Запуск приложения
echo "Запуск приложения..."
npm run start 