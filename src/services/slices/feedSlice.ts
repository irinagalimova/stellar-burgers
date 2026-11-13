import { getFeedsApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TFeedState } from '@/utils/types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk('feed/fetch', () => getFeedsApi());

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchFeeds.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      state.isLoading = false;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.orders = action.payload.orders;
      state.error = null;
    });
    builder.addCase(fetchFeeds.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export default feedsSlice.reducer;
