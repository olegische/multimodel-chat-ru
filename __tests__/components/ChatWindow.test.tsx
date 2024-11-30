import { render, screen } from '@testing-library/react';
import ChatWindow from '@/components/ChatWindow';

// Add this before your test cases
beforeEach(() => {
  // Mock scrollIntoView
  Element.prototype.scrollIntoView = jest.fn();
});

describe('ChatWindow Component', () => {
  const mockMessages = [
    {
      id: 1,
      message: 'Test message',
      response: 'Test response',
      timestamp: new Date(),
    },
    {
      id: 2,
      message: 'Another test',
      response: 'Another response',
      timestamp: new Date(),
    },
  ];

  it('renders messages correctly', () => {
    render(<ChatWindow messages={mockMessages} />);

    // Проверяем отображение сообщений пользователя
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Another test')).toBeInTheDocument();

    // Проверяем отображение ответов
    expect(screen.getByText('Test response')).toBeInTheDocument();
    expect(screen.getByText('Another response')).toBeInTheDocument();
  });

  it('shows loading indicator when loading prop is true', () => {
    render(<ChatWindow messages={[]} loading={true} />);
    
    // Проверяем наличие индикатора загрузки
    expect(screen.getByText('⌛')).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    render(<ChatWindow messages={[]} />);
    
    // Проверяем, что компонент рендерится без сообщений
    const messages = screen.queryByRole('listitem');
    expect(messages).not.toBeInTheDocument();
  });
}); 