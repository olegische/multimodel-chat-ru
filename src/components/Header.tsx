'use client';

import { ProviderType } from '@/providers/factory';
import ProviderSelector from './ProviderSelector';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  provider: ProviderType;
  onProviderChange: (provider: ProviderType) => void;
  disabled?: boolean;
}

export default function Header({ provider, onProviderChange, disabled }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b dark:bg-gray-900 dark:border-gray-800">
      <h1 className="text-xl font-semibold">Multi-Model Chat</h1>
      <div className="flex items-center gap-4">
        <ProviderSelector
          selectedProvider={provider}
          onProviderChange={onProviderChange}
          disabled={disabled}
        />
        <ThemeToggle />
      </div>
    </header>
  );
} 