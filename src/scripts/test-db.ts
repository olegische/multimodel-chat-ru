import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    // Тест создания чата
    const chat = await prisma.chat.create({
      data: {
        provider: 'yandex',
        messages: {
          create: [{
            message: 'Test message',
            response: 'Test response',
            model: 'yandexgpt',
            provider: 'yandex',
            temperature: 0.7,
            maxTokens: 1000
          }]
        }
      },
      include: {
        messages: true
      }
    });

    console.log('✅ Created chat:', chat);

    // Тест поиска чата по провайдеру
    const chats = await prisma.chat.findMany({
      where: {
        provider: 'yandex'
      },
      include: {
        messages: true
      }
    });

    console.log('✅ Found chats:', chats);

    // Тест обновления сообщения
    const updatedMessage = await prisma.message.update({
      where: {
        id: chat.messages[0].id
      },
      data: {
        model: 'yandexgpt-pro'
      }
    });

    console.log('✅ Updated message:', updatedMessage);

    // Тест удаления
    // Сначала удаляем все сообщения чата
    await prisma.message.deleteMany({
      where: {
        chatId: chat.id
      }
    });

    // Затем удаляем сам чат
    await prisma.chat.delete({
      where: {
        id: chat.id
      }
    });

    console.log('✅ Database test completed successfully');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 