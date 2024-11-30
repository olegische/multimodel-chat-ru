import axios from 'axios';
import { config } from 'dotenv';
import https from 'https';

config(); // Загрузка переменных окружения

// Create custom HTTPS agent that ignores SSL certificate verification
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function testGigaChatAccess() {
  try {
    // 1. Получаем токен доступа
    const authResponse = await axios.post(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      'scope=GIGACHAT_API_PERS',
      {
        httpsAgent, // Add the custom HTTPS agent here
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'RqUID': '4c1b9147-c4c5-4a1c-b75a-8bb47d6cdab6',
          'Authorization': `Basic ${process.env.GIGACHAT_CREDENTIALS}`
        }
      }
    );

    const accessToken = authResponse.data.access_token;
    console.log('✅ Токен доступа получен');

    // 2. Проверяем доступ к API
    const modelsResponse = await axios.get(
      'https://gigachat.devices.sberbank.ru/api/v1/models',
      {
        httpsAgent, // Add the custom HTTPS agent here as well
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    console.log('✅ Доступ к API работает');
    console.log('Доступные модели:', modelsResponse.data);

  } catch (error) {
    console.error('❌ Ошибка при тестировании доступа:', error);
    process.exit(1);
  }
}

testGigaChatAccess(); 