import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { Badge } from './badge';

describe('Badge Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the Badge with default props', () => {
    render(<Badge data-testid="badge-default">Hello Badge</Badge>);

    const badge = screen.getByTestId('badge-default');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Hello Badge');

    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge).toHaveAttribute('data-variant', 'default');

    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full');
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  describe('Variants', () => {
    it('should render the secondary variant correctly', () => {
      render(
        <Badge variant="secondary" data-testid="badge-secondary">
          Secondary
        </Badge>,
      );

      const badge = screen.getByTestId('badge-secondary');
      expect(badge).toHaveAttribute('data-variant', 'secondary');
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('should render the destructive variant correctly', () => {
      render(
        <Badge variant="destructive" data-testid="badge-destructive">
          Destructive
        </Badge>,
      );

      const badge = screen.getByTestId('badge-destructive');
      expect(badge).toHaveAttribute('data-variant', 'destructive');
      expect(badge).toHaveClass('bg-destructive', 'text-white');
    });

    it('should render the outline variant correctly', () => {
      render(
        <Badge variant="outline" data-testid="badge-outline">
          Outline
        </Badge>,
      );

      const badge = screen.getByTestId('badge-outline');
      expect(badge).toHaveAttribute('data-variant', 'outline');
      expect(badge).toHaveClass('border-border', 'text-foreground');
    });

    it('should render the ghost variant correctly', () => {
      render(
        <Badge variant="ghost" data-testid="badge-ghost">
          Ghost
        </Badge>,
      );

      const badge = screen.getByTestId('badge-ghost');
      expect(badge).toHaveAttribute('data-variant', 'ghost');
    });

    it('should render the link variant correctly', () => {
      render(
        <Badge variant="link" data-testid="badge-link">
          Link
        </Badge>,
      );

      const badge = screen.getByTestId('badge-link');
      expect(badge).toHaveAttribute('data-variant', 'link');
      expect(badge).toHaveClass('text-primary');
    });
  });

  it('should forward additional class names properly', () => {
    render(
      <Badge className="custom-test-class" data-testid="badge-custom">
        Custom
      </Badge>,
    );

    const badge = screen.getByTestId('badge-custom');
    expect(badge).toHaveClass('custom-test-class');
    expect(badge).toHaveClass('rounded-full');
  });

  it('should render as a different element when using asChild', () => {
    render(
      <Badge asChild data-testid="slotted-badge">
        <a href="/link-reference">Badge Link Alternative</a>
      </Badge>,
    );

    const badgeLink = screen.getByTestId('slotted-badge');

    expect(badgeLink.tagName).toBe('A');
    expect(badgeLink).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
    );
    expect(badgeLink).toHaveAttribute('href', '/link-reference');
  });
});
