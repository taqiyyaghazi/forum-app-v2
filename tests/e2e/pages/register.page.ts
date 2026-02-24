import { type Locator, type Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  readonly registerPage: Locator;

  readonly title: Locator;

  readonly subtitle: Locator;

  readonly nameInput: Locator;

  readonly emailInput: Locator;

  readonly passwordInput: Locator;

  readonly submitButton: Locator;

  readonly loginLink: Locator;

  readonly togglePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerPage = page.getByTestId('register-page');
    this.title = page.getByTestId('register-title');
    this.subtitle = page.getByTestId('register-subtitle');
    this.nameInput = page.getByTestId('name-input');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('submit-button');
    this.loginLink = page.getByTestId('login-link');
    this.togglePasswordButton = page
      .locator('[data-testid="password-input"]')
      .locator('..')
      .locator('button');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
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

  async register(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async togglePasswordVisibility() {
    await this.togglePasswordButton.click();
  }

  async mockRegisterAPI(status: number, body: object) {
    await this.page.route('**/register', async (route) => {
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
