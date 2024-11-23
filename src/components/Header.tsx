'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Multimodel Chat
          </h1>
          <div className="w-10 h-10" /> {/* Placeholder for button */}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Multimodel Chat
        </h1>
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>
    </header>
  );
} 