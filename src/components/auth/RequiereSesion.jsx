import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import LoadingState from '../ui/LoadingState';

// Puerta de la aplicacion: sin sesion se va al login (y vuelve a donde iba al ingresar).
export default function RequiereSesion() {
  const { autenticado, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <LoadingState message="Verificando sesión…" />;
  if (!autenticado) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  return <Outlet />;
}
