import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with default props', () => {
    render(<Input data-testid="input-default" />);

    const input = screen.getByTestId('input-default');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('data-slot', 'input');

    expect(input).toHaveClass(
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'bg-transparent',
      'px-3',
      'py-1',
      'text-base',
      'shadow-xs',
    );
  });

  it('applies standard input types correctly', () => {
    render(<Input type="email" data-testid="input-email" />);

    const input = screen.getByTestId('input-email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('forwards custom classNames', () => {
    render(
      <Input
        className="custom-input-class font-bold"
        data-testid="input-custom"
      />,
    );

    const input = screen.getByTestId('input-custom');
    expect(input).toHaveClass('custom-input-class', 'font-bold');
    expect(input).toHaveClass('h-9', 'w-full');
  });

  it('handles onChange events', () => {
    const handleChange = vi.fn();
    render(<Input data-testid="input-interactive" onChange={handleChange} />);

    const input = screen.getByTestId('input-interactive');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('respects the disabled state', () => {
    render(<Input disabled data-testid="input-disabled" />);

    const input = screen.getByTestId('input-disabled');
    expect(input).toBeDisabled();
  });

  it('renders placeholders', () => {
    render(
      <Input
        placeholder="Enter your text here"
        data-testid="input-placeholder"
      />,
    );

    const input = screen.getByTestId('input-placeholder');
    expect(input).toHaveAttribute('placeholder', 'Enter your text here');
  });
});
