import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import ChatWindow from '../ChatWindow';
import { Message } from '@prisma/client';

describe('ChatWindow', () => {
  const mockMessages: Message[] = [
    {
      id: 1,
      chatId: 'test-chat',
      message: 'Hello',
      response: 'Hi there!',
      model: 'test-model',
      provider: 'yandex',
      temperature: 0.7,
      maxTokens: 1000,
      timestamp: new Date()
    }
  ];

  it('should render empty state', () => {
    render(
      <ThemeProvider>
        <ChatWindow messages={[]} provider="yandex" />
      </ThemeProvider>
    );

    expect(screen.getByText('Начните диалог, отправив сообщение')).toBeInTheDocument();
  });

  it('should render messages', () => {
    render(
      <ThemeProvider>
        <ChatWindow messages={mockMessages} provider="yandex" />
      </ThemeProvider>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
    expect(screen.getByText('Модель: test-model')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <ThemeProvider>
        <ChatWindow messages={[]} provider="yandex" loading={true} />
      </ThemeProvider>
    );

    expect(screen.getByText('yandex печатает...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const error = 'Test error message';
    render(
      <ThemeProvider>
        <ChatWindow messages={[]} provider="yandex" error={error} />
      </ThemeProvider>
    );

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should show provider name for responses', () => {
    render(
      <ThemeProvider>
        <ChatWindow messages={mockMessages} provider="yandex" />
      </ThemeProvider>
    );

    expect(screen.getByText('yandex')).toBeInTheDocument();
    expect(screen.getByText('Вы')).toBeInTheDocument();
  });
}); 