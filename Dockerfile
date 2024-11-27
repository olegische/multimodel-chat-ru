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

# Копирование файлов приложения
COPY . .

# Установка зависимостей и сборка приложения
RUN npm install && \
    npx prisma generate && \
    npm run build

# Открываем порт для Next.js
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"] 