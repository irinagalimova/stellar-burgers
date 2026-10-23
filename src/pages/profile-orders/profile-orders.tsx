import { fetchProfileOrders } from '@/services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const orders = useSelector((state) => state.profileOrders.orders);
  const isLoading = useSelector((state) => state.profileOrders.isLoading);
  const error = useSelector((state) => state.profileOrders.error);
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }
  if (error) {
    return <p>Не удалось загрузить историю заказов </p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
