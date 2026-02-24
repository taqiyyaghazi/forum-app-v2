import { zodResolver } from '@hookform/resolvers/zod';
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './form';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

function TestForm({
  onSubmitMock,
}: {
  onSubmitMock?: (values: z.infer<typeof formSchema>) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (onSubmitMock) {
      onSubmitMock(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="test-form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                  placeholder="shadcn"
                  {...field}
                  data-testid="username-input"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage data-testid="username-error" />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </form>
    </Form>
  );
}

describe('Form Components', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all form components correctly', () => {
    render(<TestForm />);

    expect(screen.getByTestId('test-form')).toBeInTheDocument();

    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');

    const input = screen.getByTestId('username-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby');

    const description = screen.getByText('This is your public display name.');
    expect(description).toBeInTheDocument();
    expect(description).toHaveAttribute('data-slot', 'form-description');
  });

  it('displays validation message on invalid submit', async () => {
    render(<TestForm />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByTestId('username-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(
      'Username must be at least 2 characters.',
    );

    const input = screen.getByTestId('username-input');
    await waitFor(() => {
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });

  it('updates input value and clears error', async () => {
    render(<TestForm />);

    const input = screen.getByTestId('username-input');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);
    expect(await screen.findByTestId('username-error')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'foobar' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Username must be at least 2 characters.'),
      ).not.toBeInTheDocument();
      expect(input.getAttribute('aria-invalid')).toBe('false');
    });
  });
});
