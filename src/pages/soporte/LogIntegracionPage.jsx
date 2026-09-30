import { Plug } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Table from '../../components/ui/Table';

const columnas = [
  { key: 'fecha_hora', header: 'Fecha y hora' },
  { key: 'sistema_externo', header: 'Sistema' },
  { key: 'operacion', header: 'Operación' },
  { key: 'direccion', header: 'Dirección' },
  { key: 'resultado', header: 'Resultado' },
  { key: 'reintentos', header: 'Reintentos' },
  { key: 'mensaje_error', header: 'Error' },
];

// Solo lectura: los escriben los procesos internos (ver LogIntegracionController),
// asi que no hay modal ni acciones; se reutiliza el hook solo para cargar y filtrar.
export default function LogIntegracionPage() {
  const { items, loading, error, buscar, setBuscar, cargar } = useCrudResource({
    endpoint: '/logs-integracion',
    searchParam: 'sistema_externo',
    emptyForm: {},
  });

  return (
    <PageContainer>
      <PageHeader title="Logs de integración" subtitle="Soporte · Log de integración" />

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
        placeholder="Filtrar por sistema externo…"
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando logs de integración…" />
      ) : items.length === 0 ? (
        <EmptyState icon={Plug} message="No hay logs de integración registrados." />
      ) : (
        <Table columns={columnas} rows={items} />
      )}
    </PageContainer>
  );
}
