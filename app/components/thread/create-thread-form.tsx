import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createThread } from '~/stores/threadsSlice';
import { useAppDispatch } from '~/stores/hooks';

const threadSchema = z.object({
  title: z.string().min(3, {
    message: 'Judul thread minimal 3 karakter.',
  }),
  category: z.string().optional(),
  body: z.string().min(5, {
    message: 'Isi thread minimal 5 karakter.',
  }),
});

type ThreadFormValues = z.infer<typeof threadSchema>;

export function CreateThreadForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ThreadFormValues>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      title: '',
      category: '',
      body: '',
    },
  });

  async function onSubmit(values: ThreadFormValues) {
    setIsLoading(true);
    try {
      await dispatch(createThread(values)).unwrap();
      toast.success('Thread berhasil dibuat!');
      navigate('/');
    } catch {
      toast.error('Gagal membuat thread');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apa yang ingin Anda diskusikan?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: react" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi Diskusi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tulis detail diskusi atau pertanyaan Anda di sini..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mempublikasikan...
            </>
          ) : (
            'Buat Thread'
          )}
        </Button>
      </form>
    </Form>
  );
}
