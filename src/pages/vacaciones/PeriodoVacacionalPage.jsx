import { Palmtree, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_PERIODO_VACACIONAL, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import PeriodoVacacionalForm from './PeriodoVacacionalForm';

// Solo se digita desde cuando corre el record: el fin, el año y los dias los calcula el backend.
const modelo = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  PeriodoVacacionalFechaInicio: 'fecha_inicio',
  PeriodoVacacionalEstado: ['estado', 'ABIERTO'],
});

const emptyForm = modelo.emptyForm;
const mapToForm = modelo.mapToForm;

const validate = validador({
  VinculoLaboralId: [requerido],
  PeriodoVacacionalFechaInicio: [requerido, fecha],
});

const noCerrado = (item) => item.estado === 'ABIERTO';
const noAnulado = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.vinculo?.eess?.nombre ?? '—' },
  { key: 'anio', header: 'Año' },
  { key: 'record', header: 'Récord', render: (item) => `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)}` },
  { key: 'dias_ganados', header: 'Ganados' },
  { key: 'dias_disponibles', header: 'Disponibles' },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_PERIODO_VACACIONAL, item.estado) },
];

const card = (item) => ({
  icon: Palmtree,
  title: item.trabajador?.nombre_completo ?? 'Período vacacional',
  meta: [`Récord ${item.anio}`, `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)}`, `${item.dias_disponibles} de ${item.dias_ganados} días disponibles`],
  footer: etiquetaDe(ESTADOS_PERIODO_VACACIONAL, item.estado),
});

export default function PeriodoVacacionalPage() {
  const crud = useCrudResource({
    endpoint: '/periodos-vacacionales',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular el período vacacional ${item.anio} de ${item.trabajador?.nombre_completo ?? ''}?`,
    deactivateErrorMessage: 'No se pudo anular el período vacacional.',
  });

  return (
    <PageContainer>
      <PageHeader title="Récord vacacional" subtitle="Vacaciones · Récord vacacional">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nuevo récord
          </Button>
        )}
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o documento…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando períodos vacacionales…"
        emptyIcon={Palmtree}
        emptyMessage="No hay períodos vacacionales registrados todavía."
        columns={columns}
        card={card}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Anular' }}
        puedeEditar={noCerrado}
        puedeAlternar={noAnulado}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar período vacacional' : 'Nuevo período vacacional'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <PeriodoVacacionalForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
    </PageContainer>
  );
}
