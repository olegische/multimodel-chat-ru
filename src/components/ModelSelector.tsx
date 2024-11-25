'use client';

import { YANDEX_GPT_MODELS, YandexGPTModel } from '@/lib/yandexGpt';

interface ModelSelectorProps {
  selectedModel: YandexGPTModel;
  onModelChange: (model: YandexGPTModel) => void;
  disabled?: boolean;
}

export default function ModelSelector({ 
  selectedModel, 
  onModelChange,
  disabled = false 
}: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as YandexGPTModel)}
        disabled={disabled}
        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {Object.entries(YANDEX_GPT_MODELS).map(([name, info]) => (
          <option key={name} value={name}>
            {name} (Gen {info.generation})
          </option>
        ))}
      </select>
    </div>
  );
} 