import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '~/lib/api';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat mendaftar');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    userData: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/login', userData);
      localStorage.setItem('accessToken', response.data.data.token);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Terjadi kesalahan saat masuk');
    }
  },
);

export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        'Terjadi kesalahan saat mengambil profil pengguna',
      );
    }
  },
);

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  token:
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isLoading: false,
  error: null,
  isSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.data.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAuthUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
      })
      .addCase(fetchAuthUser.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
      });
  },
});

export const { resetAuthStatus, logout } = authSlice.actions;

export default authSlice.reducer;
