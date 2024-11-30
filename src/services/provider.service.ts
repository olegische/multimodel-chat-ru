import { ProviderFactory, ProviderType } from '@/providers/factory';

interface ProviderStatus {
  available: boolean;
  lastCheck: number;
  error?: string;
}

export class ProviderService {
  private static statusCache: Map<ProviderType, ProviderStatus> = new Map();
  private static checkInterval = 60 * 1000; // 1 минута

  static async getAvailableProviders(): Promise<ProviderType[]> {
    const providers: ProviderType[] = ['yandex', 'gigachat'];
    const available: ProviderType[] = [];

    for (const provider of providers) {
      if (await this.isProviderAvailable(provider)) {
        available.push(provider);
      }
    }

    return available;
  }

  static async isProviderAvailable(type: ProviderType): Promise<boolean> {
    const now = Date.now();
    const status = this.statusCache.get(type);

    // Проверяем кэш
    if (status && now - status.lastCheck < this.checkInterval) {
      return status.available;
    }

    try {
      const provider = ProviderFactory.createProvider(type);
      await provider.listModels();

      this.statusCache.set(type, {
        available: true,
        lastCheck: now
      });

      return true;
    } catch (error) {
      this.statusCache.set(type, {
        available: false,
        lastCheck: now,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return false;
    }
  }

  static getProviderStatus(type: ProviderType): ProviderStatus | undefined {
    return this.statusCache.get(type);
  }

  static clearCache(type?: ProviderType) {
    if (type) {
      this.statusCache.delete(type);
    } else {
      this.statusCache.clear();
    }
  }
} 