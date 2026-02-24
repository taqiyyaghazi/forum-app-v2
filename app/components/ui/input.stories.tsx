import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'file', 'number', 'search'],
      description: 'HTML Input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default Text Input
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Email',
  },
  render: (args) => <Input {...args} className="w-64" />,
};

// 2. Disabled Input State
export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Email address',
    disabled: true,
  },
  render: (args) => <Input {...args} className="w-64" />,
};

// 3. Input with Label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" className="w-64" />
    </div>
  ),
};

// 4. File Input
export const File: Story = {
  args: {
    type: 'file',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" {...args} className="w-64" />
    </div>
  ),
};

// 5. Input combined with Button
export const WithButton: Story = {
  render: () => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="email" placeholder="Email" className="w-64" />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
};

// 6. Input Form Example
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-2">Email</Label>
      <Input type="email" id="email-2" placeholder="Email" className="w-64" />
      <p className="text-sm text-muted-foreground">Enter your email address.</p>
    </div>
  ),
};
