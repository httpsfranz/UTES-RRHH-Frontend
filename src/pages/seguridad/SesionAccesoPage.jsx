import { Ban, Clock } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';

const RESULTADOS = { EXITOSO: 'Ingreso correcto', CLAVE_INCORRECTA: 'Contraseña incorrecta', USUARIO_INACTIVO: 'Cuenta desactivada', USUARIO_BLOQUEADO: 'Cuenta bloqueada' };
const CIERRES = { LOGOUT: 'Cerró sesión', EXPIRADA: 'Venció', INACTIVIDAD: 'Por inactividad', REVOCADA: 'Revocada', BLOQUEO: 'Por bloqueo de la cuenta' };

const estado = (item) => {
  if (item.abierta) return 'Abierta';
  if (item.resultado !== 'EXITOSO') return 'Intento fallido';
  return CIERRES[item.motivo_cierre] ?? 'Cerrada';
};

const columns = [
  { key: 'inicio', header: 'Inicio', render: (item) => formatoFechaHora(item.fecha_inicio) },
  { key: 'usuario', header: 'Usuario', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'resultado', header: 'Intento', render: (item) => RESULTADOS[item.resultado] ?? item.resultado ?? '—' },
  { key: 'estado', header: 'Sesión', render: estado },
  { key: 'actividad', header: 'Última actividad', render: (item) => (item.ultima_actividad ? formatoFechaHora(item.ultima_actividad) : '—') },
  { key: 'fin', header: 'Cierre', render: (item) => (item.fecha_fin ? `${formatoFechaHora(item.fecha_fin)}${item.revocada_por ? ` · por ${item.revocada_por}` : ''}` : '—') },
  { key: 'ip', header: 'IP', render: (item) => item.direccion_ip ?? '—' },
];

/**
 * Sesiones de acceso: cada intento de ingreso (correcto o no) y como termino la sesion (cierre, vencimiento,
 * inactividad, revocacion o bloqueo). Una sesion abierta se puede revocar: su token deja de servir de inmediato.
 */
export default function SesionAccesoPage() {
  const crud = useCrudResource({ endpoint: '/sesiones-acceso', emptyForm: {}, limite: 100 });
  const acciones = useAccionDeRegistro('/sesiones-acceso', { alTerminar: () => crud.cargar() });

  function revocar(item) {
    if (!window.confirm(`¿Revocar la sesión de ${item.usuario?.nombre ?? ''} iniciada el ${formatoFechaHora(item.fecha_inicio)}?`)) return;
    acciones.ejecutar(item, { accion: 'revocar' });
  }

  return (
    <PageContainer>
      <PageHeader title="Sesiones de acceso" subtitle="Ingresos al sistema, intentos fallidos y cierre de cada sesión (expira tras 30 min sin actividad)." />

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} placeholder="Buscar por usuario, IP o resultado…" />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando sesiones…"
        emptyIcon={Clock}
        emptyMessage="No hay sesiones de acceso registradas todavía."
        columns={columns}
        isActive={() => undefined}
        acciones={[{ icon: Ban, label: 'Revocar sesión', visible: (item) => acciones.puede('revocar') && item.abierta, onClick: revocar }]}
      />
    </PageContainer>
  );
}
