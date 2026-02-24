import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar';

describe('Avatar Component', () => {
  it('should render Avatar with Fallback when image src is invalid or not provided', () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="Test User" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>,
    );

    const fallbackText = screen.getByText('TU');
    expect(fallbackText).toBeInTheDocument();
    expect(fallbackText).toHaveClass('bg-muted');
  });

  it('should apply size classes correctly to Avatar', () => {
    const { container, rerender } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>,
    );

    let avatarRoot = container.querySelector('[data-slot="avatar"]');
    expect(avatarRoot).toHaveAttribute('data-size', 'sm');

    rerender(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>,
    );

    avatarRoot = container.querySelector('[data-slot="avatar"]');
    expect(avatarRoot).toHaveAttribute('data-size', 'lg');
  });

  it('should render AvatarBadge correctly', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge data-testid="badge" />
      </Avatar>,
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');

    expect(badge).toHaveAttribute('data-slot', 'avatar-badge');
  });

  it('should render AvatarGroup correctly with proper spacing classes', () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar>
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    const group = screen.getByTestId('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveClass('flex', '-space-x-2');
  });

  it('should render AvatarGroupCount correctly', () => {
    render(<AvatarGroupCount data-testid="group-count">+3</AvatarGroupCount>);

    const groupCount = screen.getByTestId('group-count');
    expect(groupCount).toBeInTheDocument();
    expect(groupCount).toHaveTextContent('+3');
    expect(groupCount).toHaveClass('bg-muted', 'text-sm');
  });
});
