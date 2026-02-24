import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Login Feature', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form correctly', async () => {
    await expect(loginPage.loginPage).toBeVisible();
    await expect(loginPage.title).toHaveText('Selamat Datang Kembali');
    await expect(loginPage.subtitle).toHaveText(
      'Masukkan kredensial Anda untuk mengakses akun',
    );
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.registerLink).toHaveAttribute('href', '/register');
  });

  test('should show validation errors on submitting empty form', async () => {
    await loginPage.submit();

    await expect(
      loginPage.getValidationMessage(/masukkan alamat email yang valid/i),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      loginPage.getValidationMessage(
        'Kata sandi harus memiliki minimal 6 karakter.',
      ),
    ).toBeVisible();
  });

  test('should be able to toggle password visibility', async () => {
    await loginPage.fillPassword('secret123');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle failed login attempt via mocked API', async () => {
    await loginPage.mockLoginAPI(401, {
      message: 'Kredensial tidak valid',
    });

    await loginPage.login('user@example.com', 'wrongpassword');

    await expect(loginPage.getToast('Gagal masuk')).toBeVisible();
  });

  test('should successfully login and redirect to home page', async () => {
    await loginPage.mockLoginAPI(200, {
      status: 'success',
      message: 'Login success',
      data: { token: 'mock-jwt-token-123' },
    });

    await loginPage.login('admin@example.com', 'password123');

    await expect(loginPage.getToast('Berhasil masuk')).toBeVisible();
    await loginPage.expectRedirectTo('/');
  });
});
