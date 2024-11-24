#!/bin/bash

# Функция проверки установленного пакета
is_installed() {
    dpkg -l "$1" &> /dev/null
    return $?
}

# Функция проверки существования директории
check_directory() {
    if [ -d "$1" ]; then
        echo "Директория $1 уже существует"
        return 0
    fi
    return 1
}

# Обновление системы
echo "Проверка обновлений системы..."
apt-get update
apt-get upgrade -y

# Установка необходимых пакетов
echo "Проверка необходимых пакетов..."
PACKAGES="curl git nginx sqlite3 vim"
for pkg in $PACKAGES; do
    if ! is_installed "$pkg"; then
        echo "Установка $pkg..."
        apt-get install -y "$pkg"
    else
        echo "Пакет $pkg уже установлен"
    fi
done

# Установка Node.js
if ! is_installed "nodejs"; then
    echo "Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js уже установлен"
    node_version=$(node -v)
    echo "Текущая версия: $node_version"
fi

# Создание рабочей директории
if ! check_directory "/var/www/multimodel-chat-ru"; then
    echo "Создание рабочей директории..."
    mkdir -p /var/www/multimodel-chat-ru
    chown www-data:www-data /var/www/multimodel-chat-ru
fi

# Настройка Nginx
echo "Настройка Nginx..."
cp scripts/nginx.conf /etc/nginx/sites-available/multimodel-chat-ru
ln -sf /etc/nginx/sites-available/multimodel-chat-ru /etc/nginx/sites-enabled/
nginx -t && nginx -s reload

echo "Установка завершена!"
echo "Проверьте работу приложения по адресу http://localhost" 