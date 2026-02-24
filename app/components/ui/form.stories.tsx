import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from './button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';

const meta: Meta = {
  title: 'UI/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

// Wrapper component to simulate actual form usage with React Hook Form
function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // eslint-disable-next-line no-console
    console.log(values);
  }

  return (
    <div className="w-[400px] border p-6 rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

// 1. Default Form Usage
export const Default: Story = {
  render: () => <ProfileForm />,
};

// 2. Form Error State Example
const errorFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

function ErrorForm() {
  const form = useForm<z.infer<typeof errorFormSchema>>({
    resolver: zodResolver(errorFormSchema),
    defaultValues: {
      email: 'not-an-email-address',
    },
    mode: 'onTouched',
  });

  // Force trigger error on mount for story demonstration
  form.trigger('email');

  return (
    <div className="w-[400px] border p-6 rounded-lg shadow-sm border-destructive/20">
      <Form {...form}>
        <form
          // eslint-disable-next-line no-console
          onSubmit={form.handleSubmit((v) => console.log(v))}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  We will never share your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </Form>
    </div>
  );
}

export const ValidationErrorState: Story = {
  render: () => <ErrorForm />,
};
