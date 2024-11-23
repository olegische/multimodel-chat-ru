import { NextResponse } from 'next/server';
import prismaClient from '@/lib/db';
import { z } from 'zod';

// Схема валидации входящего запроса
const chatRequestSchema = z.object({
  message: z.string().min(1),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().min(1).max(2000).default(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация входящих данных
    const { message, temperature, maxTokens } = chatRequestSchema.parse(body);

    // Создаем новый чат, если не передан chatId
    const chat = await prismaClient.chat.create({
      data: {}
    });

    // Здесь будет вызов Yandex GPT API
    const gptResponse = "Временный ответ от GPT"; // TODO: Реализовать вызов GPT API

    // Сохраняем сообщение в БД
    const savedMessage = await prismaClient.message.create({
      data: {
        chatId: chat.id,
        message: message,
        response: gptResponse,
        temperature,
        maxTokens,
      }
    });

    return NextResponse.json({
      success: true,
      data: savedMessage
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 