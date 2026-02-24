import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail } from 'lucide-react';

import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
      ],
      description: 'The visual style of the badge',
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default Variant
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Badge',
  },
};

// 2. Secondary Variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

// 3. Destructive Variant
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

// 4. Outline Variant
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// 5. Ghost Variant
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

// 6. Link Variant
export const LinkBadge: Story = {
  args: {
    variant: 'link',
    children: 'Link Badge',
  },
};

// 7. Badge With Icon Example
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="default">
        <Mail className="size-3" />
        <span>Unread Messages</span>
      </Badge>
      <Badge variant="secondary">
        <span>Updates</span>
        <Mail className="size-3" />
      </Badge>
    </div>
  ),
};
