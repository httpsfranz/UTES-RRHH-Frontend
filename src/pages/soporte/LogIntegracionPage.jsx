import { Plug } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
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
  const crud = useCrudResource({
    endpoint: '/logs-integracion',
    searchParam: 'sistema_externo',
    emptyForm: {},
    limite: 100,
  });

  return (
    <PageContainer>
      <PageHeader title="Logs de integración" subtitle="Soporte · Log de integración" />

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Filtrar por sistema externo…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando logs de integración…"
        emptyIcon={Plug}
        emptyMessage="No hay logs de integración registrados."
        columns={columns}
      />
    </PageContainer>
  );
}
