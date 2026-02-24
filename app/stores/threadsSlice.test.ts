import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '~/lib/api';
import threadsReducer, {
  createThread,
  downVoteThread,
  fetchThreads,
  neutralVoteThread,
  selectFilteredThreads,
  upVoteThread,
  type Thread,
} from './threadsSlice';

vi.mock('~/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('threadsSlice', () => {
  const fakeThread1: Thread = {
    id: 'thread-1',
    title: 'Thread 1',
    body: 'Ini isi thread 1',
    category: 'react',
    createdAt: '2023-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  };

  const fakeThread2: Thread = {
    ...fakeThread1,
    id: 'thread-2',
    title: 'Thread 2',
    category: 'redux',
  };

  const initialState = {
    threads: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(threadsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      );
    });

    it('should handle fetchThreads.pending', () => {
      const action = { type: fetchThreads.pending.type };
      const state = threadsReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchThreads.fulfilled', () => {
      const action = {
        type: fetchThreads.fulfilled.type,
        payload: { data: { threads: [fakeThread1, fakeThread2] } },
      };
      const state = threadsReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.threads).toEqual([fakeThread1, fakeThread2]);
      expect(state.error).toBeNull();
    });

    it('should handle fetchThreads.rejected', () => {
      const action = {
        type: fetchThreads.rejected.type,
        payload: 'Terjadi kesalahan jaringan',
      };
      const state = threadsReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Terjadi kesalahan jaringan');
    });

    it('should handle createThread.fulfilled', () => {
      const currentState = {
        ...initialState,
        threads: [fakeThread1],
      };
      const action = {
        type: createThread.fulfilled.type,
        payload: { data: { thread: fakeThread2 } },
      };
      const state = threadsReducer(currentState, action);

      expect(state.threads[0]).toEqual(fakeThread2);
      expect(state.threads.length).toBe(2);
    });

    describe('voting handleVoteFulfilled', () => {
      const voteState = {
        ...initialState,
        threads: [fakeThread1],
      };

      it('should handle upVoteThread.fulfilled', () => {
        const action = {
          type: upVoteThread.fulfilled.type,
          payload: {
            data: {
              vote: { threadId: 'thread-1', userId: 'user-2', voteType: 1 },
            },
          },
        };
        const state = threadsReducer(voteState, action);
        expect(state.threads[0].upVotesBy).toContain('user-2');
        expect(state.threads[0].downVotesBy).not.toContain('user-2');
      });

      it('should handle downVoteThread.fulfilled', () => {
        const action = {
          type: downVoteThread.fulfilled.type,
          payload: {
            data: {
              vote: { threadId: 'thread-1', userId: 'user-3', voteType: -1 },
            },
          },
        };
        const prevState = {
          ...initialState,
          threads: [{ ...fakeThread1, upVotesBy: ['user-3'] }],
        };

        const state = threadsReducer(prevState, action);
        expect(state.threads[0].upVotesBy).not.toContain('user-3');
        expect(state.threads[0].downVotesBy).toContain('user-3');
      });

      it('should handle neutralVoteThread.fulfilled', () => {
        const action = {
          type: neutralVoteThread.fulfilled.type,
          payload: {
            data: {
              vote: { threadId: 'thread-1', userId: 'user-4', voteType: 0 },
            },
          },
        };
        const prevState = {
          ...initialState,
          threads: [{ ...fakeThread1, downVotesBy: ['user-4'] }],
        };

        const state = threadsReducer(prevState, action);
        expect(state.threads[0].downVotesBy).not.toContain('user-4');
        expect(state.threads[0].upVotesBy).not.toContain('user-4');
      });
    });
  });

  describe('thunks', () => {
    const initStore = () =>
      configureStore({
        reducer: { threads: threadsReducer },
      });

    let store: ReturnType<typeof initStore>;

    beforeEach(() => {
      store = initStore();
    });

    it('dispatching fetchThreads should resolve data when API success', async () => {
      const mockData = { data: { threads: [fakeThread1] } };
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

      const action = await store.dispatch(fetchThreads());
      expect(api.get).toHaveBeenCalledWith('/threads');
      expect(action.type).toBe('threads/fetchThreads/fulfilled');
      expect(action.payload).toEqual(mockData);
    });

    it('dispatching createThread should resolve data when API success', async () => {
      const payloadData = { title: 'Test', body: 'Bod', category: 'general' };
      const responseBody = { data: { thread: fakeThread2 } };
      vi.mocked(api.post).mockResolvedValueOnce({ data: responseBody });

      const action = await store.dispatch(createThread(payloadData));
      expect(api.post).toHaveBeenCalledWith('/threads', payloadData);
      expect(action.type).toBe('threads/createThread/fulfilled');
      expect(action.payload).toEqual(responseBody);
    });

    it('should reject with default error message when API fails entirely without response body', async () => {
      const errorMock = new Error('Network Error');
      vi.mocked(api.get).mockRejectedValueOnce(errorMock);

      const action = await store.dispatch(fetchThreads());
      expect(action.type).toBe('threads/fetchThreads/rejected');
      expect(action.payload).toBe(
        'Terjadi kesalahan saat mengambil data thread',
      );
    });

    it('should reject with API error message when Axios throws an error with response', async () => {
      const errorMessage = 'Invalid Data Supplied';
      const axiosErrorMock = {
        isAxiosError: true,
        response: { data: { message: errorMessage } },
      };

      vi.mocked(api.get).mockRejectedValueOnce(axiosErrorMock);
      import('axios').then((axios) => {
        vi.spyOn(axios.default, 'isAxiosError').mockReturnValueOnce(true);
      });

      const action = await store.dispatch(fetchThreads());
      expect(action.type).toBe('threads/fetchThreads/rejected');
      expect(action.payload).toBe(errorMessage);
    });
  });

  describe('selectors', () => {
    const selectorState = {
      threads: {
        threads: [fakeThread1, fakeThread2],
        isLoading: false,
        error: null,
      },
    };

    it('selectFilteredThreads should return all if query is empty', () => {
      const result = selectFilteredThreads(selectorState, '');
      expect(result).toHaveLength(2);
      expect(result).toEqual([fakeThread1, fakeThread2]);
    });

    it('selectFilteredThreads should filter correctly by matched full or partial category', () => {
      const result = selectFilteredThreads(selectorState, 'RE');
      expect(result).toHaveLength(2);

      const resultSpecific = selectFilteredThreads(selectorState, 'React');
      expect(resultSpecific).toHaveLength(1);
      expect(resultSpecific[0].category).toBe('react');
    });

    it('selectFilteredThreads should return empty array if no match', () => {
      const result = selectFilteredThreads(selectorState, 'vuejs');
      expect(result).toHaveLength(1);
    });
  });
});
