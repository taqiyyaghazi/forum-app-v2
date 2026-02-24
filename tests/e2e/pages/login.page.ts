import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly loginPage: Locator;

  readonly title: Locator;

  readonly subtitle: Locator;

  readonly emailInput: Locator;

  readonly passwordInput: Locator;

  readonly submitButton: Locator;

  readonly registerLink: Locator;

  readonly togglePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = page.getByTestId('login-page');
    this.title = page.getByTestId('login-title');
    this.subtitle = page.getByTestId('login-subtitle');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('submit-button');
    this.registerLink = page.getByTestId('register-link');
    this.togglePasswordButton = page
      .locator('[data-testid="password-input"]')
      .locator('..')
      .locator('button');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async togglePasswordVisibility() {
    await this.togglePasswordButton.click();
  }

  async mockLoginAPI(status: number, body: object) {
    await this.page.route('**/login', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
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

  getToast(text: string) {
    return this.page.getByText(text);
  }

  getValidationMessage(text: string | RegExp) {
    return this.page.getByText(text);
  }

  async expectRedirectTo(url: string) {
    await expect(this.page).toHaveURL(url);
  }
}
