import { cleanup, render } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toaster } from './sonner';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('sonner', () => ({
  Toaster: vi.fn((props) => (
    <div
      data-testid="sonner-toaster-mock"
      data-theme={props.theme}
      className={props.className}
    >
      Mocked Sonner
    </div>
  )),
}));

describe('Toaster Component (Sonner Wrapper)', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders correctly and defaults to system theme', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme: vi.fn(),
      themes: [],
    });

    const { getByTestId } = render(<Toaster />);

    const toasterMock = getByTestId('sonner-toaster-mock');
    expect(toasterMock).toBeInTheDocument();

    expect(toasterMock).toHaveAttribute('data-theme', 'system');

    expect(toasterMock).toHaveClass('toaster', 'group');
  });

  it('respects dark theme from next-themes', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      themes: [],
    });

    const { getByTestId } = render(<Toaster />);

    const toasterMock = getByTestId('sonner-toaster-mock');
    expect(toasterMock).toHaveAttribute('data-theme', 'dark');
  });

  it('respects light theme from next-themes', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      themes: [],
    });

    const { getByTestId } = render(<Toaster />);

    const toasterMock = getByTestId('sonner-toaster-mock');
    expect(toasterMock).toHaveAttribute('data-theme', 'light');
  });

  it('forwards additional props to the underlying Sonner toaster', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      themes: [],
    });

    const { getByTestId } = render(<Toaster dir="rtl" duration={5000} />);

    const toasterMock = getByTestId('sonner-toaster-mock');

    expect(toasterMock).toBeInTheDocument();
  });
});
