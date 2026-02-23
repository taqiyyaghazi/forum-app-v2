import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '~/lib/api';

export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface LeaderboardEntry {
  user: LeaderboardUser;
  score: number;
}

interface LeaderboardsState {
  leaderboards: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaderboardsState = {
  leaderboards: [],
  isLoading: false,
  error: null,
};

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetchLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboards');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        'Terjadi kesalahan saat mengambil daya leaderboard',
      );
    }
  },
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboards = action.payload.data.leaderboards;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default leaderboardsSlice.reducer;
