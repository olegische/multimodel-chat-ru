# Базовый образ
FROM debian:11

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    curl \
    git \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Установка Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Создание рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование Prisma схемы и настройка базы данных
COPY prisma ./prisma/
RUN npx prisma generate && \
    npx prisma migrate deploy

# Копирование остальных файлов приложения
COPY . .

# Сборка приложения
RUN npm run build

# Открываем порт для Next.js
EXPOSE 3000

# Запуск приложения с предварительной миграцией базы данных
CMD npx prisma migrate deploy && npm start 