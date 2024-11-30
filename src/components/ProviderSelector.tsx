'use client';

import { useEffect, useState } from 'react';
import { ProviderType } from '@/providers/factory';

interface ProviderSelectorProps {
  selectedProvider: ProviderType;
  onProviderChange: (provider: ProviderType) => void;
  disabled?: boolean;
}

interface ProviderStatus {
  id: ProviderType;
  status: {
    available: boolean;
    lastCheck: number;
  };
}

export default function ProviderSelector({
  selectedProvider,
  onProviderChange,
  disabled = false
}: ProviderSelectorProps) {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProviders() {
      try {
        const response = await fetch('/api/providers');
        if (!response.ok) throw new Error('Failed to load providers');
        const data = await response.json();
        setProviders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Загрузка провайдеров...</span>
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
      <label htmlFor="provider" className="text-gray-600 dark:text-gray-400">
        Провайдер:
      </label>
      <select
        id="provider"
        value={selectedProvider}
        onChange={(e) => onProviderChange(e.target.value as ProviderType)}
        disabled={disabled}
        className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        {providers.map(({ id, status }) => (
          <option key={id} value={id} disabled={!status.available}>
            {id} {!status.available && '(недоступен)'}
          </option>
        ))}
      </select>
    </div>
  );
} 