import { ChatService } from '../chat.service';
import { ProviderFactory } from '@/providers/factory';
import { BaseProvider } from '@/providers/base.provider';
import prisma from '@/lib/db';
import { z } from 'zod';

// Мокаем зависимости
jest.mock('@/providers/factory');
const mockedFactory = jest.mocked(ProviderFactory);
const mockedPrisma = jest.mocked(prisma);

describe('ChatService', () => {
  let chatService: ChatService;
  
  // Создаем мок провайдера
  const mockProvider = {
    constructor: { name: 'YandexProvider' },
    generateResponse: jest.fn(),
    listModels: jest.fn(),
    config: { apiUrl: 'test', credentials: 'test' },
    responseSchema: z.any(),
    validateResponse: jest.fn(),
    formatError: jest.fn(),
    validateOptions: jest.fn()
  };

  // Создаем моки для данных
  const mockChat = {
    id: 'test-chat-id',
    provider: 'yandex',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockMessage = {
    id: 1,
    chatId: mockChat.id,
    message: 'Test message',
    response: 'Test response',
    model: 'test-model',
    timestamp: new Date(),
    temperature: 0.7,
    maxTokens: 1000,
    provider: 'yandex'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFactory.createProvider.mockReturnValue(mockProvider as unknown as BaseProvider);
    chatService = new ChatService('yandex');

    // Настраиваем моки Prisma по умолчанию
    mockedPrisma.chat.create.mockResolvedValue(mockChat);
    mockedPrisma.chat.findUnique.mockResolvedValue(mockChat);
    mockedPrisma.message.create.mockResolvedValue(mockMessage);
    mockedPrisma.message.findMany.mockResolvedValue([mockMessage]);
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      mockProvider.generateResponse.mockResolvedValue({
        text: 'Test response',
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30
        }
      });

      // Очищаем историю сообщений для нового чата
      mockedPrisma.message.findMany.mockResolvedValue([]);
    });

    it('should create new chat if chatId is not provided', async () => {
      const result = await chatService.sendMessage('Test message');
      
      expect(mockedPrisma.chat.create).toHaveBeenCalledWith({
        data: { provider: 'yandex' }
      });
      expect(mockProvider.generateResponse).toHaveBeenCalledWith(
        'Test message',
        undefined,
        []
      );
      expect(result.chatId).toBe(mockChat.id);
      expect(result.message).toEqual(mockMessage);
    });

    it('should use existing chat if chatId is provided', async () => {
      const result = await chatService.sendMessage('Test message', mockChat.id);

      expect(mockedPrisma.chat.findUnique).toHaveBeenCalledWith({
        where: { id: mockChat.id }
      });
      expect(result.chatId).toBe(mockChat.id);
    });

    it('should handle provider options', async () => {
      const options = {
        temperature: 0.5,
        maxTokens: 500,
        model: 'specific-model'
      };

      await chatService.sendMessage('Test message', mockChat.id, options);

      expect(mockProvider.generateResponse).toHaveBeenCalledWith(
        'Test message',
        options,
        expect.any(Array)
      );
    });

    it('should handle chat not found error', async () => {
      mockedPrisma.chat.findUnique.mockResolvedValue(null);

      await expect(
        chatService.sendMessage('Test message', 'non-existent-id')
      ).rejects.toThrow('Chat not found');
    });

    it('should handle provider errors', async () => {
      mockProvider.generateResponse.mockRejectedValue(new Error('Provider error'));
      
      await expect(
        chatService.sendMessage('Test message', mockChat.id)
      ).rejects.toThrow('Provider error');
    });
  });

  describe('getHistory', () => {
    it('should return chat history', async () => {
      const result = await chatService.getHistory(mockChat.id);

      expect(mockedPrisma.message.findMany).toHaveBeenCalledWith({
        where: { chatId: mockChat.id },
        orderBy: { timestamp: 'asc' }
      });
      expect(result).toEqual([mockMessage]);
    });
  });
});