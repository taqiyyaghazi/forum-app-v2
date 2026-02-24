import { test, expect } from '@playwright/test';
import { LeaderboardsPage, MOCK_LEADERBOARDS } from './pages/leaderboards.page';

test.describe('Leaderboards Feature', () => {
  let leaderboardsPage: LeaderboardsPage;

  test.beforeEach(async ({ page }) => {
    leaderboardsPage = new LeaderboardsPage(page);
  });

  test('should display leaderboards page with all elements', async () => {
    await leaderboardsPage.mockLeaderboardsAPI();
    await leaderboardsPage.goto();

    await expect(leaderboardsPage.leaderboardsPage).toBeVisible();
    await expect(leaderboardsPage.title).toBeVisible();
    await expect(leaderboardsPage.title).toContainText(
      'Klasemen Pengguna Aktif',
    );
    await expect(leaderboardsPage.leaderboardCard).toBeVisible();
  });

  test('should display correct number of leaderboard entries', async () => {
    await leaderboardsPage.mockLeaderboardsAPI();
    await leaderboardsPage.goto();

    await expect(leaderboardsPage.leaderboardList).toBeVisible();
    await leaderboardsPage.expectItemCount(3);
  });

  test('should display user information in leaderboard items', async () => {
    await leaderboardsPage.mockLeaderboardsAPI();
    await leaderboardsPage.goto();

    // Verify first place
    const firstItem = leaderboardsPage.getItem(0);
    await expect(firstItem).toBeVisible();
    await expect(firstItem).toContainText(MOCK_LEADERBOARDS[0].user.name);
    await expect(firstItem).toContainText(MOCK_LEADERBOARDS[0].user.email);
    await expect(
      firstItem.getByText(String(MOCK_LEADERBOARDS[0].score)),
    ).toBeVisible();

    // Verify second place
    const secondItem = leaderboardsPage.getItem(1);
    await expect(secondItem).toContainText(MOCK_LEADERBOARDS[1].user.name);

    // Verify third place
    const thirdItem = leaderboardsPage.getItem(2);
    await expect(thirdItem).toContainText(MOCK_LEADERBOARDS[2].user.name);
  });

  test('should display rank numbers correctly', async () => {
    await leaderboardsPage.mockLeaderboardsAPI();
    await leaderboardsPage.goto();

    await expect(leaderboardsPage.getItem(0)).toContainText('1');
    await expect(leaderboardsPage.getItem(1)).toContainText('2');
    await expect(leaderboardsPage.getItem(2)).toContainText('3');
  });

  test('should display empty state when no leaderboard data', async () => {
    await leaderboardsPage.mockLeaderboardsAPIEmpty();
    await leaderboardsPage.goto();

    await expect(leaderboardsPage.emptyState).toBeVisible();
    await expect(
      leaderboardsPage.page.getByText('Belum ada data pada papan peringkat.'),
    ).toBeVisible();
  });

  test('should display table headers correctly', async () => {
    await leaderboardsPage.mockLeaderboardsAPI();
    await leaderboardsPage.goto();

    await expect(
      leaderboardsPage.leaderboardCard.getByText('Pengguna', { exact: true }),
    ).toBeVisible();
    await expect(
      leaderboardsPage.leaderboardCard.getByText('Skor'),
    ).toBeVisible();
  });
});
