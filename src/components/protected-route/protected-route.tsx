import { useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import type { Location } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.ReactElement => {
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();
  const state = location.state as { from?: Location } | null;
  const from = state?.from;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={from ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
