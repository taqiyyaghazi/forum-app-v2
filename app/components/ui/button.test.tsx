import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the Button with default props', () => {
    render(<Button data-testid="button-default">Click Me</Button>);

    const button = screen.getByTestId('button-default');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');

    expect(button.tagName).toBe('BUTTON');

    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');

    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
    );
    expect(button).toHaveClass(
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90',
    );
    expect(button).toHaveClass('h-9', 'px-4', 'py-2');
  });

  describe('Variants', () => {
    it('should properly render the destructive variant', () => {
      render(
        <Button variant="destructive" data-testid="button-destructive">
          Delete
        </Button>,
      );

      const button = screen.getByTestId('button-destructive');
      expect(button).toHaveAttribute('data-variant', 'destructive');
      expect(button).toHaveClass(
        'bg-destructive',
        'text-white',
        'hover:bg-destructive/90',
      );
    });

    it('should properly render the outline variant', () => {
      render(
        <Button variant="outline" data-testid="button-outline">
          Cancel
        </Button>,
      );

      const button = screen.getByTestId('button-outline');
      expect(button).toHaveAttribute('data-variant', 'outline');
      expect(button).toHaveClass('border', 'bg-background', 'shadow-xs');
    });

    it('should properly render the secondary variant', () => {
      render(
        <Button variant="secondary" data-testid="button-secondary">
          Secondary Action
        </Button>,
      );

      const button = screen.getByTestId('button-secondary');
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('should properly render the ghost variant', () => {
      render(
        <Button variant="ghost" data-testid="button-ghost">
          Ghost Action
        </Button>,
      );

      const button = screen.getByTestId('button-ghost');
      expect(button).toHaveAttribute('data-variant', 'ghost');
      expect(button).toHaveClass(
        'hover:bg-accent',
        'hover:text-accent-foreground',
      );
    });

    it('should properly render the link variant', () => {
      render(
        <Button variant="link" data-testid="button-link">
          Link Action
        </Button>,
      );

      const button = screen.getByTestId('button-link');
      expect(button).toHaveAttribute('data-variant', 'link');
      expect(button).toHaveClass(
        'text-primary',
        'underline-offset-4',
        'hover:underline',
      );
    });
  });

  describe('Sizes', () => {
    it('should apply size="sm" classes', () => {
      render(
        <Button size="sm" data-testid="button-sm">
          Small
        </Button>,
      );

      const button = screen.getByTestId('button-sm');
      expect(button).toHaveAttribute('data-size', 'sm');
      expect(button).toHaveClass('h-8', 'rounded-md', 'px-3');
    });

    it('should apply size="lg" classes', () => {
      render(
        <Button size="lg" data-testid="button-lg">
          Large
        </Button>,
      );

      const button = screen.getByTestId('button-lg');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button).toHaveClass('h-10', 'rounded-md', 'px-6');
    });

    it('should apply icon matching size utilities', () => {
      render(
        <Button size="icon" data-testid="button-icon">
          Icon
        </Button>,
      );

      const button = screen.getByTestId('button-icon');
      expect(button).toHaveAttribute('data-size', 'icon');
      expect(button).toHaveClass('size-9');
    });
  });

  it('should forward additional generic class names while preserving base styles', () => {
    render(
      <Button
        className="custom-test-btn tracking-wide"
        data-testid="button-custom"
      >
        Custom
      </Button>,
    );

    const button = screen.getByTestId('button-custom');

    expect(button).toHaveClass('custom-test-btn', 'tracking-wide');

    expect(button).toHaveClass('inline-flex', 'justify-center', 'rounded-md');
  });

  it('should allow polymorphic rendering with asChild', () => {
    render(
      <Button asChild data-testid="button-slotted">
        <a href="/login">Login</a>
      </Button>,
    );

    const buttonLink = screen.getByTestId('button-slotted');

    expect(buttonLink.tagName).toBe('A');

    expect(buttonLink).toHaveAttribute('href', '/login');

    expect(buttonLink).toHaveAttribute('data-slot', 'button');
    expect(buttonLink).toHaveAttribute('data-variant', 'default');

    expect(buttonLink).toHaveClass('inline-flex', 'bg-primary');
  });
});
