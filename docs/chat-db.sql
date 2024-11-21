-- Таблица для хранения истории сообщений чата
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id UUID NOT NULL,  -- Уникальный идентификатор чата
    message TEXT NOT NULL,  -- Сообщение пользователя
    response TEXT,          -- Ответ от GPT
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,  -- Время отправки сообщения
    temperature DECIMAL(3, 2),  -- Параметр температуры для генерации ответа
    max_tokens INT,  -- Максимальное количество токенов в ответе
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id)  -- Связь с таблицей чатов
);

-- Таблица для хранения информации о чатах
CREATE TABLE chats (
    chat_id UUID PRIMARY KEY,  -- Уникальный идентификатор чата
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP  -- Время начала чата
);