# Инструкция по настройке окружения разработки

## Требования к системе
- Windows 10/11, macOS 12+ или Ubuntu 20.04+
- Минимум 8GB RAM
- 20GB свободного места на диске

## 1. Установка Node.js и npm

### Windows
1. Скачайте LTS версию Node.js с официального сайта: https://nodejs.org/
2. Запустите установщик и следуйте инструкциям
3. Проверьте установку:
```bash
node --version  # Должно быть v18.x.x или выше
npm --version   # Должно быть 9.x.x или выше
```

### macOS
1. Установите через Homebrew:
```bash
brew install node
```
2. Проверьте установку как описано выше

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Установка Git

### Windows
1. Скачайте установщик с https://git-scm.com/download/win
2. Запустите установщик, выберите следующие опции:
   - Git from the command line and also from 3rd-party software
   - Use Visual Studio Code as Git's default editor
   - Git Credential Manager Core

### macOS
```bash
brew install git
```

### Linux
```bash
sudo apt-get update
sudo apt-get install git
```

## 3. Настройка VS Code

1. Скачайте и установите VS Code с https://code.visualstudio.com/

2. Установите необходимые расширения:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - SQLite Viewer
   - Prisma
   - GitLens

3. Настройте автоформатирование при сохранении:
   - Откройте Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Найдите "Preferences: Open Settings (JSON)"
   - Добавьте следующие настройки:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 4. Установка SQLite

### Windows
1. Скачайте предварительно собранные бинарные файлы с https://sqlite.org/download.html
2. Добавьте путь к sqlite3.exe в переменную PATH

### macOS
```bash
brew install sqlite
```

### Linux
```bash
sudo apt-get install sqlite3
```

## 5. Настройка Prisma CLI

```bash
npm install -g prisma
```

## Проверка установки

Выполните следующие команды для проверки корректности установки:

```bash
node --version
npm --version
git --version
code --version
sqlite3 --version
prisma --version
```

## Дополнительные рекомендации

1. Настройте Git:
```bash
git config --global user.name "Ваше имя"
git config --global user.email "ваш@email.com"
```

2. Создайте SSH ключ для GitHub:
```bash
ssh-keygen -t ed25519 -C "ваш@email.com"
```

3. Настройте глобальный .gitignore:
```bash
git config --global core.excludesfile ~/.gitignore_global
```

4. Установите рекомендуемые глобальные npm пакеты:
```bash
npm install -g npm-check-updates
npm install -g serve
```

## Возможные проблемы и их решения

### Windows
- Если команды не распознаются в терминале, перезапустите терминал или компьютер
- Проверьте переменные среды PATH

### macOS
- Если возникают проблемы с правами доступа при установке глобальных npm пакетов:
```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

### Linux
- Если npm требует sudo:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
``` 