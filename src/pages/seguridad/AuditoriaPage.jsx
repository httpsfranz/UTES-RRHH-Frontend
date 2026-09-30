import { History } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'usuario_id', header: 'Usuario' },
  { key: 'esquema', header: 'Esquema' },
  { key: 'tabla', header: 'Tabla' },
  { key: 'operacion', header: 'Operación' },
  { key: 'registro_id', header: 'Registro' },
  { key: 'direccion_ip', header: 'IP' },
];

// Solo lectura: nadie crea ni edita auditoria via API (ver AuditoriaController).
// Se reutiliza el hook solo para cargar y filtrar por tabla; `limite` evita traer miles de filas.
export default function AuditoriaPage() {
  const crud = useCrudResource({
    endpoint: '/auditoria',
    searchParam: 'tabla',
    emptyForm: {},
    limite: 100,
  });

  return (
    <PageContainer>
      <PageHeader title="Auditoría" subtitle="Seguridad · Auditoría" />

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Filtrar por tabla…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando auditoría…"
        emptyIcon={History}
        emptyMessage="No hay registros de auditoría."
        columns={columns}
      />
    </PageContainer>
  );
}
