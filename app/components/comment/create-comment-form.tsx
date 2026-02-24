import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Textarea } from '~/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '~/stores/hooks';
import { createComment } from '~/stores/threadDetailSlice';
import { Link } from 'react-router';

const commentSchema = z.object({
  content: z.string().min(5, {
    message: 'Komentar minimal 5 karakter.',
  }),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CreateCommentFormProps {
  threadId: string;
}

export function CreateCommentForm({ threadId }: CreateCommentFormProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: CommentFormValues) {
    setIsLoading(true);
    try {
      await dispatch(
        createComment({ threadId, content: values.content }),
      ).unwrap();
      toast.success('Komentar berhasil ditambahkan!');
      form.reset();
    } catch {
      toast.error('Gagal menambahkan komentar');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div
        data-testid="login-prompt"
        className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm"
      >
        <p className="text-slate-600 mb-4 text-sm">
          Anda harus masuk terlebih dahulu untuk ikut berdiskusi.
        </p>
        <Button asChild variant="default">
          <Link to="/login">Masuk untuk Membalas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900 mb-4">
        Tambahkan Balasan Baru
      </h4>
      <Form {...form}>
        <form
          data-testid="comment-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    data-testid="comment-input"
                    placeholder="Tulis pendapat atau solusi Anda..."
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              data-testid="comment-submit-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Balasan'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
