import '@jest/globals';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import fetch from 'node-fetch';
import { Request, Response } from 'node-fetch';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.fetch = fetch as any;
global.Request = Request as any;
global.Response = Response as any;

// Add this line to set up the jsdom environment
global.document = window.document;

// Настройка переменных окружения для тестов
process.env.YANDEX_GPT_API_URL = 'https://yandex.api';
process.env.YANDEX_API_KEY = 'yandex-key';
process.env.YANDEX_FOLDER_ID = 'yandex-folder';
process.env.GIGACHAT_API_URL = 'https://gigachat.api';
process.env.GIGACHAT_CREDENTIALS = 'gigachat-credentials';
process.env.GIGACHAT_SCOPE = 'GIGACHAT_API_PERS';

// Create and export the mock prisma client
export const prismaClient = mockDeep<PrismaClient>();

// Add Prisma mock setup
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaClient)
}));

// Add these lines to mock the generateResponse function
jest.mock('./src/lib/yandexgpt', () => ({
  generateResponse: jest.fn()
}));

// Reset all mocks before each test
beforeEach(() => {
  mockReset(prismaClient);
}); 