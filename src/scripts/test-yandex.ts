import { config } from 'dotenv';
import { YandexGPTProvider } from '../providers/yandex/provider';

config(); // Load environment variables

async function testYandexAccess() {
  try {
    console.log('Starting Yandex API test...');
    console.log('Environment variables:');
    console.log('API URL:', process.env.YANDEX_GPT_API_URL);
    console.log('Folder ID:', process.env.YANDEX_FOLDER_ID);
    console.log('API Key exists:', !!process.env.YANDEX_API_KEY);

    const provider = new YandexGPTProvider({
      apiUrl: process.env.YANDEX_GPT_API_URL!,
      credentials: process.env.YANDEX_API_KEY!
    });

    // Test 1: List models
    console.log('\nTesting listModels...');
    const models = await provider.listModels();
    console.log('Available models:', models);

    // Test 2: Generate response
    console.log('\nTesting generateResponse...');
    const testMessage = 'Привет! Как дела?';
    console.log('Test message:', testMessage);

    const response = await provider.generateResponse(testMessage, {
      temperature: 0.7,
      maxTokens: 1000,
      model: 'YandexGPT Pro Latest'
    });

    console.log('Response:', response);
    console.log('✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
    // If it's a fetch error, try to get more details
    if (error instanceof Error && error.message.includes('YandexGPT API error: 400')) {
      console.log('\nDetailed request information:');
      const requestBody = {
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt/latest`,
        messages: [{ role: 'user', content: 'Привет! Как дела?' }],
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 1000
        }
      };
      console.log('Request body that would be sent:', JSON.stringify(requestBody, null, 2));
    }
    
    process.exit(1);
  }
}

testYandexAccess(); 