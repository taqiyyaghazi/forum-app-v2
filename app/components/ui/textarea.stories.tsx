import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { Label } from './label';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default Textarea
export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
  render: (args) => <Textarea {...args} className="w-80" />,
};

// 2. Disabled Textarea
export const Disabled: Story = {
  args: {
    placeholder: 'Type your message here.',
    disabled: true,
  },
  render: (args) => <Textarea {...args} className="w-80" />,
};

// 3. Textarea with Label and Description
export const WithText: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5 focus-within:ring-0">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
      <p className="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
};

// 4. Textarea Form Example (Combined with Button)
export const WithButton: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  ),
};
