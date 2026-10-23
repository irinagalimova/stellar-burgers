import { getOrdersApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: unknown;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk('profileOrders/fetch', () =>
  getOrdersApi()
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchProfileOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfileOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.orders = action.payload;
    });
    builder.addCase(fetchProfileOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export default profileOrdersSlice.reducer;
