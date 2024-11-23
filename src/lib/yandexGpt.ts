import { Message } from '@prisma/client';
import { z } from 'zod';

const GPT_API_URL = process.env.YANDEX_GPT_API_URL!;
const IAM_TOKEN = process.env.YANDEX_IAM_TOKEN!;
const FOLDER_ID = process.env.YANDEX_FOLDER_ID!;

if (!GPT_API_URL || !IAM_TOKEN || !FOLDER_ID) {
  throw new Error('Yandex GPT API configuration is missing');
}

// Схема валидации ответа от API
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

export async function generateResponse(
  message: string,
  temperature: number = 0.7,
  maxTokens: number = 1000,
  previousMessages: Message[] = []
) {
  try {
    // Формируем контекст из предыдущих сообщений
    const context = previousMessages.map(msg => [
      { role: 'user', text: msg.message },
      { role: 'assistant', text: msg.response }
    ]).flat();

    const response = await fetch(GPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${IAM_TOKEN}`,
        'x-folder-id': FOLDER_ID
      },
      body: JSON.stringify({
        modelUri: `gpt://${FOLDER_ID}/yandexgpt`,
        completionOptions: {
          stream: false,
          temperature,
          maxTokens: `${maxTokens}`
        },
        messages: [
          {
            role: 'system',
            text: 'Ты — умный ассистент, который помогает пользователям.'
          },
          ...context,
          {
            role: 'user',
            text: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`GPT API error: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = gptResponseSchema.parse(data);

    return validated.result.alternatives[0].message.text;

  } catch (error) {
    console.error('Error calling Yandex GPT API:', error);
    throw error;
  }
} 