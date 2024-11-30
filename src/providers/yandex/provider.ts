import { z } from 'zod';
import { BaseProvider, ProviderConfig, ProviderMessage, GenerationOptions, GenerationResult } from '../base.provider';

const responseSchema = z.object({
  result: z.object({
    alternatives: z.array(
      z.object({
        message: z.object({
          role: z.string(),
          text: z.string()
        })
      })
    ),
    usage: z.object({
      inputTextTokens: z.string(),
      completionTokens: z.string(),
      totalTokens: z.string()
    }).optional()
  })
});

type YandexGPTResponse = z.infer<typeof responseSchema>;

export class YandexGPTProvider extends BaseProvider {
  constructor(config: ProviderConfig) {
    super(config, responseSchema);
  }

  async generateResponse(
    message: string,
    options?: GenerationOptions,
    previousMessages?: ProviderMessage[]
  ): Promise<GenerationResult> {
    const validatedOptions = this.validateOptions(options);

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${this.config.credentials}`,
          'x-folder-id': process.env.YANDEX_FOLDER_ID!
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt/latest`,
          completionOptions: {
            stream: false,
            temperature: validatedOptions.temperature,
            maxTokens: validatedOptions.maxTokens
          },
          messages: this.formatMessages(message, previousMessages)
        })
      });

      if (!response.ok) {
        throw new Error(`YandexGPT API error: ${response.status}`);
      }

      const data = await response.json();
      const validated = this.validateResponse(data) as YandexGPTResponse;

      return {
        text: validated.result.alternatives[0].message.text,
        usage: validated.result.usage ? {
          promptTokens: parseInt(validated.result.usage.inputTextTokens),
          completionTokens: parseInt(validated.result.usage.completionTokens),
          totalTokens: parseInt(validated.result.usage.totalTokens)
        } : undefined
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async listModels(): Promise<string[]> {
    return [
      'YandexGPT Lite Latest',
      'YandexGPT Lite RC',
      'YandexGPT Pro Latest',
      'YandexGPT Pro RC',
      'YandexGPT Pro 32k RC'
    ];
  }

  private formatMessages(message: string, previousMessages?: ProviderMessage[]): ProviderMessage[] {
    const messages = previousMessages ? [...previousMessages] : [];
    messages.push({ role: 'user', content: message });
    return messages;
  }
} 