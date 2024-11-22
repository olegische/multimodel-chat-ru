import { prisma } from '../lib/db'

async function main() {
  // Создаем тестовый чат
  const chat = await prisma.chat.create({
    data: {}
  })

  // Добавляем тестовое сообщение
  const message = await prisma.message.create({
    data: {
      chatId: chat.id,
      role: 'user',
      content: 'Тестовое сообщение',
      temperature: 0.7,
      maxTokens: 1000
    }
  })

  console.log('Тестовый чат создан:', chat)
  console.log('Тестовое сообщение создано:', message)

  // Проверяем связь
  const chatWithMessages = await prisma.chat.findUnique({
    where: { id: chat.id },
    include: { messages: true }
  })

  console.log('Чат с сообщениями:', chatWithMessages)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 