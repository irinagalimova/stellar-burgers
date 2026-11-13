import { fetchOrder } from '@/services/slices/orderInfoSlice';
import { useSelector, useDispatch } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const orderData = useSelector((state) => state.orderInfo.order);
  const isLoading = useSelector((state) => state.orderInfo.isLoading);
  const error = useSelector((state) => state.orderInfo.error);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const ingredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.error);
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(fetchOrder(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (error || ingredientsError) {
    return <p>Не удалось загрузить данные заказа. Попробуйте позже</p>;
  }

  if (!orderData) {
    return <p>Заказ не найден.</p>;
  }

  if (!orderInfo) {
    return <p>Не удалось получить состав заказа.</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
