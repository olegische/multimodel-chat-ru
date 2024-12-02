'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { ProviderType } from '@/providers/factory';

interface ChatWindowProps {
  messages: Message[];
  provider: ProviderType;
  loading?: boolean;
  error?: string | null;
}

// Компонент сообщения пользователя
const UserMessage = ({ message }: { message: string }) => (
  <div className="flex justify-end mb-4">
    <div className="inline-block max-w-[80%] p-4 rounded-lg bg-blue-500 text-white">
      <div className="text-sm mb-1">Вы</div>
      <div className="whitespace-pre-wrap break-words" data-testid="user-message">
        {message}
      </div>
    </div>
  </div>
);

// Компонент ответа провайдера
const ProviderResponse = ({ response, model, provider }: { response: string; model?: string | null; provider?: string | null }) => (
  <div className="flex justify-start">
    <div className="inline-block max-w-[80%] p-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="text-sm mb-1">{provider || 'Unknown Provider'}</div>
      <div className="whitespace-pre-wrap break-words" data-testid="provider-response">
        {response}
      </div>
      {model && (
        <div className="mt-2 text-xs opacity-70">
          Модель: {model}
        </div>
      )}
    </div>
  </div>
);

// Компонент сообщения с ответом
const MessageWithResponse = ({ message, response, model, provider }: { message: string; response?: string | null; model?: string | null; provider?: string | null }) => (
  <div className="space-y-4">
    <UserMessage message={message} />
    {response && (
      <ProviderResponse 
        response={response} 
        model={model} 
        provider={provider}
      />
    )}
  </div>
);

// Компонент загрузки
const LoadingIndicator = ({ provider }: { provider: ProviderType }) => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-pulse text-gray-500 dark:text-gray-400">
      {provider} печатает...
    </div>
  </div>
);

// Компонент пустого состояния
const EmptyState = () => (
  <div className="text-center text-gray-500 dark:text-gray-400">
    Начните диалог, отправив сообщение
  </div>
);

// Компонент ошибки
const ErrorState = ({ error }: { error: string }) => (
  <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg" data-testid="error-message">
    {error}
  </div>
);

// Компонент списка сообщений
const MessageList = ({ messages, currentProvider }: { messages: Message[]; currentProvider: ProviderType }) => (
  <div className="space-y-4">
    {messages.map((msg) => (
      <MessageWithResponse 
        key={msg.id}
        message={msg.message}
        response={msg.response}
        model={msg.model}
        provider={msg.provider}
      />
    ))}
  </div>
);

export default function ChatWindow({ 
  messages, 
  provider,
  loading = false,
  error = null 
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && bottomRef.current?.scrollIntoView) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {error ? (
        <ErrorState error={error} />
      ) : messages.length === 0 ? (
        <EmptyState />
      ) : (
        <MessageList messages={messages} currentProvider={provider} />
      )}
      {loading && <LoadingIndicator provider={provider} />}
      <div ref={bottomRef} />
    </div>
  );
} 