# Файлы к удалению в Release 2.0

## Неиспользуемые директории
1. `src/types/` - пустая директория, не используется (стили обрабатываются через Tailwind CSS)
2. `src/utils/` - пустая директория, не используется
3. `src/styles/` - пустая директория, не используется

## Устаревшие файлы
1. `src/lib/yandexGpt.ts` - функциональность перенесена в `src/providers/yandex/provider.ts`
   - Причина: реализация заменена на новую архитектуру провайдеров
   - Используется только в старых тестах, которые тоже нужно обновить

2. `src/lib/gigachat.ts` - функциональность перенесена в `src/providers/gigachat/provider.ts`
   - Причина: реализация заменена на новую архитектуру провайдеров
   - Файл не используется в компонентах или сервисах

## Файлы для сохранения
1. `src/lib/db.ts` - оставить, активно используется для инициализации Prisma client

## Рекомендации
1. Обновить тесты, использующие старый `yandexGpt.ts`
2. Проверить и удалить неиспользуемые импорты после удаления файлов
3. Обновить документацию, если есть ссылки на удаляемые файлы 