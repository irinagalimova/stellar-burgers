import { clearConstructor } from '@/services/slices/constructorSlice';
import { fetchFeeds } from '@/services/slices/feedSlice';
import { createOrder, resetOrder } from '@/services/slices/orderSlice';
import { fetchProfileOrders } from '@/services/slices/profileOrdersSlice';
import { useSelector, useDispatch } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.isLoading);
  const orderModalData = useSelector((state) => state.order.order);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderError = useSelector((state) => state.order.error);
  const location = useLocation();

  const onOrderClick = (): void => {
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredients))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        void dispatch(fetchFeeds());
        void dispatch(fetchProfileOrders());
      })
      .catch(() => {
        // Ошибка сохранена в store и отображается ниже через orderError.
      });
  };

  const closeOrderModal = (): void => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {!!orderError && (
        <p role="alert">Не удалось оформить заказ. Попробуйте ещё раз.</p>
      )}
    </>
  );
};
