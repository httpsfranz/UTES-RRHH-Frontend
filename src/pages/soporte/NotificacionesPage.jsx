import { lazy } from 'react';
import { Bell, BellRing, History } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Pestanas from '../../components/ui/Pestanas';

const BANDEJA = { id: 'bandeja', etiqueta: 'Mi bandeja', icono: Bell, pagina: lazy(() => import('./BandejaPage')) };
const ADMINISTRACION = [
  { id: 'historial', etiqueta: 'Historial y entrega', icono: History, pagina: lazy(() => import('./NotificacionPage')) },
  { id: 'tipos', etiqueta: 'Tipos y reglas de envío', icono: BellRing, pagina: lazy(() => import('./TipoNotificacionPage')) },
];

// Notificaciones: cada usuario ve su bandeja; quien administra la seguridad ve ademas el historial de todos (con el
// estado de entrega del correo y los reintentos) y define los tipos de aviso y a quien llegan.
export default function NotificacionesPage() {
  const auth = useAuth();
  const pestanas = auth.tiene('SEGURIDAD_VER') ? [BANDEJA, ...ADMINISTRACION] : [BANDEJA];

  return (
    <PageContainer>
      <PageHeader title="Notificaciones" subtitle="Avisos que genera el sistema en tu bandeja y, según el tipo, por correo." />
      <Pestanas pestanas={pestanas} />
    </PageContainer>
  );
}
