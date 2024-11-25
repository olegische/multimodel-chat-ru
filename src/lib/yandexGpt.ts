import { Message } from '@prisma/client';
import { z } from 'zod';

// Types
interface YandexGPTConfig {
  apiUrl: string;
  iamToken: string;
  folderId: string;
}

interface GPTMessage {
  role: string;
  text: string;
}

// Available models configuration
export const YANDEX_GPT_MODELS = {
  'YandexGPT Lite Latest': {
    uri: 'yandexgpt-lite/latest',
    generation: 3
  },
  'YandexGPT Lite RC': {
    uri: 'yandexgpt-lite/rc',
    generation: 4
  },
  'YandexGPT Pro Latest': {
    uri: 'yandexgpt/latest',
    generation: 3
  },
  'YandexGPT Pro RC': {
    uri: 'yandexgpt/rc',
    generation: 4
  },
  'YandexGPT Pro 32k RC': {
    uri: 'yandexgpt-32k/rc',
    generation: 4
  }
} as const;

export type YandexGPTModel = keyof typeof YANDEX_GPT_MODELS;

// Constants
const DEFAULT_CONFIG = {
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: 'Ты — умный ассистент, который помогает пользователям.',
  defaultModel: 'YandexGPT Pro RC' as YandexGPTModel
} as const;

// Validation schemas
const gptResponseSchema = z.object({
  result: z.object({
    alternatives: z.array(
      z.object({
        message: z.object({
          role: z.string(),
          text: z.string()
        })
      })
    )
  })
});

// Config initialization
const getConfig = (): YandexGPTConfig => {
  const config = {
    apiUrl: process.env.YANDEX_GPT_API_URL,
    iamToken: process.env.YANDEX_IAM_TOKEN,
    folderId: process.env.YANDEX_FOLDER_ID,
  };

  if (!config.apiUrl || !config.iamToken || !config.folderId) {
    throw new Error('Yandex GPT API configuration is missing');
  }

  return config as YandexGPTConfig;
};

const formatMessages = (
  message: string,
  previousMessages: Message[],
): GPTMessage[] => {
  const context = previousMessages.map(msg => [
    { role: 'user', text: msg.message },
    { role: 'assistant', text: msg.response }
  ]).flat();

  return [
    { role: 'system', text: DEFAULT_CONFIG.systemPrompt },
    ...context,
    { role: 'user', text: message }
  ];
};

export async function generateResponse(
  message: string,
  modelName: YandexGPTModel = DEFAULT_CONFIG.defaultModel,
  temperature: number = DEFAULT_CONFIG.temperature,
  maxTokens: number = DEFAULT_CONFIG.maxTokens,
  previousMessages: Message[] = []
) {
  const config = getConfig();
  const model = YANDEX_GPT_MODELS[modelName];

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.iamToken}`,
        'x-folder-id': config.folderId
      },
      body: JSON.stringify({
        modelUri: `gpt://${config.folderId}/${model.uri}`,
        completionOptions: {
          stream: false,
          temperature,
          maxTokens: `${maxTokens}`
        },
        messages: formatMessages(message, previousMessages)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GPT API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const validated = gptResponseSchema.parse(data);

    return validated.result.alternatives[0].message.text;

  } catch (error) {
    console.error('Error calling Yandex GPT API:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Unknown error occurred while calling Yandex GPT API');
  }
} 