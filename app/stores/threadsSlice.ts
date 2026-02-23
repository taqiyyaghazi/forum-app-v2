import {
  createAsyncThunk,
  createSlice,
  createSelector,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import api from '~/lib/api';

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

interface ThreadsState {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  isLoading: false,
  error: null,
};

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/threads');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat mengambil data thread');
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (
    threadData: { title: string; body: string; category?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/threads', threadData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat membuat thread');
    }
  },
);

export const upVoteThread = createAsyncThunk(
  'threads/upVoteThread',
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

export const downVoteThread = createAsyncThunk(
  'threads/downVoteThread',
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

export const neutralVoteThread = createAsyncThunk(
  'threads/neutralVoteThread',
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

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.threads = action.payload.data.threads;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        if (state.threads) {
          state.threads.unshift(action.payload.data.thread);
        }
      });

    const handleVoteFulfilled = (
      state: ThreadsState,
      action: PayloadAction<{
        data: { vote: { threadId: string; userId: string; voteType: number } };
      }>,
    ) => {
      const { threadId, userId, voteType } = action.payload.data.vote;
      const thread = state.threads.find((t) => t.id === threadId);

      if (thread) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

        if (voteType === 1) {
          thread.upVotesBy.push(userId);
        } else if (voteType === -1) {
          thread.downVotesBy.push(userId);
        }
      }
    };

    builder
      .addCase(upVoteThread.fulfilled, handleVoteFulfilled)
      .addCase(downVoteThread.fulfilled, handleVoteFulfilled)
      .addCase(neutralVoteThread.fulfilled, handleVoteFulfilled);
  },
});

export default threadsSlice.reducer;

const selectThreads = (state: { threads: ThreadsState }) =>
  state.threads.threads;
const selectSearchQuery = (_state: { threads: ThreadsState }, query: string) =>
  query;

export const selectFilteredThreads = createSelector(
  [selectThreads, selectSearchQuery],
  (threads, query) => {
    if (!query) return threads;
    return threads.filter((thread) =>
      thread.category.toLowerCase().includes(query.toLowerCase()),
    );
  },
);
