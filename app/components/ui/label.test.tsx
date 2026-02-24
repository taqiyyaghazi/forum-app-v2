import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Label } from './label';

describe('Label Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with default props', () => {
    render(<Label data-testid="label-default">Username Options</Label>);

    const label = screen.getByTestId('label-default');

    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveTextContent('Username Options');

    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'leading-none',
      'font-medium',
      'select-none',
    );
  });

  it('forwards custom classNames efficiently', () => {
    render(
      <Label
        className="label-custom uppercase text-red-500"
        data-testid="label-custom"
      >
        Error Label
      </Label>,
    );

    const label = screen.getByTestId('label-custom');

    expect(label).toHaveClass('text-sm', 'font-medium');

    expect(label).toHaveClass('label-custom', 'uppercase', 'text-red-500');
  });

  it('accepts and renders HTML attribute native mappings like htmlFor', () => {
    render(
      <div data-testid="container">
        <Label htmlFor="target-input-id" data-testid="label-for">
          Email Address
        </Label>
        <input id="target-input-id" type="email" />
      </div>,
    );

    const label = screen.getByTestId('label-for');
    expect(label).toHaveAttribute('for', 'target-input-id');
  });
});
