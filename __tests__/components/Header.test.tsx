import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';
import { ThemeProvider } from 'next-themes';

// Мокаем next-themes для тестирования
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Header Component', () => {
  const defaultProps = {
    selectedModel: 'YandexGPT Pro RC' as const,
    onModelChange: jest.fn(),
    disabled: false,
  };

  it('renders correctly', () => {
    render(
      <ThemeProvider>
        <Header {...defaultProps} />
      </ThemeProvider>
    );

    // Проверяем наличие основных элементов
    expect(screen.getByText('Multimodel Chat')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Theme toggle button
  });

  it('handles model change', () => {
    render(
      <ThemeProvider>
        <Header {...defaultProps} />
      </ThemeProvider>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'YandexGPT Lite RC' } });
    
    expect(defaultProps.onModelChange).toHaveBeenCalledWith('YandexGPT Lite RC');
  });

  it('disables model selector when disabled prop is true', () => {
    render(
      <ThemeProvider>
        <Header {...defaultProps} disabled={true} />
      </ThemeProvider>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
}); 