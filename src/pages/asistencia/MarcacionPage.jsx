import { Clock, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fechaHoraNoFutura, requerido, unoDe, validador } from '../../utils/validaciones';
import { TIPOS_MARCACION, etiquetaDe, valoresDe } from '../../utils/opciones';
import { aCampoFecha, ahoraLocal, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import MarcacionForm from './MarcacionForm';

const modelo = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  MetodoMarcacionId: 'metodo_marcacion_id',
  DispositivoMarcacionId: 'dispositivo_marcacion_id',
  CargaAsistenciaManualId: 'carga_asistencia_manual_id',
  MarcacionFechaHora: 'fecha_hora',
  MarcacionTipo: ['tipo', 'ENTRADA'],
  MarcacionGeolocalizacion: 'geolocalizacion',
  MarcacionObservacion: 'observacion',
});

const emptyForm = () => ({ ...modelo.emptyForm, MarcacionFechaHora: ahoraLocal() });
const mapToForm = (item) => ({ ...modelo.mapToForm(item), MarcacionFechaHora: aCampoFecha(item.fecha_hora) });

const geolocalizacion = (valor) =>
  /^-?\d{1,2}(\.\d+)?,\s?-?\d{1,3}(\.\d+)?$/.test(valor) ? null : 'Usa el formato "latitud,longitud" (por ejemplo -8.1116,-79.0288).';

const validate = validador({
  VinculoLaboralId: [requerido],
  MetodoMarcacionId: [requerido],
  MarcacionTipo: [requerido, unoDe(valoresDe(TIPOS_MARCACION))],
  MarcacionFechaHora: [requerido, (valor) => fechaHoraNoFutura(valor)?.replace('La ocurrencia', 'La marcación')],
  MarcacionGeolocalizacion: [geolocalizacion],
});

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_MARCACION, item.tipo) },
  { key: 'metodo', header: 'Método', render: (item) => item.metodo?.nombre ?? '—' },
  { key: 'origen', header: 'Origen', render: (item) => item.origen ?? '—' },
];

const card = (item) => ({
  icon: Clock,
  title: etiquetaDe(TIPOS_MARCACION, item.tipo),
  meta: [formatoFechaHora(item.fecha_hora), item.trabajador?.nombre_completo, item.metodo?.nombre, item.dispositivo?.nombre, item.observacion],
  footer: item.es_valida ? (item.origen ?? 'Válida') : 'Marcación inválida',
});

export default function MarcacionPage() {
  const crud = useCrudResource({
    endpoint: '/marcaciones',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'MarcacionEsValida',
    buildConfirmMessage: (item) => `¿Invalidar la marcación de ${item.trabajador?.nombre_completo ?? ''} del ${formatoFechaHora(item.fecha_hora)}?`,
    deactivateErrorMessage: 'No se pudo invalidar la marcación.',
  });

  return (
    <PageContainer>
      <PageHeader title="Marcaciones" subtitle="Asistencia · Marcación">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva marcación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, documento u observación…"
      />

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
        etiquetas={{ activo: 'Válida', inactivo: 'Inválida', desactivar: 'Invalidar' }}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar marcación' : 'Nueva marcación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <MarcacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
