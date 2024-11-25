import { NextResponse } from 'next/server';
import prismaClient from '@/lib/db';
import { generateResponse, YandexGPTModel } from '@/lib/yandexGpt';
import { z } from 'zod';

// Схема валидации входящего запроса
const chatRequestSchema = z.object({
  message: z.string().min(1),
  model: z.string(),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().min(1).max(2000).default(1000),
  chatId: z.string().optional() // Опциональный параметр для продолжения существующего чата
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация входящих данных
    const { message, model, temperature, maxTokens, chatId } = chatRequestSchema.parse(body);

    // Получаем или создаем чат
    const chat = chatId 
      ? await prismaClient.chat.findUnique({ where: { id: chatId } })
      : await prismaClient.chat.create({ data: {} });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Получаем контекст предыдущих сообщений
    const previousMessages = await prismaClient.message.findMany({
      where: { chatId: chat.id },
      orderBy: { timestamp: 'asc' },
      take: 10 // Ограничиваем контекст последними 10 сообщениями
    });

    // Получаем ответ от GPT с учетом контекста
    const gptResponse = await generateResponse(
      message,
      model as YandexGPTModel,
      temperature,
      maxTokens,
      previousMessages
    );

    // Сохраняем сообщение в БД
    const savedMessage = await prismaClient.message.create({
      data: {
        chatId: chat.id,
        message: message,
        response: gptResponse,
        temperature,
        maxTokens
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        message: savedMessage,
        chatId: chat.id
      }
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 