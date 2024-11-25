import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NextRequest as ActualNextRequest, NextResponse as ActualNextResponse } from 'next/server';
import { POST } from '@/app/api/chat/route';
import prismaClient from '@/lib/db';
import { generateResponse } from '@/lib/yandexGpt';
import { z } from 'zod';

// Мокаем модули
jest.mock('@/lib/db', () => {
  return {
    __esModule: true,
    default: {
      chat: {
        create: jest.fn().mockImplementation(() => Promise.resolve({ id: 'chat-123' })),
        findUnique: jest.fn(),
      },
      message: {
        create: jest.fn(),
        findMany: jest.fn().mockImplementation(() => Promise.resolve([])),
      },
    },
  };
});

jest.mock('@/lib/yandexGpt', () => ({
  generateResponse: jest.fn().mockImplementation(() => Promise.resolve('Test response')),
  YANDEX_GPT_MODELS: {
    'YandexGPT Pro RC': {
      uri: 'yandexgpt/rc',
      generation: 4
    }
  }
}));

// Update the NextResponse mock with proper typing
jest.mock('next/server', () => {
  const actualNext = jest.requireActual('next/server');
  return {
    ...actualNext,
    NextResponse: {
      ...actualNext.NextResponse,
      json: function json(body: any, init?: ResponseInit) {
        return new actualNext.NextResponse(JSON.stringify(body), {
          ...init,
          headers: {
            'content-type': 'application/json',
            ...init?.headers,
          },
        });
      },
    },
  };
});

describe('Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new chat and message', async () => {
    // Подготавливаем моки
    const mockChat = { id: 'chat-123' };
    const mockMessage = {
      id: 1,
      message: 'Test message',
      response: 'Test response',
      timestamp: new Date(),
    };

    (prismaClient.chat.create as jest.Mock).mockResolvedValue(mockChat);
    (prismaClient.message.findMany as jest.Mock).mockResolvedValue([]);
    (generateResponse as jest.Mock).mockResolvedValue('Test response');
    (prismaClient.message.create as jest.Mock).mockResolvedValue(mockMessage);

    // Создаем тестовый запрос
    const request = new ActualNextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
        model: 'YandexGPT Pro RC',
        temperature: 0.7,
        maxTokens: 1000,
      }),
    });

    // Отправляем запрос
    const response = await POST(request);
    const data = await response.json();

    // Проверяем результат
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.message).toEqual(mockMessage);
    expect(data.data.chatId).toBe(mockChat.id);

    // Проверяем, что нужные функции были вызваны
    expect(prismaClient.chat.create).toHaveBeenCalled();
    expect(prismaClient.message.findMany).toHaveBeenCalled();
    expect(generateResponse).toHaveBeenCalled();
    expect(prismaClient.message.create).toHaveBeenCalled();
  });

  it('should handle invalid request data', async () => {
    const request = new ActualNextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        // Отсутствует обязательное поле message
        temperature: 0.7,
        maxTokens: 1000,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid request data');
  });

  it('should handle API errors', async () => {
    (prismaClient.chat.create as jest.Mock).mockResolvedValue({ id: 'chat-123' });
    (prismaClient.message.findMany as jest.Mock).mockResolvedValue([]);
    (generateResponse as jest.Mock).mockRejectedValue(new Error('API Error'));

    const request = new ActualNextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
        model: 'YandexGPT Pro RC',
        temperature: 0.7,
        maxTokens: 1000,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Internal Server Error');
  });
}); 