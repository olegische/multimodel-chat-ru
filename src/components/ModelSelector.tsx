'use client';

import { useEffect, useState } from 'react';
import { ProviderType } from '@/providers/factory';

interface ModelSelectorProps {
  selectedModel: string;
  provider: ProviderType;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({
  selectedModel,
  provider,
  onModelChange,
  disabled = false
}: ModelSelectorProps) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModels() {
      try {
        setLoading(true);
        const response = await fetch(`/api/models?provider=${provider}`);
        if (!response.ok) throw new Error('Failed to load models');
        const data = await response.json();
        setModels(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadModels();
  }, [provider]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Загрузка моделей...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <span>Ошибка: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <label htmlFor="model" className="text-gray-600 dark:text-gray-400">
        Модель:
      </label>
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
} 