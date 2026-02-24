import { test, expect } from '@playwright/test';
import { NewThreadPage } from './pages/new-thread.page';

test.describe('New Thread Feature', () => {
  let newThreadPage: NewThreadPage;

  test.beforeEach(async ({ page }) => {
    newThreadPage = new NewThreadPage(page);
  });

  test('should redirect to login page when not authenticated', async () => {
    await newThreadPage.goto();

    await newThreadPage.expectRedirectTo(/.*login/);
  });

  test('should display create thread form when authenticated', async ({
    page,
  }) => {
    await newThreadPage.mockAuthUserAPI();
    await page.goto('/');
    await newThreadPage.setAuthToken('mock-token');
    await newThreadPage.goto();

    await expect(newThreadPage.newThreadPage).toBeVisible();
    await expect(newThreadPage.title).toHaveText('Buat Diskusi Baru');
    await expect(newThreadPage.subtitle).toHaveText(
      'Masukkan detail topik yang ingin dibahas.',
    );
    await expect(newThreadPage.titleInput).toBeVisible();
    await expect(newThreadPage.categoryInput).toBeVisible();
    await expect(newThreadPage.bodyInput).toBeVisible();
    await expect(newThreadPage.submitButton).toBeVisible();
    await expect(newThreadPage.backButton).toBeVisible();
  });

  test('should show validation errors on submitting empty form', async ({
    page,
  }) => {
    await newThreadPage.mockAuthUserAPI();
    await page.goto('/');
    await newThreadPage.setAuthToken('mock-token');
    await newThreadPage.goto();

    await expect(newThreadPage.submitButton).toBeEnabled();
    await newThreadPage.submit();

    await expect(
      newThreadPage.getValidationMessage('Judul thread minimal 3 karakter.'),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      newThreadPage.getValidationMessage('Isi thread minimal 5 karakter.'),
    ).toBeVisible();
  });

  test('should navigate back to home when back button is clicked', async ({
    page,
  }) => {
    await newThreadPage.mockAuthUserAPI();
    await page.goto('/');
    await newThreadPage.setAuthToken('mock-token');
    await newThreadPage.goto();

    await newThreadPage.backButton.click();
    await newThreadPage.expectRedirectTo('/');
  });

  test('should handle failed thread creation via mocked API', async ({
    page,
  }) => {
    await newThreadPage.mockAuthUserAPI();
    await page.goto('/');
    await newThreadPage.setAuthToken('mock-token');
    await newThreadPage.goto();

    await newThreadPage.mockCreateThreadAPI(500, {
      message: 'Internal Server Error',
    });

    await newThreadPage.createThread(
      'Diskusi tentang React',
      'Ini adalah isi diskusi yang cukup panjang.',
      'react',
    );

    await expect(newThreadPage.getToast('Gagal membuat thread')).toBeVisible();
  });

  test('should successfully create thread and redirect to home', async ({
    page,
  }) => {
    await newThreadPage.mockAuthUserAPI();
    await page.goto('/');
    await newThreadPage.setAuthToken('mock-token');
    await newThreadPage.goto();

    await newThreadPage.mockCreateThreadAPI(200, {
      status: 'success',
      message: 'Thread created',
      data: {
        thread: {
          id: 'thread-new',
          title: 'Diskusi tentang React',
          body: 'Ini adalah isi diskusi yang cukup panjang.',
          category: 'react',
          createdAt: new Date().toISOString(),
          ownerId: 'user-test',
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        },
      },
    });

    await newThreadPage.createThread(
      'Diskusi tentang React',
      'Ini adalah isi diskusi yang cukup panjang.',
      'react',
    );

    await expect(
      newThreadPage.getToast('Thread berhasil dibuat!'),
    ).toBeVisible();
    await newThreadPage.expectRedirectTo('/');
  });
});
