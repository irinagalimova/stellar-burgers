import ingredientReducer, { fetchIngredients } from './ingredientSlice';

import type { TIngredient } from '@/utils/types';

describe('Редьюсер ингредиентов', () => {
  test('начало загрузки: isLoading true, error null', () => {
    const previousState = {
      ingredients: [],
      isLoading: false,
      error: { message: 'Загрузка не удалась' },
    };

    const action = fetchIngredients.pending('request-1', undefined);
    const nextState = ingredientReducer(previousState, action);

    expect(nextState).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('успешная загрузка: сохраняет ingredients, isLoading false', () => {
    const ingredient: TIngredient = {
      _id: 'bun-1',
      name: 'Тестовая булочка',
      type: 'bun',
      proteins: 8,
      fat: 3,
      carbohydrates: 40,
      calories: 220,
      price: 100,
      image: 'bun.png',
      image_large: 'bun-large.png',
      image_mobile: 'bun-mobile.png',
    };

    const previousState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.fulfilled([ingredient], 'request-1', undefined);
    const nextState = ingredientReducer(previousState, action);

    expect(nextState).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  test('ошибка загрузки: isLoading false, сохраняет сообщение об ошибке', () => {
    const previousState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'request-1',
      undefined
    );

    const nextState = ingredientReducer(previousState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error?.message).toBe('Не удалось загрузить ингредиенты');
  });

  test('неизвестный экшен и state undefined: возвращает initialState', () => {
    const nextState = ingredientReducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });
});
