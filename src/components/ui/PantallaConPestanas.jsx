import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageContainer from './PageContainer';
import PageHeader from './PageHeader';
import EmptyState from './EmptyState';
import Pestanas from './Pestanas';

/**
 * Una entrada del menu que reune varias pantallas de la misma tarea como pestanas (p. ej. "Registrar solicitudes":
 * papeletas, licencias, descansos...). Cada pestana declara el permiso que necesita y solo se muestran las que la sesion
 * puede ver. `?pestana=id` abre una en particular (la usan las rutas antiguas y los enlaces de las notificaciones).
 *
 *   pestanas  [{ id, etiqueta, icono, pagina, permiso? }]   permiso: codigo o lista (basta uno); sin el, cualquiera
 */
export default function PantallaConPestanas({ titulo, subtitulo, pestanas }) {
  const auth = useAuth();
  const [params] = useSearchParams();
  const permitida = ({ permiso }) => !permiso || [permiso].flat().some((p) => auth.tiene(p));
  const visibles = pestanas.filter(permitida);
  const pedida = params.get('pestana');

  return (
    <PageContainer>
      <PageHeader title={titulo} subtitle={subtitulo} />
      {visibles.length === 0 ? (
        <EmptyState message="No tienes permiso para ninguna de estas pantallas." />
      ) : (
        <Pestanas key={pedida ?? ''} pestanas={visibles} inicial={visibles.some((p) => p.id === pedida) ? pedida : undefined} />
      )}
    </PageContainer>
  );
}
