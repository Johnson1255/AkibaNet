import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  redirectPath?: string;
}

export const PrivateRoute = ({ redirectPath = '/login' }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-700">Verificando sesión...</p>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login y guardar la URL actual para redirección posterior
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar la ruta protegida
  return <Outlet />;
};

export const PublicRoute = ({ redirectPath = '/home' }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-700">Cargando...</p>
      </div>
    );
  }

  // Si está autenticado y trata de acceder a una ruta pública (como login),
  // redirigir al home (o la ruta especificada)
  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
