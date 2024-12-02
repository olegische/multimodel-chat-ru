import { BaseProvider } from './base.provider';
import { YandexGPTProvider } from './yandex/provider';
import { GigaChatProvider } from './gigachat/provider';

export type ProviderType = 'yandex' | 'gigachat';

export class ProviderFactory {
  static createProvider(type: ProviderType): BaseProvider {
    console.log(`Creating provider for type: ${type}`);
    
    switch (type) {
      case 'yandex':
        console.log('Creating YandexGPT provider with URL:', process.env.YANDEX_GPT_API_URL);
        return new YandexGPTProvider({
          apiUrl: process.env.YANDEX_GPT_API_URL!,
          credentials: process.env.YANDEX_API_KEY!,
          systemPrompt: 'yandex'
        });
      case 'gigachat':
        console.log('Creating GigaChat provider with URL:', process.env.GIGACHAT_API_URL);
        if (!process.env.GIGACHAT_API_URL || !process.env.GIGACHAT_CREDENTIALS) {
          console.error('Missing GigaChat environment variables:', {
            apiUrl: !!process.env.GIGACHAT_API_URL,
            credentials: !!process.env.GIGACHAT_CREDENTIALS
          });
          throw new Error('Missing GigaChat configuration');
        }
        return new GigaChatProvider({
          apiUrl: process.env.GIGACHAT_API_URL,
          credentials: process.env.GIGACHAT_CREDENTIALS,
          systemPrompt: 'gigachat'
        });
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }
} 