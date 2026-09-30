import { History } from 'lucide-react';
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
  { key: 'usuario_id', header: 'Usuario' },
  { key: 'esquema', header: 'Esquema' },
  { key: 'tabla', header: 'Tabla' },
  { key: 'operacion', header: 'Operación' },
  { key: 'registro_id', header: 'Registro' },
  { key: 'direccion_ip', header: 'IP' },
];

// Solo lectura: nadie crea ni edita auditoria via API (ver AuditoriaController).
// Se reutiliza el hook solo para cargar y filtrar por tabla.
export default function AuditoriaPage() {
  const { items, loading, error, buscar, setBuscar, cargar } = useCrudResource({
    endpoint: '/auditoria',
    searchParam: 'tabla',
    emptyForm: {},
  });

  return (
    <PageContainer>
      <PageHeader title="Auditoría" subtitle="Seguridad · Auditoría" />

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
        placeholder="Filtrar por tabla…"
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando auditoría…" />
      ) : items.length === 0 ? (
        <EmptyState icon={History} message="No hay registros de auditoría." />
      ) : (
        <Table columns={columnas} rows={items} />
      )}
    </PageContainer>
  );
}
