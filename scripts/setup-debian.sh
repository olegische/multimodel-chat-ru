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

# Функция проверки существования файла
check_file() {
    if [ -f "$1" ]; then
        echo "Файл $1 уже существует"
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
if ! check_file "/etc/nginx/sites-available/multimodel-chat-ru"; then
    echo "Настройка Nginx..."
    cp scripts/nginx.conf /etc/nginx/sites-available/multimodel-chat-ru
    if ! check_file "/etc/nginx/sites-enabled/multimodel-chat-ru"; then
        ln -s /etc/nginx/sites-available/multimodel-chat-ru /etc/nginx/sites-enabled/
    fi
    nginx -t && systemctl restart nginx
else
    echo "Конфигурация Nginx уже существует"
fi

# Настройка systemd сервиса
if ! check_file "/etc/systemd/system/multimodel-chat.service"; then
    echo "Настройка systemd сервиса..."
    cp scripts/multimodel-chat.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable multimodel-chat
    systemctl start multimodel-chat
else
    echo "Служба multimodel-chat уже настроена"
fi

echo "Установка завершена!"
echo "Проверьте работу приложения по адресу http://localhost" 