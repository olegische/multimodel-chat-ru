import { z } from 'zod';

// Types
interface GigaChatConfig {
  apiUrl: string;
  credentials: string;
  scope: string;
  verifySslCerts: boolean;
}

// Available models configuration
export const GIGACHAT_MODELS = {
  'GigaChat': {
    id: 'GigaChat',
    description: 'Легкая модель для простых задач, требующих максимальной скорости работы'
  },
  'GigaChat-Pro': {
    id: 'GigaChat-Pro',
    description: 'Продвинутая модель для сложных задач, требующих креативности и лучшего следования инструкциям'
  },
  'GigaChat-Max': {
    id: 'GigaChat-Max',
    description: 'Продвинутая модель для сложных задач, требующих высокого уровня креативности и качества работы'
  }
} as const;

export type GigaChatModel = keyof typeof GIGACHAT_MODELS;

// Constants
const DEFAULT_CONFIG = {
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: 'Ты — умный ассистент, который помогает пользователям.',
  defaultModel: 'GigaChat' as GigaChatModel
} as const;

// Validation schemas
const gigachatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        role: z.string(),
        content: z.string()
      })
    })
  )
});

// Config initialization
const getConfig = (): GigaChatConfig => {
  const config = {
    apiUrl: process.env.GIGACHAT_API_URL,
    credentials: process.env.GIGACHAT_CREDENTIALS,
    scope: process.env.GIGACHAT_SCOPE,
    verifySslCerts: process.env.GIGACHAT_VERIFY_SSL_CERTS === 'true'
  };

  if (!config.apiUrl || !config.credentials || !config.scope) {
    throw new Error('GigaChat API configuration is missing');
  }

  return config as GigaChatConfig;
}; 