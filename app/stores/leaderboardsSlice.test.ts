import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '~/lib/api';
import leaderboardsReducer, {
  fetchLeaderboards,
  type LeaderboardEntry,
} from './leaderboardsSlice';

vi.mock('~/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('leaderboardsSlice', () => {
  const fakeLeaderboardEntry1: LeaderboardEntry = {
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://avatar.com/john',
    },
    score: 1500,
  };

  const fakeLeaderboardEntry2: LeaderboardEntry = {
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://avatar.com/jane',
    },
    score: 1250,
  };

  const initialState = {
    leaderboards: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return the initial state when passed an unknown action', () => {
      expect(leaderboardsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      );
    });

    it('should handle fetchLeaderboards.pending', () => {
      const state = leaderboardsReducer(initialState, {
        type: fetchLeaderboards.pending.type,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchLeaderboards.fulfilled', () => {
      const mockPayload = {
        data: { leaderboards: [fakeLeaderboardEntry1, fakeLeaderboardEntry2] },
      };
      const state = leaderboardsReducer(initialState, {
        type: fetchLeaderboards.fulfilled.type,
        payload: mockPayload,
      });
      expect(state.isLoading).toBe(false);
      expect(state.leaderboards).toEqual([
        fakeLeaderboardEntry1,
        fakeLeaderboardEntry2,
      ]);
      expect(state.error).toBeNull();
    });

    it('should handle fetchLeaderboards.rejected', () => {
      const state = leaderboardsReducer(initialState, {
        type: fetchLeaderboards.rejected.type,
        payload: 'Terjadi kesalahan saat mengambil daya leaderboard',
      });
      expect(state.isLoading).toBe(false);
      expect(state.leaderboards).toEqual([]);
      expect(state.error).toBe(
        'Terjadi kesalahan saat mengambil daya leaderboard',
      );
    });
  });

  describe('thunks', () => {
    const initStore = () =>
      configureStore({
        reducer: { leaderboards: leaderboardsReducer },
      });

    let store: ReturnType<typeof initStore>;

    beforeEach(() => {
      store = initStore();
    });

    it('dispatching fetchLeaderboards should resolve data on success', async () => {
      const mockResponse = {
        data: { leaderboards: [fakeLeaderboardEntry1, fakeLeaderboardEntry2] },
      };
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      const action = await store.dispatch(fetchLeaderboards());

      expect(api.get).toHaveBeenCalledWith('/leaderboards');
      expect(action.type).toBe('leaderboards/fetchLeaderboards/fulfilled');
      expect(action.payload).toEqual(mockResponse);
    });

    it('dispatching fetchLeaderboards should provide default error on general failure', async () => {
      const apiError = new Error('Basic Network Error');
      vi.mocked(api.get).mockRejectedValueOnce(apiError);

      const action = await store.dispatch(fetchLeaderboards());

      expect(action.type).toBe('leaderboards/fetchLeaderboards/rejected');
      expect(action.payload).toBe(
        'Terjadi kesalahan saat mengambil daya leaderboard',
      );
    });

    it('dispatching fetchLeaderboards should provide API error message on Axios error', async () => {
      const axiosErrorMock = {
        isAxiosError: true,
        response: { data: { message: 'Server Sedang Sibuk' } },
      };

      vi.mocked(api.get).mockRejectedValueOnce(axiosErrorMock);

      import('axios').then((axios) => {
        vi.spyOn(axios.default, 'isAxiosError').mockReturnValueOnce(true);
      });

      const action = await store.dispatch(fetchLeaderboards());

      expect(action.type).toBe('leaderboards/fetchLeaderboards/rejected');
      expect(action.payload).toBe('Server Sedang Sibuk');
    });
  });
});
