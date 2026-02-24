import { type Locator, type Page, expect } from '@playwright/test';

export class NewThreadPage {
  readonly page: Page;

  readonly newThreadPage: Locator;

  readonly title: Locator;

  readonly subtitle: Locator;

  readonly backButton: Locator;

  readonly titleInput: Locator;

  readonly categoryInput: Locator;

  readonly bodyInput: Locator;

  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newThreadPage = page.getByTestId('new-thread-page');
    this.title = page.getByTestId('new-thread-title');
    this.subtitle = page.getByTestId('new-thread-subtitle');
    this.backButton = page.getByTestId('back-button');
    this.titleInput = page.getByTestId('title-input');
    this.categoryInput = page.getByTestId('category-input');
    this.bodyInput = page.getByTestId('body-input');
    this.submitButton = page.getByTestId('submit-button');
  }

  async goto() {
    await this.page.goto('/new');
  }

  async fillTitle(value: string) {
    await this.titleInput.fill(value);
  }

  async fillCategory(value: string) {
    await this.categoryInput.fill(value);
  }

  async fillBody(value: string) {
    await this.bodyInput.fill(value);
  }

  async submit() {
    await this.submitButton.click();
  }

  async createThread(titleVal: string, body: string, category?: string) {
    await this.fillTitle(titleVal);
    if (category) {
      await this.fillCategory(category);
    }
    await this.fillBody(body);
    await this.submit();
  }

  async setAuthToken(token: string) {
    await this.page.evaluate((t) => {
      localStorage.setItem('accessToken', t);
    }, token);
  }

  async mockCreateThreadAPI(status: number, body: object) {
    await this.page.route('**/threads', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        return;
      }
      if (route.request().method() !== 'POST') {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  async mockAuthUserAPI() {
    await this.page.route('**/users/me', async (route) => {
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
          data: {
            user: {
              id: 'user-test',
              name: 'Test User',
              email: 'test@example.com',
              avatar: 'https://example.com/avatar.png',
            },
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  getToast(text: string) {
    return this.page.getByText(text);
  }

  getValidationMessage(text: string | RegExp) {
    return this.page.getByText(text);
  }

  async expectRedirectTo(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}
