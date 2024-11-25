import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Footer onSendMessage={mockOnSendMessage} />);

    // Проверяем наличие основных элементов
    expect(screen.getByPlaceholderText('Введите сообщение...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
    expect(screen.getByLabelText('Температура:')).toBeInTheDocument();
    expect(screen.getByLabelText('Токены:')).toBeInTheDocument();
  });

  it('handles message submission', async () => {
    render(<Footer onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Введите сообщение...');
    const submitButton = screen.getByRole('button', { name: 'Отправить' });

    // Вводим текст
    await userEvent.type(input, 'Test message');
    
    // Отправляем форму
    fireEvent.click(submitButton);

    // Проверяем, что функция была вызвана с правильными параметрами
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message', {
      temperature: 0.7,
      maxTokens: 1000
    });

    // Проверяем, что поле ввода очистилось
    expect(input).toHaveValue('');
  });

  it('handles generation settings changes', async () => {
    render(<Footer onSendMessage={mockOnSendMessage} />);

    const temperatureInput = screen.getByLabelText('Температура:');
    const tokensInput = screen.getByLabelText('Токены:');

    // Меняем значения
    await userEvent.clear(tokensInput);
    await userEvent.type(tokensInput, '500');
    fireEvent.change(temperatureInput, { target: { value: '0.5' } });

    // Отправляем сообщение
    const messageInput = screen.getByPlaceholderText('Введите сообщение...');
    await userEvent.type(messageInput, 'Test message');
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    // Проверяем, что функция была вызвана с обновленными настройками
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message', {
      temperature: 0.5,
      maxTokens: 500
    });
  });

  it('disables input and button when disabled prop is true', () => {
    render(<Footer onSendMessage={mockOnSendMessage} disabled={true} />);

    expect(screen.getByPlaceholderText('Введите сообщение...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
    expect(screen.getByLabelText('Температура:')).toBeDisabled();
    expect(screen.getByLabelText('Токены:')).toBeDisabled();
  });

  it('prevents submission with empty message', async () => {
    render(<Footer onSendMessage={mockOnSendMessage} />);

    const submitButton = screen.getByRole('button', { name: 'Отправить' });
    fireEvent.click(submitButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
}); 