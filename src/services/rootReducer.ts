import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructorSlice';
import feedsReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientSlice';
import orderInfoReducer from './slices/orderInfoSlice';
import orderReducer from './slices/orderSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedsReducer,
  orderInfo: orderInfoReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer,
});
