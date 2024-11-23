'use client';

import { useEffect, useRef } from 'react';

interface Message {
  id: number;
  message: string;
  response: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

export default function ChatWindow({ messages, loading = false }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm text-gray-900 dark:text-white">
                {msg.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2.5 justify-end">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg px-4 py-2 max-w-[80%]">
              <p className="text-sm text-gray-900 dark:text-white">
                {msg.response}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-center">
          <div className="animate-bounce">⌛</div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
} 