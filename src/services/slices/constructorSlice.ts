import { createSlice } from '@reduxjs/toolkit';

import type { TConstructorIngredient, TConstructorState } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((ing) => ing.id !== action.payload);
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (
        from < 0 ||
        from >= state.ingredients.length ||
        to < 0 ||
        to >= state.ingredients.length
      ) {
        return;
      }
      const [ingredient] = state.ingredients.splice(from, 1);

      if (ingredient) {
        state.ingredients.splice(to, 0, ingredient);
      }
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export default constructorSlice.reducer;
export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;
