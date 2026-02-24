import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

beforeAll(() => {
  global.ResizeObserver = function MockResizeObserver() {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  } as unknown as typeof ResizeObserver;

  const MockPointerEvent = function PointerEventMock(
    this: Record<string, unknown>,
    type: string,
    props: Record<string, unknown>,
  ) {
    const event = new Event(type, props);
    Object.assign(event, {
      button: (props?.button as number) || 0,
      ctrlKey: (props?.ctrlKey as boolean) || false,
      pointerType: (props?.pointerType as string) || 'mouse',
    });
    return event;
  } as unknown as typeof PointerEvent;
  MockPointerEvent.prototype = Event.prototype as unknown as PointerEvent;

  global.PointerEvent = MockPointerEvent;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
});

describe('DropdownMenu Components', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Basic Elements', () => {
    it('should render trigger and open content when requested', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger data-testid="trigger">
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent data-testid="content">
            <DropdownMenuItem data-testid="item-1">Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger');

      const content = await screen.findByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'dropdown-menu-content');
      expect(content).toHaveClass('bg-popover', 'text-popover-foreground');

      const item = screen.getByTestId('item-1');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-slot', 'dropdown-menu-item');
    });

    it('should apply variant styles to DropdownMenuItem', async () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuItem
              data-testid="item-destructive"
              variant="destructive"
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="item-inset" inset>
              Inset Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const destructiveItem = await screen.findByTestId('item-destructive');
      expect(destructiveItem).toHaveAttribute('data-variant', 'destructive');

      const insetItem = await screen.findByTestId('item-inset');
      expect(insetItem).toHaveAttribute('data-inset', 'true');
    });

    it('should handle DropdownMenuLabel, Separator, and Shortcut', async () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="label" inset>
              My Label
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-testid="separator" />
            <DropdownMenuItem>
              Profile{' '}
              <DropdownMenuShortcut data-testid="shortcut">
                ⇧⌘P
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const label = await screen.findByTestId('label');
      expect(label).toHaveAttribute('data-slot', 'dropdown-menu-label');
      expect(label).toHaveAttribute('data-inset', 'true');

      const separator = await screen.findByTestId('separator');
      expect(separator).toHaveAttribute('data-slot', 'dropdown-menu-separator');

      const shortcut = await screen.findByTestId('shortcut');
      expect(shortcut).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
      expect(shortcut).toHaveTextContent('⇧⌘P');
    });
  });

  describe('Checkboxes and Radio Items', () => {
    it('should render DropdownMenuCheckboxItem properly', async () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              data-testid="checkbox-unchecked"
              checked={false}
            >
              Unchecked Option
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem data-testid="checkbox-checked" checked>
              Checked Option
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const unchecked = await screen.findByTestId('checkbox-unchecked');
      expect(unchecked).toHaveAttribute('data-state', 'unchecked');

      const checked = await screen.findByTestId('checkbox-checked');
      expect(checked).toHaveAttribute('data-state', 'checked');
      expect(
        checked.querySelector('[data-state="checked"]'),
      ).toBeInTheDocument();
    });

    it('should render DropdownMenuRadioGroup properly', async () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="first" data-testid="radio-group">
              <DropdownMenuRadioItem value="first" data-testid="radio-1">
                First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="second" data-testid="radio-2">
                Second
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const radioGroup = await screen.findByTestId('radio-group');
      expect(radioGroup).toHaveAttribute(
        'data-slot',
        'dropdown-menu-radio-group',
      );

      const radio1 = screen.getByTestId('radio-1');
      expect(radio1).toHaveAttribute('data-state', 'checked');

      const radio2 = screen.getByTestId('radio-2');
      expect(radio2).toHaveAttribute('data-state', 'unchecked');
    });
  });

  describe('Sub Menu Elements', () => {
    it('should render DropdownMenuSubTrigger and SubContent interactions', async () => {
      render(
        <DropdownMenu open>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger data-testid="sub-trigger" inset>
                More Themes
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent data-testid="sub-content">
                <DropdownMenuItem>Light</DropdownMenuItem>
                <DropdownMenuItem>Dark</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const subTrigger = await screen.findByTestId('sub-trigger');
      expect(subTrigger).toHaveAttribute(
        'data-slot',
        'dropdown-menu-sub-trigger',
      );
      expect(subTrigger).toHaveAttribute('data-inset', 'true');

      const subContent = await screen.findByTestId('sub-content');
      expect(subContent).toHaveAttribute(
        'data-slot',
        'dropdown-menu-sub-content',
      );
      expect(subContent).toHaveClass('bg-popover', 'min-w-32');
    });
  });
});
