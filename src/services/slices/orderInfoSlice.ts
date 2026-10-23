import { getOrderByNumberApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: unknown;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null,
};

export const fetchOrder = createAsyncThunk('order/fetch', (number: number) =>
  getOrderByNumberApi(number)
);

const orderInfoSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.order = action.payload.orders[0] ?? null;
    });
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export default orderInfoSlice.reducer;
