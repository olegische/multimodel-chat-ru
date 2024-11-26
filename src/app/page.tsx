'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ChatWindow from '@/components/ChatWindow';
import Footer from '@/components/Footer';
import { YandexGPTModel } from '@/lib/yandexGpt';

interface Message {
  id: number;
  message: string;
  response: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<YandexGPTModel>('YandexGPT Pro RC');

  const handleSendMessage = async (
    message: string, 
    settings: { temperature: number; maxTokens: number }
  ) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model: selectedModel,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data.message]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      <Header 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        disabled={loading}
      />
      <main className="flex-1 overflow-hidden mt-16 mb-24 max-w-5xl mx-auto w-full">
        <div className="h-full overflow-y-auto">
          <ChatWindow messages={messages} loading={loading} />
        </div>
      </main>
      <Footer onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}
