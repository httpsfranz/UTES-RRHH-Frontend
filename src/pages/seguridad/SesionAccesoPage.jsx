import { Clock } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';

const columns = [
  { key: 'inicio', header: 'Inicio', render: (item) => formatoFechaHora(item.fecha_inicio) },
  { key: 'usuario', header: 'Usuario', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'resultado', header: 'Resultado', render: (item) => item.resultado ?? '—' },
  { key: 'ip', header: 'Dirección IP', render: (item) => item.direccion_ip ?? '—' },
  { key: 'fin', header: 'Cierre', render: (item) => (item.fecha_fin ? formatoFechaHora(item.fecha_fin) : '—') },
];

// Las sesiones las escribe el inicio de sesion (cuando exista el login): aqui solo se consultan.
export default function SesionAccesoPage() {
  const crud = useCrudResource({ endpoint: '/sesiones-acceso', emptyForm: {}, limite: 100 });

  return (
    <PageContainer>
      <PageHeader title="Sesiones de acceso" subtitle="Seguridad · Sesión de acceso" />

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por usuario, IP o resultado…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando sesiones…"
        emptyIcon={Clock}
        emptyMessage="No hay sesiones de acceso registradas todavía."
        columns={columns}
      />
    </PageContainer>
  );
}
