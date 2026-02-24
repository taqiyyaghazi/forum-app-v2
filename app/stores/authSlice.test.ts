import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '~/lib/api';
import authReducer, {
  fetchAuthUser,
  loginUser,
  logout,
  registerUser,
  resetAuthStatus,
} from './authSlice';

// Mock the API module
vi.mock('~/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('authSlice', () => {
  const fakeUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://avatar.com/john',
  };

  const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isSuccess: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle resetAuthStatus', () => {
      const stateWithErrors = {
        ...initialState,
        isLoading: true,
        error: 'Beberapa error',
        isSuccess: true,
      };

      const state = authReducer(stateWithErrors, resetAuthStatus());

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isSuccess).toBe(false);
    });

    it('should handle logout', () => {
      const stateLoggedIn = {
        ...initialState,
        user: fakeUser,
        token: 'fake-jwt-token',
      };

      const state = authReducer(stateLoggedIn, logout());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('should handle registerUser.pending', () => {
      const state = authReducer(initialState, {
        type: registerUser.pending.type,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isSuccess).toBe(false);
    });

    it('should handle registerUser.fulfilled', () => {
      const mockPayload = { data: { user: fakeUser } };
      const state = authReducer(initialState, {
        type: registerUser.fulfilled.type,
        payload: mockPayload,
      });
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.user).toEqual(fakeUser);
    });

    it('should handle registerUser.rejected', () => {
      const state = authReducer(initialState, {
        type: registerUser.rejected.type,
        payload: 'Terjadi kesalahan saat mendaftar',
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Terjadi kesalahan saat mendaftar');
    });

    it('should handle loginUser.pending', () => {
      const state = authReducer(initialState, {
        type: loginUser.pending.type,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isSuccess).toBe(false);
    });

    it('should handle loginUser.fulfilled', () => {
      const mockPayload = { data: { token: 'new-fake-token' } };
      const state = authReducer(initialState, {
        type: loginUser.fulfilled.type,
        payload: mockPayload,
      });
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.token).toBe('new-fake-token');
    });

    it('should handle loginUser.rejected', () => {
      const state = authReducer(initialState, {
        type: loginUser.rejected.type,
        payload: 'Kredensial salah',
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Kredensial salah');
    });

    it('should handle fetchAuthUser.pending', () => {
      const state = authReducer(initialState, {
        type: fetchAuthUser.pending.type,
      });
      expect(state.isLoading).toBe(true);
    });

    it('should handle fetchAuthUser.fulfilled', () => {
      const mockPayload = { data: { user: fakeUser } };
      const state = authReducer(initialState, {
        type: fetchAuthUser.fulfilled.type,
        payload: mockPayload,
      });
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(fakeUser);
    });

    it('should handle fetchAuthUser.rejected and clear token', () => {
      vi.stubGlobal('window', {});

      const preFilledState = {
        ...initialState,
        token: 'old-token',
        user: fakeUser,
      };
      const state = authReducer(preFilledState, {
        type: fetchAuthUser.rejected.type,
      });

      expect(state.isLoading).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');

      vi.unstubAllGlobals();
    });
  });

  describe('thunks', () => {
    const initStore = () =>
      configureStore({
        reducer: { auth: authReducer },
      });

    let store: ReturnType<typeof initStore>;

    beforeEach(() => {
      store = initStore();
    });

    it('dispatching registerUser should trigger API and resolve', async () => {
      const mockResponse = { data: { user: fakeUser } };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const userData = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      };
      const action = await store.dispatch(registerUser(userData));

      expect(api.post).toHaveBeenCalledWith('/register', userData);
      expect(action.type).toBe('auth/registerUser/fulfilled');
      expect(action.payload).toEqual(mockResponse);
    });

    it('dispatching registerUser should handle API failures', async () => {
      const apiErrorMock = {
        isAxiosError: true,
        response: { data: { message: 'Email sudah digunakan' } },
      };
      vi.mocked(api.post).mockRejectedValueOnce(apiErrorMock);
      import('axios').then((axios) => {
        vi.spyOn(axios.default, 'isAxiosError').mockReturnValueOnce(true);
      });

      const userData = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      };
      const action = await store.dispatch(registerUser(userData));

      expect(action.type).toBe('auth/registerUser/rejected');
      expect(action.payload).toBe('Email sudah digunakan');
    });

    it('dispatching loginUser should trigger API, set localStorage, and resolve', async () => {
      const mockResponse = { data: { token: 'testing-token-123' } };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };
      const action = await store.dispatch(loginUser(credentials));

      expect(api.post).toHaveBeenCalledWith('/login', credentials);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'accessToken',
        'testing-token-123',
      );
      expect(action.type).toBe('auth/loginUser/fulfilled');
    });

    it('dispatching fetchAuthUser should fetch user data successfully', async () => {
      const mockResponse = { data: { user: fakeUser } };
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      const action = await store.dispatch(fetchAuthUser());

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(action.type).toBe('auth/fetchAuthUser/fulfilled');
      expect(action.payload).toEqual(mockResponse);
    });

    it('dispatching fetchAuthUser should handle API errors correctly', async () => {
      const defaultError = new Error('Network Default Error');
      vi.mocked(api.get).mockRejectedValueOnce(defaultError);

      const action = await store.dispatch(fetchAuthUser());

      expect(action.type).toBe('auth/fetchAuthUser/rejected');
      expect(action.payload).toBe(
        'Terjadi kesalahan saat mengambil profil pengguna',
      );
    });
  });
});
