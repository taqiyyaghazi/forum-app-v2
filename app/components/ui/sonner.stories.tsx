import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button } from './button';
import { Toaster } from './sonner';

const meta = {
  title: 'UI/Sonner (Toast)',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-center justify-center">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default Toast
export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('Event has been created')}>
      Show Default Toast
    </Button>
  ),
};

// 2. Success Toast
export const Success: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.success('Action successful', {
          description: 'Your changes have been saved to the server.',
        })
      }
    >
      Show Success Toast
    </Button>
  ),
};

// 3. Error Toast
export const Error: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.error('Ah, snap!', {
          description: 'Failed to process your request. Please try again.',
        })
      }
    >
      Show Error Toast
    </Button>
  ),
};

// 4. Warning and Info Toasts
export const WarningAndInfo: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={() => toast.warning('Storage space running low.')}
      >
        Show Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('A new software update is available.')}
      >
        Show Info
      </Button>
    </div>
  ),
};

// 5. Toast with Action
export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('Draft saved', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            // eslint-disable-next-line no-console
            onClick: () => console.log('Undo clicked'),
          },
        })
      }
    >
      Show Toast with Action
    </Button>
  ),
};

// 6. Loading State
export const LoadingPromise: Story = {
  render: () => {
    const handlePromise = () => {
      const wait = () =>
        new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
      toast.promise(wait, {
        loading: 'Loading data...',
        success: 'Data loaded successfully!',
        error: 'Error loading data.',
      });
    };

    return (
      <Button variant="outline" onClick={handlePromise}>
        Simulate Promise Operation
      </Button>
    );
  },
};
