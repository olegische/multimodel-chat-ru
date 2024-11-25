import { NextResponse } from 'next/server';
import prismaClient from '@/lib/db';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const chatId = headersList.get('x-chat-id');

    if (!chatId) {
      return NextResponse.json(
        { success: false, error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    const messages = await prismaClient.message.findMany({
      where: {
        chatId: chatId
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Error in messages endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 