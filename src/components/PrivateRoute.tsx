import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  redirectPath?: string;
}

export const PrivateRoute = ({ redirectPath = '/login' }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir al login y guardar la URL actual para redirección posterior
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar la ruta protegida
  return <Outlet />;
};

export const PublicRoute = ({ redirectPath = '/home' }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  // Si está autenticado y trata de acceder a una ruta pública (como login),
  // redirigir al home (o la ruta especificada)
  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
