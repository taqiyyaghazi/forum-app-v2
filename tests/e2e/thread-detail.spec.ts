import { test, expect } from '@playwright/test';
import {
  ThreadDetailPage,
  MOCK_THREAD_DETAIL,
} from './pages/thread-detail.page';

test.describe('Thread Detail Feature', () => {
  let detailPage: ThreadDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new ThreadDetailPage(page);
    await detailPage.mockThreadDetailAPI('thread-1');
  });

  test('should display thread detail with all elements', async () => {
    await detailPage.goto('thread-1');

    await expect(detailPage.threadDetailPage).toBeVisible({ timeout: 10000 });
    await expect(detailPage.backButton).toBeVisible();
    await expect(detailPage.threadDetailCard).toBeVisible();
    await expect(detailPage.threadTitle).toHaveText(MOCK_THREAD_DETAIL.title);
    await expect(detailPage.threadBody).toBeVisible();
    await expect(detailPage.commentsSection).toBeVisible();
  });

  test('should display thread owner information', async () => {
    await detailPage.goto('thread-1');

    await expect(detailPage.threadDetailCard).toBeVisible({ timeout: 10000 });
    await expect(
      detailPage.page.getByText(MOCK_THREAD_DETAIL.owner.name),
    ).toBeVisible();
    await expect(detailPage.page.getByText('Pembuat Diskusi')).toBeVisible();
  });

  test('should display comments when they exist', async () => {
    await detailPage.goto('thread-1');

    await expect(detailPage.threadDetailCard).toBeVisible({ timeout: 10000 });
    await expect(detailPage.commentsList).toBeVisible();
    await expect(
      detailPage.page.getByText(MOCK_THREAD_DETAIL.comments[0].owner.name),
    ).toBeVisible();
  });

  test('should display empty comments message when no comments', async ({
    page,
  }) => {
    const threadNoComments = { ...MOCK_THREAD_DETAIL, comments: [] };

    await page.unrouteAll();
    detailPage = new ThreadDetailPage(page);
    await detailPage.mockThreadDetailAPI('thread-1', threadNoComments);
    await detailPage.goto('thread-1');

    await expect(detailPage.threadDetailCard).toBeVisible({ timeout: 10000 });
    await expect(detailPage.emptyComments).toBeVisible();
    await expect(
      detailPage.page.getByText('Belum ada komentar.'),
    ).toBeVisible();
  });

  test('should show login prompt when user is not authenticated', async () => {
    await detailPage.goto('thread-1');

    await expect(detailPage.threadDetailCard).toBeVisible({ timeout: 10000 });
    await expect(detailPage.loginPrompt).toBeVisible();
    await expect(
      detailPage.page.getByText(
        'Anda harus masuk terlebih dahulu untuk ikut berdiskusi.',
      ),
    ).toBeVisible();
    await expect(
      detailPage.page.getByRole('link', { name: 'Masuk untuk Membalas' }),
    ).toBeVisible();
  });

  test('should show comment form when user is authenticated', async ({
    page,
  }) => {
    await detailPage.mockAuthUserAPI();

    await page.goto('/');
    await detailPage.setAuthToken('mock-token');
    await detailPage.goto('thread-1');

    await expect(detailPage.threadDetailCard).toBeVisible({ timeout: 10000 });
    await expect(detailPage.commentForm).toBeVisible();
    await expect(detailPage.commentInput).toBeVisible();
    await expect(detailPage.commentSubmitButton).toBeVisible();
  });

  test('should navigate back to home page when back button is clicked', async () => {
    await detailPage.goto('thread-1');

    await expect(detailPage.backButton).toBeVisible({ timeout: 10000 });
    await detailPage.backButton.click();
    await detailPage.expectRedirectTo('/');
  });
});
