import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

const MOCK_THREADS = [
  {
    id: 'thread-1',
    title: 'Bagaimana cara menggunakan React Hooks?',
    body: '<p>Saya ingin belajar React Hooks, bagaimana cara memulainya?</p>',
    category: 'react',
    createdAt: '2024-01-15T10:00:00.000Z',
    ownerId: 'user-1',
    totalComments: 5,
    upVotesBy: ['user-2'],
    downVotesBy: [],
  },
  {
    id: 'thread-2',
    title: 'Tips belajar TypeScript untuk pemula',
    body: '<p>TypeScript adalah superset dari JavaScript yang menambahkan tipe statis.</p>',
    category: 'typescript',
    createdAt: '2024-01-14T08:00:00.000Z',
    ownerId: 'user-2',
    totalComments: 3,
    upVotesBy: [],
    downVotesBy: ['user-1'],
  },
  {
    id: 'thread-3',
    title: 'Best practice CSS modern',
    body: '<p>Dengan Tailwind CSS, kita bisa membuat desain yang konsisten dan cepat.</p>',
    category: 'css',
    createdAt: '2024-01-13T12:00:00.000Z',
    ownerId: 'user-3',
    totalComments: 0,
    upVotesBy: [],
    downVotesBy: [],
  },
];

test.describe('Home Feature', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should display home page with threads', async () => {
    await homePage.mockThreadsAPI(MOCK_THREADS);
    await homePage.goto();

    await expect(homePage.homePage).toBeVisible();
    await expect(homePage.title).toBeVisible();
    await expect(homePage.searchInput).toBeVisible();

    await homePage.expectThreadCount(3);
  });

  test('should display empty state when no threads exist', async () => {
    await homePage.mockThreadsAPIEmpty();
    await homePage.goto();

    await expect(homePage.emptyState).toBeVisible();
    await expect(
      homePage.page.getByText('Belum ada diskusi saat ini.'),
    ).toBeVisible();
  });

  test('should display category badges from threads', async () => {
    await homePage.mockThreadsAPI(MOCK_THREADS);
    await homePage.goto();

    await expect(homePage.categoryList).toBeVisible();
    await expect(homePage.getCategory('react')).toBeVisible();
    await expect(homePage.getCategory('typescript')).toBeVisible();
    await expect(homePage.getCategory('css')).toBeVisible();
  });

  test('should filter threads by clicking category badge', async () => {
    await homePage.mockThreadsAPI(MOCK_THREADS);
    await homePage.goto();

    await homePage.clickCategory('react');
    await homePage.expectThreadCount(1);
    await expect(
      homePage.page.getByText('Bagaimana cara menggunakan React Hooks?'),
    ).toBeVisible();

    await homePage.clickCategory('react');
    await homePage.expectThreadCount(3);
  });

  test('should filter threads by search input', async () => {
    await homePage.mockThreadsAPI(MOCK_THREADS);
    await homePage.page.goto('/?q=react');

    await homePage.expectThreadCount(1);
    await expect(
      homePage.page.getByText('Bagaimana cara menggunakan React Hooks?'),
    ).toBeVisible();
  });

  test('should show no results message for unmatched search', async () => {
    await homePage.mockThreadsAPI(MOCK_THREADS);
    await homePage.page.goto('/?q=kategori-tidak-ada');

    await expect(homePage.noResults).toBeVisible({ timeout: 5000 });
    await expect(
      homePage.page.getByText('Diskusi yang Anda cari tidak ditemukan.'),
    ).toBeVisible();
  });

  test('should not show FAB when user is not logged in', async () => {
    await homePage.mockThreadsAPI(MOCK_THREADS);
    await homePage.goto();

    await expect(homePage.createThreadFAB).not.toBeVisible();
  });
});
