#!/bin/bash

# Проверка наличия Node.js и npm
if ! command -v node &> /dev/null; then
    echo "Node.js не установлен"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm не установлен"
    exit 1
fi

# Установка зависимостей
echo "Установка зависимостей..."
npm install

# Генерация Prisma Client
echo "Генерация Prisma Client..."
npx prisma generate

# Применение миграций
echo "Применение миграций базы данных..."
npx prisma migrate deploy

# Сборка приложения
echo "Сборка приложения..."
npm run build

echo "Сборка завершена успешно!" 