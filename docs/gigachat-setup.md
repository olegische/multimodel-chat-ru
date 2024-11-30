# Настройка GigaChat API

## Получение ключа авторизации

1. Откройте проект GigaChat API в личном кабинете Studio.
2. В левой панели выберите раздел "Настройки API".
3. Нажмите кнопку "Получить ключ".
   > Ключ авторизации могут получить только пользователи с ролями Владелец и Администратор
4. В открывшемся окне скопируйте и сохраните значение поля Authorization Key.
   > Ключ отображается только один раз и не хранится в личном кабинете

## Проверка доступа

Для проверки доступа выполните тестовый запрос:

```bash
# 1. Получение токена доступа
curl -L -X POST 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-H 'Accept: application/json' \
-H 'RqUID: 4c1b9147-c4c5-4a1c-b75a-8bb47d6cdab6' \
-H 'Authorization: Basic your_authorization_key' \
--data-urlencode 'scope=GIGACHAT_API_PERS'

# 2. Проверка списка моделей
curl https://gigachat.devices.sberbank.ru/api/v1/models \
-H 'Accept: application/json' \
-H 'Authorization: Bearer your_access_token'
``` 