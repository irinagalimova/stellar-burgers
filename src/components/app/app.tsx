import { fetchIngredients } from '@/services/slices/ingredientSlice';
import { checkUserAuth } from '@/services/slices/userSlice';
import { useDispatch } from '@/services/store';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
} from '@pages';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useMatch } from 'react-router-dom';

import { ProtectedRoute } from '../protected-route/protected-route';

import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />
      <RouteComponent />
    </div>
  );
};

export default App;

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const handleClose = (): void => {
    void navigate(-1);
  };

  const location = useLocation();
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  const feedOrderMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');

  const orderNumber = feedOrderMatch?.params.number ?? profileOrderMatch?.params.number;

  const orderTitle = orderNumber ? `#${orderNumber.padStart(6, '0')}` : '';

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
        <Route
          path="/feed/:number"
          element={
            <main className={styles.detailPageWrap}>
              <h2 className={clsx(styles.detailHeader, 'text text_type_digits-default')}>
                {orderTitle}
              </h2>
              <OrderInfo />
            </main>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <main className={styles.detailPageWrap}>
              <h2 className={clsx(styles.detailHeader, 'text text_type_main-large')}>
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </main>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <main className={styles.detailPageWrap}>
                <h2
                  className={clsx(styles.detailHeader, 'text text_type_digits-default')}
                >
                  {orderTitle}
                </h2>
                <OrderInfo />
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title={orderTitle} onClose={handleClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title={orderTitle} onClose={handleClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
