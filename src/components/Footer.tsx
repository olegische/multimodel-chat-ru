'use client';

import { useState } from 'react';
import GenerationSettings from './GenerationSettings';

interface FooterProps {
  onSendMessage: (message: string, settings: { temperature: number; maxTokens: number }) => void;
  disabled?: boolean;
}

export default function Footer({ onSendMessage, disabled = false }: FooterProps) {
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message, settings);
      setMessage('');
    }
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4 space-y-4">
        <GenerationSettings
          temperature={settings.temperature}
          maxTokens={settings.maxTokens}
          onSettingsChange={setSettings}
          disabled={disabled}
        />
        
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отправить
          </button>
        </div>
      </form>
    </footer>
  );
} 