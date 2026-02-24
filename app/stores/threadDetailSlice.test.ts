import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '~/lib/api';
import threadDetailReducer, {
  clearThreadDetail,
  createComment,
  downVoteComment,
  downVoteThreadDetail,
  fetchThreadDetail,
  neutralVoteComment,
  neutralVoteThreadDetail,
  upVoteComment,
  upVoteThreadDetail,
  type ThreadComment,
  type ThreadDetail,
} from './threadDetailSlice';

vi.mock('~/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('threadDetailSlice', () => {
  const fakeOwner = {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://avatar.com/john',
  };

  const fakeComment1: ThreadComment = {
    id: 'comment-1',
    content: 'Ini komentar pertama',
    createdAt: '2023-01-02T00:00:00.000Z',
    owner: fakeOwner,
    upVotesBy: [],
    downVotesBy: [],
  };

  const fakeComment2: ThreadComment = {
    ...fakeComment1,
    id: 'comment-2',
    content: 'Ini komentar kedua',
  };

  const fakeThreadDetail: ThreadDetail = {
    id: 'thread-1',
    title: 'Thread 1',
    body: 'Isi dari thread pertama',
    category: 'react',
    createdAt: '2023-01-01T00:00:00.000Z',
    owner: fakeOwner,
    upVotesBy: [],
    downVotesBy: [],
    comments: [fakeComment1],
  };

  const initialState = {
    detailThread: null,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return initial state when passed an unknown action', () => {
      expect(threadDetailReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      );
    });

    it('should handle clearThreadDetail', () => {
      const stateWithData = {
        detailThread: fakeThreadDetail,
        isLoading: false,
        error: 'Beberapa error lama',
      };
      const nextState = threadDetailReducer(stateWithData, clearThreadDetail());
      expect(nextState.detailThread).toBeNull();
      expect(nextState.error).toBeNull();
    });

    it('should handle fetchThreadDetail.pending', () => {
      const state = threadDetailReducer(initialState, {
        type: fetchThreadDetail.pending.type,
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchThreadDetail.fulfilled', () => {
      const state = threadDetailReducer(initialState, {
        type: fetchThreadDetail.fulfilled.type,
        payload: { data: { detailThread: fakeThreadDetail } },
      });
      expect(state.isLoading).toBe(false);
      expect(state.detailThread).toEqual(fakeThreadDetail);
    });

    it('should handle fetchThreadDetail.rejected', () => {
      const state = threadDetailReducer(initialState, {
        type: fetchThreadDetail.rejected.type,
        payload: 'Thread tidak ditemukan',
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Thread tidak ditemukan');
    });

    it('should handle createComment.fulfilled by adding the new comment', () => {
      const stateWithThread = {
        ...initialState,
        detailThread: fakeThreadDetail,
      };
      const state = threadDetailReducer(stateWithThread, {
        type: createComment.fulfilled.type,
        payload: { data: { comment: fakeComment2 } },
      });

      expect(state.detailThread?.comments.length).toBe(2);
      expect(state.detailThread?.comments[1]).toEqual(fakeComment2);
    });

    describe('handleVoteFulfilled (Thread Votes)', () => {
      const stateWithThread = {
        ...initialState,
        detailThread: fakeThreadDetail,
      };

      it('should handle upVoteThreadDetail.fulfilled', () => {
        const state = threadDetailReducer(stateWithThread, {
          type: upVoteThreadDetail.fulfilled.type,
          payload: { data: { vote: { userId: 'user-2', voteType: 1 } } },
        });
        expect(state.detailThread?.upVotesBy).toContain('user-2');
        expect(state.detailThread?.downVotesBy).not.toContain('user-2');
      });

      it('should handle downVoteThreadDetail.fulfilled and remove previous upVote', () => {
        const stateWithUpvote = {
          ...stateWithThread,
          detailThread: { ...fakeThreadDetail, upVotesBy: ['user-3'] },
        };
        const state = threadDetailReducer(stateWithUpvote, {
          type: downVoteThreadDetail.fulfilled.type,
          payload: { data: { vote: { userId: 'user-3', voteType: -1 } } },
        });
        expect(state.detailThread?.upVotesBy).not.toContain('user-3');
        expect(state.detailThread?.downVotesBy).toContain('user-3');
      });

      it('should handle neutralVoteThreadDetail.fulfilled', () => {
        const stateWithDownvote = {
          ...stateWithThread,
          detailThread: { ...fakeThreadDetail, downVotesBy: ['user-4'] },
        };
        const state = threadDetailReducer(stateWithDownvote, {
          type: neutralVoteThreadDetail.fulfilled.type,
          payload: { data: { vote: { userId: 'user-4', voteType: 0 } } },
        });
        expect(state.detailThread?.downVotesBy).not.toContain('user-4');
        expect(state.detailThread?.upVotesBy).not.toContain('user-4');
      });
    });

    describe('handleCommentVoteFulfilled (Comment Votes)', () => {
      const stateWithComment = {
        ...initialState,
        detailThread: fakeThreadDetail,
      };

      it('should handle upVoteComment.fulfilled', () => {
        const state = threadDetailReducer(stateWithComment, {
          type: upVoteComment.fulfilled.type,
          payload: {
            data: {
              vote: {
                userId: 'user-5',
                commentId: 'comment-1',
                voteType: 1,
              },
            },
          },
        });
        const targetComment = state.detailThread?.comments.find(
          (c) => c.id === 'comment-1',
        );
        expect(targetComment?.upVotesBy).toContain('user-5');
      });

      it('should handle downVoteComment.fulfilled and clear upVote', () => {
        const prefilledComment = { ...fakeComment1, upVotesBy: ['user-6'] };
        const prefilledState = {
          ...initialState,
          detailThread: { ...fakeThreadDetail, comments: [prefilledComment] },
        };

        const state = threadDetailReducer(prefilledState, {
          type: downVoteComment.fulfilled.type,
          payload: {
            data: {
              vote: {
                userId: 'user-6',
                commentId: 'comment-1',
                voteType: -1,
              },
            },
          },
        });
        const targetComment = state.detailThread?.comments[0];
        expect(targetComment?.upVotesBy).not.toContain('user-6');
        expect(targetComment?.downVotesBy).toContain('user-6');
      });

      it('should handle neutralVoteComment.fulfilled', () => {
        const prefilledComment = { ...fakeComment1, downVotesBy: ['user-7'] };
        const prefilledState = {
          ...initialState,
          detailThread: { ...fakeThreadDetail, comments: [prefilledComment] },
        };

        const state = threadDetailReducer(prefilledState, {
          type: neutralVoteComment.fulfilled.type,
          payload: {
            data: {
              vote: {
                userId: 'user-7',
                commentId: 'comment-1',
                voteType: 0,
              },
            },
          },
        });
        const targetComment = state.detailThread?.comments[0];
        expect(targetComment?.downVotesBy).not.toContain('user-7');
        expect(targetComment?.upVotesBy).not.toContain('user-7');
      });
    });
  });

  describe('thunks', () => {
    const initStore = () =>
      configureStore({
        reducer: { threadDetail: threadDetailReducer },
      });

    let store: ReturnType<typeof initStore>;

    beforeEach(() => {
      store = initStore();
    });

    it('dispatching fetchThreadDetail should resolve correctly on success', async () => {
      const mockResponse = { data: { detailThread: fakeThreadDetail } };
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      const action = await store.dispatch(fetchThreadDetail('thread-1'));

      expect(api.get).toHaveBeenCalledWith('/threads/thread-1');
      expect(action.type).toBe('threadDetail/fetchThreadDetail/fulfilled');
      expect(action.payload).toEqual(mockResponse);
    });

    it('dispatching fetchThreadDetail should provide error message upon failure', async () => {
      const apiError = new Error('Basic Axios Error');
      vi.mocked(api.get).mockRejectedValueOnce(apiError);

      const action = await store.dispatch(fetchThreadDetail('thread-error'));

      expect(action.type).toBe('threadDetail/fetchThreadDetail/rejected');
      expect(action.payload).toBe(
        'Terjadi kesalahan saat mengambil detail diskusi',
      );
    });

    it('dispatching createComment should post payload and resolve data', async () => {
      const mockResponse = { data: { comment: fakeComment2 } };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const action = await store.dispatch(
        createComment({ threadId: 'thread-1', content: 'Komentar baru' }),
      );

      expect(api.post).toHaveBeenCalledWith('/threads/thread-1/comments', {
        content: 'Komentar baru',
      });
      expect(action.type).toBe('threadDetail/createComment/fulfilled');
      expect(action.payload).toEqual(mockResponse);
    });

    it('dispatching upVoteComment should call the correct API endpoint', async () => {
      const mockResponse = { data: { vote: { id: 'v1', voteType: 1 } } };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const action = await store.dispatch(
        upVoteComment({ threadId: 'thread-9', commentId: 'comm-9' }),
      );

      expect(api.post).toHaveBeenCalledWith(
        '/threads/thread-9/comments/comm-9/up-vote',
      );
      expect(action.type).toBe('threadDetail/upVoteComment/fulfilled');
    });

    it('should properly reject vote thunk with API response error', async () => {
      const axiosErrorMock = {
        isAxiosError: true,
        response: { data: { message: 'Gagal voting nih' } },
      };

      vi.mocked(api.post).mockRejectedValueOnce(axiosErrorMock);
      import('axios').then((axios) => {
        vi.spyOn(axios.default, 'isAxiosError').mockReturnValueOnce(true);
      });

      const action = await store.dispatch(downVoteThreadDetail('thread-bad'));

      expect(api.post).toHaveBeenCalledWith('/threads/thread-bad/down-vote');
      expect(action.type).toBe('threadDetail/downVoteThreadDetail/rejected');
      expect(action.payload).toBe('Gagal voting nih');
    });
  });
});
