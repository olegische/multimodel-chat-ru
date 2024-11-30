import { GigaChatProvider } from '../gigachat/provider';
import { ProviderConfig, ProviderMessage } from '../base.provider';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GigaChatProvider', () => {
  let provider: GigaChatProvider;
  const mockConfig: ProviderConfig = {
    apiUrl: 'https://gigachat.api',
    credentials: 'gigachat-credentials'
  };

  beforeEach(() => {
    provider = new GigaChatProvider(mockConfig);
    jest.clearAllMocks();
  });

  describe('generateResponse', () => {
    const mockMessage = 'Test message';
    const mockAccessToken = 'test-access-token';
    const mockResponse = {
      data: {
        choices: [{
          message: {
            role: 'assistant',
            content: 'Test response'
          }
        }],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      }
    };

    beforeEach(() => {
      // Mock token request
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: mockAccessToken
        }
      });
      // Mock completion request
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
    });

    it('should generate response with correct configuration', async () => {
      const result = await provider.generateResponse(mockMessage);

      // Check token request
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        'scope=GIGACHAT_API_PERS',
        expect.any(Object)
      );

      // Check completion request
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${mockConfig.apiUrl}/chat/completions`,
        expect.objectContaining({
          model: 'GigaChat',
          messages: expect.any(Array),
          temperature: expect.any(Number),
          max_tokens: expect.any(Number)
        }),
        expect.any(Object)
      );

      expect(result).toEqual({
        text: 'Test response',
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30
        }
      });
    });

    it('should handle previous messages correctly', async () => {
      const previousMessages: ProviderMessage[] = [
        { role: 'user', content: 'Previous message' }
      ];

      await provider.generateResponse(mockMessage, undefined, previousMessages);

      const completionRequest = mockedAxios.post.mock.calls[1][1] as {
        messages: ProviderMessage[];
        model: string;
        temperature: number;
        max_tokens: number;
      };
      expect(completionRequest.messages).toEqual([
        ...previousMessages,
        { role: 'user', content: mockMessage }
      ]);
    });

    it('should reuse valid token', async () => {
      await provider.generateResponse(mockMessage);
      await provider.generateResponse(mockMessage);

      // Token request should be called only once
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(provider.generateResponse(mockMessage))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('listModels', () => {
    const mockModels = {
      data: {
        data: [
          { id: 'GigaChat' },
          { id: 'GigaChat-Pro' }
        ]
      }
    };

    beforeEach(() => {
      // Mock token request
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: 'test-token'
        }
      });
      // Mock models request
      mockedAxios.get.mockResolvedValueOnce(mockModels);
    });

    it('should return available models', async () => {
      const models = await provider.listModels();
      
      expect(models).toEqual(['GigaChat', 'GigaChat-Pro']);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockConfig.apiUrl}/models`,
        expect.any(Object)
      );
    });
  });
}); 