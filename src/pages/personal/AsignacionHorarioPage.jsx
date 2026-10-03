import { CalendarClock, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, noAnteriorA, requerido, validador } from '../../utils/validaciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import AsignacionHorarioForm from './AsignacionHorarioForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  HorarioId: 'horario_id',
  AsignacionHorarioFechaInicio: 'fecha_inicio',
  AsignacionHorarioFechaFin: 'fecha_fin',
  AsignacionHorarioObservacion: 'observacion',
});

const validate = validador({
  VinculoLaboralId: [requerido],
  HorarioId: [requerido],
  AsignacionHorarioFechaInicio: [requerido, fecha],
  AsignacionHorarioFechaFin: [fecha, noAnteriorA('AsignacionHorarioFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
});

const vigencia = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'sin fin'}`;

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'horario', header: 'Horario', render: (item) => item.horario?.nombre ?? '—' },
  { key: 'vigencia', header: 'Vigencia', render: vigencia },
];

const card = (item) => ({
  icon: CalendarClock,
  title: item.trabajador?.nombre_completo ?? 'Asignación de horario',
  meta: [item.horario?.nombre, vigencia(item), item.observacion],
  footer: item.horario?.codigo,
});

export default function AsignacionHorarioPage() {
  const crud = useCrudResource({
    endpoint: '/asignaciones-horario',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'AsignacionHorarioEstado',
    buildConfirmMessage: (item) => `¿Desactivar la asignación de "${item.horario?.nombre ?? ''}" a ${item.trabajador?.nombre_completo ?? ''}?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Asignación de horario" subtitle="Personal · Asignación de horario">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva asignación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador u observación…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando asignaciones…"
        emptyIcon={CalendarClock}
        emptyMessage="No hay horarios asignados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar asignación de horario' : 'Nueva asignación de horario'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <AsignacionHorarioForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
