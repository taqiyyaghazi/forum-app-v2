import { type Locator, type Page, expect } from '@playwright/test';

const MOCK_LEADERBOARDS = [
  {
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    },
    score: 150,
  },
  {
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
    },
    score: 120,
  },
  {
    user: {
      id: 'user-3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson',
    },
    score: 90,
  },
];

export { MOCK_LEADERBOARDS };

export class LeaderboardsPage {
  readonly page: Page;

  readonly leaderboardsPage: Locator;

  readonly title: Locator;

  readonly leaderboardCard: Locator;

  readonly leaderboardList: Locator;

  readonly emptyState: Locator;

  readonly errorState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leaderboardsPage = page.getByTestId('leaderboards-page');
    this.title = page.getByTestId('leaderboards-title');
    this.leaderboardCard = page.getByTestId('leaderboard-card');
    this.leaderboardList = page.getByTestId('leaderboard-list');
    this.emptyState = page.getByTestId('empty-state');
    this.errorState = page.getByTestId('error-state');
  }

  async goto() {
    await this.page.goto('/leaderboards');
  }

  getItem(index: number) {
    return this.page.getByTestId(`leaderboard-item-${index}`);
  }

  async mockLeaderboardsAPI(leaderboards: object[] = MOCK_LEADERBOARDS) {
    await this.page.route('**/v1/leaderboards', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        return;
      }
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          message: 'ok',
          data: { leaderboards },
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  async mockLeaderboardsAPIEmpty() {
    await this.mockLeaderboardsAPI([]);
  }

  async mockLeaderboardsAPIError() {
    await this.page.route('**/v1/leaderboards', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        return;
      }
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  async expectItemCount(count: number) {
    const items = this.leaderboardList.locator(
      '[data-testid^="leaderboard-item-"]',
    );
    await expect(items).toHaveCount(count);
  }
}
