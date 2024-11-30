import { BaseProvider } from './base.provider';
import { YandexGPTProvider } from './yandex/provider';
import { GigaChatProvider } from './gigachat/provider';

export type ProviderType = 'yandex' | 'gigachat';

export class ProviderFactory {
  static createProvider(type: ProviderType): BaseProvider {
    switch (type) {
      case 'yandex':
        return new YandexGPTProvider({
          apiUrl: process.env.YANDEX_GPT_API_URL!,
          credentials: process.env.YANDEX_API_KEY!
        });
      case 'gigachat':
        return new GigaChatProvider({
          apiUrl: process.env.GIGACHAT_API_URL!,
          credentials: process.env.GIGACHAT_CREDENTIALS!
        });
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }
} 