import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  resetPasswordApi,
} from '@/utils/burger-api';
import {
  logoutApi,
  type TLoginData,
  type TRegisterData,
  forgotPasswordApi,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/types';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  error: unknown;
  isAuthChecked: boolean;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const checkUserAuth = createAsyncThunk('user/checkAuth', () => getUserApi());

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  (userData: Partial<TRegisterData>) => updateUserApi(userData)
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      state.isAuthChecked = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      state.isAuthChecked = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(checkUserAuth.pending, (state) => {
      state.isAuthChecked = false;
    });
    builder.addCase(checkUserAuth.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthChecked = true;
    });
    builder.addCase(checkUserAuth.rejected, (state) => {
      state.user = null;
      state.isAuthChecked = true;
    });
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.error = null;
      state.isAuthChecked = true;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export default userSlice.reducer;
