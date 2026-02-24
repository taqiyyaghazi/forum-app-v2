import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled or not',
    },
    children: {
      control: 'text',
      description: 'The content of the button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Core Variants
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const LinkButton: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// 2. Size Variations
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-xs" variant="outline" aria-label="Mail">
        <Mail />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Mail">
        <Mail />
      </Button>
      <Button size="icon" variant="outline" aria-label="Mail">
        <Mail />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Mail">
        <Mail />
      </Button>
    </div>
  ),
};

// 3. Buttons with Icons
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button>
        <Mail /> Login with Email
      </Button>
      <Button variant="outline">
        Next Step <ArrowRight />
      </Button>
    </div>
  ),
};

// 4. Loading State
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" />
      Please wait
    </Button>
  ),
};

// 5. Disabled State
export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
    children: 'Disabled Button',
  },
};
