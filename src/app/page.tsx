'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ChatWindow from '@/components/ChatWindow';
import Footer from '@/components/Footer';

interface Message {
  id: number;
  message: string;
  response: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          temperature: 0.7,
          maxTokens: 1000,
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
      <Header />
      <main className="flex-1 overflow-hidden mt-16 max-w-5xl mx-auto w-full">
        <ChatWindow messages={messages} loading={loading} />
      </main>
      <Footer onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}
