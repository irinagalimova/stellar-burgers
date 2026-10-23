import { orderBurgerApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

type TOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: unknown;
};

const initialState: TOrderState = {
  order: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk('order/create', (ingredients: string[]) =>
  orderBurgerApi(ingredients)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.order = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.order = action.payload.order;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
      state.order = null;
    });
  },
});

export default orderSlice.reducer;
export const { resetOrder } = orderSlice.actions;
