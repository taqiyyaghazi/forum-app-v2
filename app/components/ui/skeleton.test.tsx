import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with default baseline utility classes', () => {
    render(<Skeleton data-testid="skeleton-default" />);

    const skeleton = screen.getByTestId('skeleton-default');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe('DIV');

    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');

    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md');
  });

  it('merges custom classNames alongside default ones', () => {
    render(
      <Skeleton
        className="h-12 w-12 rounded-full mt-4"
        data-testid="skeleton-custom"
      />,
    );

    const skeleton = screen.getByTestId('skeleton-custom');

    expect(skeleton).toHaveClass('h-12', 'w-12', 'rounded-full', 'mt-4');

    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse');
  });

  it('forwards standard HTML attributes securely', () => {
    render(
      <Skeleton
        aria-hidden="true"
        id="mock-loading-node"
        data-testid="skeleton-attribute"
      />,
    );

    const skeleton = screen.getByTestId('skeleton-attribute');

    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveAttribute('id', 'mock-loading-node');
  });
});
