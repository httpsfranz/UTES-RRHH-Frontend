import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { puedeAbrir } from '../../nav/acceso';
import EmptyState from '../ui/EmptyState';

// Protege una pantalla por su ruta: si el rol no la tiene asignada se muestra el aviso en vez de la pagina.
export default function RequierePermiso({ path, children }) {
  const auth = useAuth();
  if (!puedeAbrir(auth, path)) {
    return <EmptyState icon={ShieldAlert} message="No tienes permiso para abrir esta pantalla. Si la necesitas, solicítala a Recursos Humanos." />;
  }
  return children;
}
