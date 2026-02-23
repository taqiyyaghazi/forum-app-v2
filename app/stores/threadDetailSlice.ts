import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '~/lib/api';

export interface Owner {
  id: string;
  name: string;
  avatar: string;
}

export interface ThreadComment {
  id: string;
  content: string;
  createdAt: string;
  owner: Owner;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface ThreadDetail {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: Owner;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: ThreadComment[];
}

interface ThreadDetailState {
  detailThread: ThreadDetail | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ThreadDetailState = {
  detailThread: null,
  isLoading: false,
  error: null,
};

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/threads/${threadId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat mengambil detail diskusi');
    }
  },
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async (
    { threadId, content }: { threadId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat menambahkan komentar');
    }
  },
);

export const upVoteThreadDetail = createAsyncThunk(
  'threadDetail/upVoteThreadDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/threads/${threadId}/up-vote`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat menyukai diskusi');
    }
  },
);

export const downVoteThreadDetail = createAsyncThunk(
  'threadDetail/downVoteThreadDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/threads/${threadId}/down-vote`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat tidak menyukai diskusi');
    }
  },
);

export const neutralVoteThreadDetail = createAsyncThunk(
  'threadDetail/neutralVoteThreadDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/threads/${threadId}/neutral-vote`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        'Terjadi kesalahan saat menetralisasi vote diskusi',
      );
    }
  },
);

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async (
    { threadId, commentId }: { threadId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/threads/${threadId}/comments/${commentId}/up-vote`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat menyukai komentar');
    }
  },
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async (
    { threadId, commentId }: { threadId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/threads/${threadId}/comments/${commentId}/down-vote`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat tidak menyukai komentar');
    }
  },
);

export const neutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async (
    { threadId, commentId }: { threadId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/threads/${threadId}/comments/${commentId}/neutral-vote`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        'Terjadi kesalahan saat menetralisasi vote komentar',
      );
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    clearThreadDetail: (state) => {
      state.detailThread = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailThread = action.payload.data.detailThread;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.detailThread) {
          state.detailThread.comments.push(action.payload.data.comment);
        }
      });

    const handleVoteFulfilled = (
      state: ThreadDetailState,
      action: PayloadAction<{
        data: { vote: { userId: string; voteType: number } };
      }>,
    ) => {
      if (state.detailThread) {
        const { userId, voteType } = action.payload.data.vote;

        state.detailThread.upVotesBy = state.detailThread.upVotesBy.filter(
          (id) => id !== userId,
        );
        state.detailThread.downVotesBy = state.detailThread.downVotesBy.filter(
          (id) => id !== userId,
        );

        if (voteType === 1) {
          state.detailThread.upVotesBy.push(userId);
        } else if (voteType === -1) {
          state.detailThread.downVotesBy.push(userId);
        }
      }
    };

    const handleCommentVoteFulfilled = (
      state: ThreadDetailState,
      action: PayloadAction<{
        data: { vote: { userId: string; commentId: string; voteType: number } };
      }>,
    ) => {
      if (state.detailThread) {
        const { userId, commentId, voteType } = action.payload.data.vote;
        const comment = state.detailThread.comments.find(
          (c) => c.id === commentId,
        );

        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter(
            (id) => id !== userId,
          );

          if (voteType === 1) {
            comment.upVotesBy.push(userId);
          } else if (voteType === -1) {
            comment.downVotesBy.push(userId);
          }
        }
      }
    };

    builder
      .addCase(upVoteThreadDetail.fulfilled, handleVoteFulfilled)
      .addCase(downVoteThreadDetail.fulfilled, handleVoteFulfilled)
      .addCase(neutralVoteThreadDetail.fulfilled, handleVoteFulfilled)
      .addCase(upVoteComment.fulfilled, handleCommentVoteFulfilled)
      .addCase(downVoteComment.fulfilled, handleCommentVoteFulfilled)
      .addCase(neutralVoteComment.fulfilled, handleCommentVoteFulfilled);
  },
});

export const { clearThreadDetail } = threadDetailSlice.actions;

export default threadDetailSlice.reducer;
