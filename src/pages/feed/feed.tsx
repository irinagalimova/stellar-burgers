import { fetchFeeds } from '@/services/slices/feedSlice';
import { useSelector, useDispatch } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders);
  const isLoading = useSelector((state) => state.feed.isLoading);
  const error = useSelector((state) => state.feed.error);

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);
  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Не удалось загрузить ленту. Попробуйте позже.</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
