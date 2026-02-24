import { type Locator, type Page, expect } from '@playwright/test';

const MOCK_THREAD_DETAIL = {
  id: 'thread-1',
  title: 'Bagaimana cara menggunakan React Hooks?',
  body: '<p>Saya ingin belajar React Hooks, terutama useState dan useEffect.</p>',
  category: 'react',
  createdAt: '2024-01-15T10:00:00.000Z',
  owner: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
  },
  upVotesBy: ['user-2'],
  downVotesBy: [],
  comments: [
    {
      id: 'comment-1',
      content: '<p>Kamu bisa mulai dengan membaca dokumentasi resmi React.</p>',
      createdAt: '2024-01-16T08:00:00.000Z',
      owner: {
        id: 'user-2',
        name: 'Jane Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      },
      upVotesBy: [],
      downVotesBy: [],
    },
  ],
};

export { MOCK_THREAD_DETAIL };

export class ThreadDetailPage {
  readonly page: Page;

  readonly threadDetailPage: Locator;

  readonly backButton: Locator;

  readonly threadDetailCard: Locator;

  readonly threadTitle: Locator;

  readonly threadBody: Locator;

  readonly commentsSection: Locator;

  readonly commentsList: Locator;

  readonly emptyComments: Locator;

  readonly loginPrompt: Locator;

  readonly commentForm: Locator;

  readonly commentInput: Locator;

  readonly commentSubmitButton: Locator;

  readonly errorState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.threadDetailPage = page.getByTestId('thread-detail-page');
    this.backButton = page.getByTestId('back-button');
    this.threadDetailCard = page.getByTestId('thread-detail-card');
    this.threadTitle = page.getByTestId('thread-detail-title');
    this.threadBody = page.getByTestId('thread-detail-body');
    this.commentsSection = page.getByTestId('comments-section');
    this.commentsList = page.getByTestId('comments-list');
    this.emptyComments = page.getByTestId('empty-comments');
    this.loginPrompt = page.getByTestId('login-prompt');
    this.commentForm = page.getByTestId('comment-form');
    this.commentInput = page.getByTestId('comment-input');
    this.commentSubmitButton = page.getByTestId('comment-submit-button');
    this.errorState = page.getByTestId('error-state');
  }

  async goto(threadId = 'thread-1') {
    await this.page.goto(`/threads/${threadId}`);
  }

  /**
   * Mock the API endpoint for GET /threads/:id.
   * Uses the full API base URL to avoid intercepting browser navigation to /threads/:id.
   */
  async mockThreadDetailAPI(
    threadId: string,
    detail: object = MOCK_THREAD_DETAIL,
  ) {
    await this.page.route(`**/v1/threads/${threadId}`, async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        return;
      }
      if (route.request().method() !== 'GET') {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          message: 'ok',
          data: { detailThread: detail },
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  async mockThreadDetailAPIError(threadId: string) {
    await this.page.route(`**/v1/threads/${threadId}`, async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        return;
      }
      await route.fulfill({
        status: 404,
        body: JSON.stringify({ message: 'Thread tidak ditemukan' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    });
  }

  async mockCreateCommentAPI(threadId: string, status: number, body: object) {
    await this.page.route(
      `**/v1/threads/${threadId}/comments`,
      async (route) => {
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
      },
    );
  }

  async setAuthToken(token: string) {
    await this.page.evaluate((t) => {
      localStorage.setItem('accessToken', t);
    }, token);
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

  async expectRedirectTo(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}
