import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with default baseline utility classes', () => {
    render(<Textarea data-testid="textarea-default" />);

    const textarea = screen.getByTestId('textarea-default');

    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');

    expect(textarea).toHaveClass(
      'flex',
      'min-h-16',
      'w-full',
      'rounded-md',
      'border',
      'bg-transparent',
      'px-3',
      'py-2',
      'text-base',
      'shadow-xs',
    );
  });

  it('handles standard textarea properties securely', () => {
    render(
      <Textarea
        rows={5}
        maxLength={500}
        placeholder="Drop a comment..."
        data-testid="textarea-props"
      />,
    );

    const textarea = screen.getByTestId('textarea-props');

    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('maxlength', '500');
    expect(textarea).toHaveAttribute('placeholder', 'Drop a comment...');
  });

  it('handles user events cleanly (e.g. onChange)', () => {
    const handleChange = vi.fn();
    render(<Textarea data-testid="textarea-event" onChange={handleChange} />);

    const textarea = screen.getByTestId('textarea-event');
    fireEvent.change(textarea, { target: { value: 'This is a sample text.' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('This is a sample text.');
  });

  it('respects the disabled state accurately', () => {
    render(<Textarea disabled data-testid="textarea-disabled" />);

    const textarea = screen.getByTestId('textarea-disabled');

    expect(textarea).toBeDisabled();
  });

  it('merges custom classNames effectively with tailwind-merge', () => {
    render(
      <Textarea
        className="custom-text-area resize-none"
        data-testid="textarea-custom"
      />,
    );

    const textarea = screen.getByTestId('textarea-custom');

    expect(textarea).toHaveClass('custom-text-area', 'resize-none');

    expect(textarea).toHaveClass('flex', 'w-full');
  });
});
