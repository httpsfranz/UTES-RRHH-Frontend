import { useState } from 'react';
import { Clock, Upload } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import Button from '../../components/ui/Button';
import ImportarMarcacionesModal from './ImportarMarcacionesModal';
import { useCrudResource } from '../../hooks/useCrudResource';
import { TIPOS_MARCACION, etiquetaDe } from '../../utils/opciones';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.vinculo?.eess?.nombre ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_MARCACION, item.tipo) },
  { key: 'metodo', header: 'Método', render: (item) => item.metodo?.nombre ?? '—' },
  { key: 'observacion', header: 'Registrada por', render: (item) => item.observacion ?? '—' },
];

const card = (item) => ({
  icon: Clock,
  title: etiquetaDe(TIPOS_MARCACION, item.tipo),
  meta: [formatoFechaHora(item.fecha_hora), item.trabajador?.nombre_completo, item.metodo?.nombre, item.observacion],
  footer: item.es_valida ? (item.origen ?? 'Válida') : 'Marcación inválida',
});

/**
 * Historial de marcaciones (solo consulta). Las marcas se registran desde Control de asistencia con la hora del sistema
 * y no se editan: un error de marcacion se corrige con una solicitud en "Ajustes de marcación" (con aprobacion).
 */
export default function MarcacionPage() {
  const auth = useAuth();
  const [importando, setImportando] = useState(false);
  const crud = useCrudResource({
    endpoint: '/marcaciones',
    emptyForm: {},
    // Decenas de miles de marcaciones: se traen las 300 mas recientes (el total real se muestra y la busqueda consulta al servidor).
    limite: 300,
  });

  return (
    <PageContainer>
      <PageHeader title="Historial de marcaciones" subtitle="Consulta de las marcas registradas (facial o manual).">
        {auth.tiene('ASISTENCIA_EDITAR') && (
          <Button variant="secondary" icon={Upload} onClick={() => setImportando(true)}>
            Importar del reloj
          </Button>
        )}
      </PageHeader>
      <ImportarMarcacionesModal open={importando} onClose={() => setImportando(false)} onImportado={() => crud.cargar()} />

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} placeholder="Buscar por trabajador, documento u observación…" />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando marcaciones…"
        emptyIcon={Clock}
        emptyMessage="No hay marcaciones registradas todavía."
        columns={columns}
        card={card}
        isActive={(item) => item.es_valida}
        etiquetas={{ activo: 'Válida', inactivo: 'Inválida' }}
      />
    </PageContainer>
  );
}
