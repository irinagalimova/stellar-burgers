import constructorSliceReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
  setBun,
} from './constructorSlice';

const bun = {
  _id: 'bun-1',
  id: 'constructor-bun-1',
  name: 'Белкобулка качковская',
  type: 'bun',
  proteins: 25,
  fat: 0,
  carbohydrates: 40,
  calories: 220,
  price: 150,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
};

const ingredient = {
  _id: 'ingredient-1',
  id: 'constructor-ingredient-1',
  name: 'патиссоны Роберта',
  type: 'vegetable',
  proteins: 0.6,
  fat: 0.1,
  carbohydrates: 4.1,
  calories: 19,
  price: 30,
  image: 'patisson.png',
  image_large: 'patisson-large.png',
  image_mobile: 'patisson-mobile.png',
};

const secondIngredient = {
  ...ingredient,
  id: 'constructor-ingredient-2',
};

test('неизвестный экшен и state undefined: возвращает initialState', () => {
  const nextState = constructorSliceReducer(undefined, { type: 'UNKNOWN' });

  expect(nextState).toEqual({
    bun: null,
    ingredients: [],
  });
});

test('setBun: сохраняет булку', () => {
  const previousState = { bun: null, ingredients: [] };
  const action = setBun(bun);
  const nextState = constructorSliceReducer(previousState, action);

  expect(nextState).toEqual({
    bun,
    ingredients: [],
  });
});

test('addIngredient: добавляет ингредиент в массив ingredients', () => {
  const previousState = { bun: null, ingredients: [] };
  const action = addIngredient(ingredient);
  const nextState = constructorSliceReducer(previousState, action);

  expect(nextState).toEqual({
    bun: null,
    ingredients: [ingredient],
  });
});

test('removeIngredient: удаляет ингредиент из массива ingredients', () => {
  const previousState = { bun: null, ingredients: [ingredient, secondIngredient] };
  const action = removeIngredient(secondIngredient.id);
  const nextState = constructorSliceReducer(previousState, action);

  expect(nextState).toEqual({
    bun: null,
    ingredients: [ingredient],
  });
});

test('moveIngredient: меняет порядок в ingredients', () => {
  const previousState = { bun: null, ingredients: [ingredient, secondIngredient] };
  const action = moveIngredient({ from: 0, to: 1 });
  const nextState = constructorSliceReducer(previousState, action);

  expect(nextState.ingredients).toEqual([secondIngredient, ingredient]);
});

test('clearConstructor: очищает конструктор', () => {
  const previousState = { bun, ingredients: [ingredient] };
  const action = clearConstructor();
  const nextState = constructorSliceReducer(previousState, action);

  expect(nextState).toEqual({
    bun: null,
    ingredients: [],
  });
});
