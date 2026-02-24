import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/register.page';

test.describe('Register Feature', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should display register form correctly', async () => {
    await expect(registerPage.registerPage).toBeVisible();
    await expect(registerPage.title).toHaveText('Buat akun baru');
    await expect(registerPage.subtitle).toHaveText(
      'Masukkan detail Anda di bawah ini untuk membuat akun',
    );
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.loginLink).toHaveAttribute('href', '/login');
  });

  test('should show validation errors on submitting empty form', async () => {
    await expect(registerPage.submitButton).toBeEnabled();
    await registerPage.submit();

    await expect(
      registerPage.getValidationMessage(
        'Nama harus memiliki minimal 2 karakter.',
      ),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      registerPage.getValidationMessage(/masukkan alamat email yang valid/i),
    ).toBeVisible();
    await expect(
      registerPage.getValidationMessage(
        'Kata sandi harus memiliki minimal 6 karakter.',
      ),
    ).toBeVisible();
  });

  test('should be able to toggle password visibility', async () => {
    await registerPage.fillPassword('secret123');
    await expect(registerPage.passwordInput).toHaveAttribute(
      'type',
      'password',
    );

    await registerPage.togglePasswordVisibility();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'text');

    await registerPage.togglePasswordVisibility();
    await expect(registerPage.passwordInput).toHaveAttribute(
      'type',
      'password',
    );
  });

  test('should navigate to login page via link', async () => {
    await registerPage.loginLink.click();
    await expect(registerPage.page).toHaveURL(/.*login/);
  });

  test('should handle failed register attempt via mocked API', async () => {
    await registerPage.mockRegisterAPI(400, {
      message: 'Email sudah digunakan',
    });

    await registerPage.register(
      'Test User',
      'existing@example.com',
      'password123',
    );

    await expect(registerPage.getToast('Gagal mendaftar')).toBeVisible();
  });

  test('should successfully register and redirect to login page', async () => {
    await registerPage.mockRegisterAPI(200, {
      status: 'success',
      message: 'User created',
      data: {
        user: {
          id: 'user-123',
          name: 'New User',
          email: 'newuser@example.com',
        },
      },
    });

    await registerPage.register(
      'New User',
      'newuser@example.com',
      'password123',
    );

    await expect(registerPage.getToast('Berhasil mendaftar!')).toBeVisible();
    await registerPage.expectRedirectTo('/login');
  });
});
