import prismaClient from '../lib/db';

async function main() {
  try {
    // Создаем тестовый чат
    const chat = await prismaClient.chat.create({
      data: {}
    })
    console.log('✅ Тестовый чат создан:', chat)

    // Добавляем тестовое сообщение
    const message = await prismaClient.message.create({
      data: {
        chatId: chat.id,
        message: 'Тестовое сообщение',
        response: 'Тестовый ответ от GPT',
        temperature: 0.7,
        maxTokens: 1000,
        timestamp: new Date()
      }
    })
    console.log('✅ Тестовое сообщение создано:', message)

    // Проверяем связь
    const chatWithMessages = await prismaClient.chat.findUnique({
      where: { id: chat.id },
      include: { messages: true }
    })
    console.log('✅ Чат с сообщениями:', chatWithMessages)

  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prismaClient.$disconnect()
  }
}

main() 