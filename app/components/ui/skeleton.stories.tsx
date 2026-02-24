import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to define dimensions and shape',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Basic Example (e.g. standard block)
export const Default: Story = {
  render: () => <Skeleton className="h-10 w-64" />,
};

// 2. Avatar Shape
export const Avatar: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
};

// 3. Text Lines
export const TextLines: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  ),
};

// 4. Combined Layout (e.g. loading a user profile card)
export const CardLoadingState: Story = {
  render: () => (
    <div className="flex items-center space-x-4 w-[350px] p-4 border rounded-xl shadow-sm">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  ),
};
