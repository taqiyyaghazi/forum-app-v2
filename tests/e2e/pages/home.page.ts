import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly homePage: Locator;

  readonly title: Locator;

  readonly searchInput: Locator;

  readonly categoryList: Locator;

  readonly threadList: Locator;

  readonly emptyState: Locator;

  readonly noResults: Locator;

  readonly createThreadFAB: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homePage = page.getByTestId('home-page');
    this.title = page.getByTestId('home-title');
    this.searchInput = page.getByTestId('search-input');
    this.categoryList = page.getByTestId('category-list');
    this.threadList = page.getByTestId('thread-list');
    this.emptyState = page.getByTestId('empty-state');
    this.noResults = page.getByTestId('no-results');
    this.createThreadFAB = page.getByRole('link', { name: 'Buat Diskusi' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clickCategory(category: string) {
    await this.page.getByTestId(`category-${category}`).click();
  }

  getCategory(category: string) {
    return this.page.getByTestId(`category-${category}`);
  }

  async mockThreadsAPI(threads: object[]) {
    await this.page.route('**/threads', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          message: 'ok',
          data: { threads },
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  async mockThreadsAPIEmpty() {
    await this.mockThreadsAPI([]);
  }

  async expectThreadCount(count: number) {
    const cards = this.threadList.locator('[data-slot="card"]');
    await expect(cards).toHaveCount(count);
  }

  async expectRedirectTo(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}
