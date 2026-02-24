import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';
import { Input } from './input';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The content of the label',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Basic Label
export const Default: Story = {
  args: {
    children: 'Email Address',
    htmlFor: 'email',
  },
};

// 2. Used with an Input Component
export const WithInput: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="email-2">Email Address</Label>
      <Input type="email" id="email-2" placeholder="Email" />
    </div>
  ),
};

// 3. Disabled Peer State
export const DisabledPeer: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Input
        disabled
        id="disabled"
        className="peer"
        placeholder="Disabled..."
      />
      <Label htmlFor="disabled">Disabled Label (Automatically Reacts)</Label>
    </div>
  ),
};
