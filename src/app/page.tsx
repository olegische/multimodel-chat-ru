'use client';

import { useEffect, useState } from 'react';
import { Message } from '@prisma/client';
import { ProviderType } from '@/providers/factory';
import Header from '@/components/Header';
import ChatWindow from '@/components/ChatWindow';
import Footer from '@/components/Footer';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderType>('yandex');
  const [model, setModel] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000
  });
  const [isProvidersLoading, setIsProvidersLoading] = useState(true);
  const [isModelsLoading, setIsModelsLoading] = useState(true);

  useEffect(() => {
    // Загружаем модель по умолчанию для выбранного провайдера
    async function loadDefaultModel() {
      try {
        setIsModelsLoading(true);
        const response = await fetch(`/api/models?provider=${provider}`);
        if (!response.ok) throw new Error('Failed to load models');
        const models = await response.json();
        setModel(models[0] || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsModelsLoading(false);
      }
    }

    loadDefaultModel();
  }, [provider]);

  // Загрузка списка провайдеров
  useEffect(() => {
    async function loadProviders() {
      try {
        setIsProvidersLoading(true);
        const response = await fetch('/api/providers');
        if (!response.ok) throw new Error('Failed to load providers');
        const data = await response.json();
        // Если текущий провайдер недоступен, выбираем первый доступный
        const availableProviders = data.filter((p: any) => p.status.available);
        if (availableProviders.length > 0 && !availableProviders.some((p: any) => p.id === provider)) {
          setProvider(availableProviders[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsProvidersLoading(false);
      }
    }

    loadProviders();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const tempId = Date.now();
    
    try {
      setLoading(true);
      setError(null);
      
      // Создаем временное сообщение пользователя
      const tempMessage = {
        id: tempId,
        chatId: 'temp',
        message: message.trim(),
        response: null,
        model: model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        timestamp: new Date()
      } as Message;
      
      // Добавляем сообщение пользователя немедленно
      setMessages(prev => [...prev, tempMessage]);
      setInputValue('');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          provider,
          options: {
            model,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Заменяем временное сообщение на полученное от сервера
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? {
          ...data.message,
          id: msg.id // Сохраняем временный ID для стабильности UI
        } : msg
      ));
    } catch (err) {
      console.error('Error sending message:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Удаляем временное сообщение в случае ошибки
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const isInitializing = isProvidersLoading || isModelsLoading;

  return (
    <div className="flex flex-col h-screen">
      <Header 
        provider={provider}
        onProviderChange={setProvider}
        model={model}
        onModelChange={setModel}
        disabled={loading}
        isProvidersLoading={isProvidersLoading}
        isModelsLoading={isModelsLoading}
      />
      <ChatWindow 
        messages={messages}
        provider={provider}
        loading={loading}
        error={error}
      />
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-5xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder={isInitializing ? "Загрузка..." : "Введите сообщение..."}
            className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isInitializing}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isInitializing}
          >
            {isInitializing ? "Загрузка..." : "Отправить"}
          </button>
        </div>
      </div>
      <Footer
        provider={provider}
        temperature={settings.temperature}
        maxTokens={settings.maxTokens}
        onSettingsChange={setSettings}
        disabled={loading || isInitializing}
      />
    </div>
  );
}
