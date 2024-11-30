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

  if (error) {
    return (
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Начните диалог, отправив сообщение
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {/* Сообщение пользователя */}
            <div className="flex justify-end">
              <div className="inline-block max-w-[80%] p-4 rounded-lg bg-blue-500 text-white">
                <div className="text-sm mb-1">Вы</div>
                <div className="whitespace-pre-wrap break-words">
                  {msg.message}
                </div>
              </div>
            </div>

            {/* Ответ провайдера */}
            {msg.response && (
              <div className="flex justify-start">
                <div className="inline-block max-w-[80%] p-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <div className="text-sm mb-1">{provider}</div>
                  <div className="whitespace-pre-wrap break-words">
                    {msg.response}
                  </div>
                  {msg.model && (
                    <div className="mt-2 text-xs opacity-70">
                      Модель: {msg.model}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            {provider} печатает...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
} 