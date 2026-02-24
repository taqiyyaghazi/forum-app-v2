import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from './card';

import { Button } from './button';
import { Input } from './input';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the Card container',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Basic Card
export const Basic: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium leading-none">Name</span>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

// 2. Simple Text Card
export const Simple: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>System Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The system will be undergoing scheduled maintenance on Sunday, from
          2:00 AM to 4:00 AM UTC. Please save your work beforehand.
        </p>
      </CardContent>
    </Card>
  ),
};

// 3. Card With Action
export const WithAction: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Mark all read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-l-2 border-primary/20 pl-4 py-2">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">New connection</p>
              <p className="text-sm text-muted-foreground">
                Dian has accepted your friend request.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
