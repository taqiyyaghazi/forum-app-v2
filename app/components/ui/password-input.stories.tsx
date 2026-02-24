import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';
import { PasswordInput } from './password-input';

const meta = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Basic Password Input
export const Default: Story = {
  args: {
    placeholder: 'Enter your password...',
  },
  render: (args) => <PasswordInput {...args} className="w-80" />,
};

// 2. Used Inside a Form-like Structure
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 items-center gap-1.5 flex-col">
      <Label htmlFor="password">Password</Label>
      <PasswordInput id="password" placeholder="Min. 8 characters" />
    </div>
  ),
};

// 3. Disabled State
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
  render: (args) => (
    <div className="grid w-80 items-center gap-1.5 flex-col">
      <Label htmlFor="disabled-password" className="opacity-50">
        Password
      </Label>
      <PasswordInput id="disabled-password" {...args} />
    </div>
  ),
};
