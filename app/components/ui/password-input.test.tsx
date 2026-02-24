import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PasswordInput } from './password-input';

describe('PasswordInput Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with default state as password', () => {
    render(<PasswordInput data-testid="password-input" />);

    const input = screen.getByTestId('password-input');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();

    expect(screen.getByText('Tampilkan kata sandi')).toBeInTheDocument();
  });

  it('toggles password visibility when the button is clicked', () => {
    render(<PasswordInput data-testid="password-input" />);

    const input = screen.getByTestId('password-input');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByText('Tampilkan kata sandi')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByText('Sembunyikan kata sandi')).toBeInTheDocument();
    expect(screen.queryByText('Tampilkan kata sandi')).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByText('Tampilkan kata sandi')).toBeInTheDocument();
    expect(
      screen.queryByText('Sembunyikan kata sandi'),
    ).not.toBeInTheDocument();
  });

  it('forwards custom classNames to the input', () => {
    render(
      <PasswordInput
        className="custom-password-class"
        data-testid="password-input"
      />,
    );

    const input = screen.getByTestId('password-input');
    expect(input).toHaveClass('custom-password-class');
  });

  it('respects the disabled state for both input and toggle button', () => {
    render(<PasswordInput disabled data-testid="password-input" />);

    const input = screen.getByTestId('password-input');
    const toggleButton = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(toggleButton).toBeDisabled();
  });

  it('renders placeholders and values correctly', () => {
    render(
      <PasswordInput
        placeholder="Enter password"
        defaultValue="secret"
        data-testid="password-input"
      />,
    );

    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).toHaveValue('secret');
  });
});
