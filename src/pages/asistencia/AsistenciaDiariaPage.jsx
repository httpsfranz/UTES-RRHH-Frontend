import { CalendarCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { entero, fecha, noFutura, requerido, validador } from '../../utils/validaciones';
import { aCampoFecha, formatoFecha, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import AsistenciaDiariaForm from './AsistenciaDiariaForm';

const modelo = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  EstadoAsistenciaId: 'estado_asistencia_id',
  AsistenciaDiariaFecha: 'fecha',
  AsistenciaDiariaHoraEntrada: 'hora_entrada',
  AsistenciaDiariaHoraSalida: 'hora_salida',
  AsistenciaDiariaMinutosTardanza: ['minutos_tardanza', 0],
  AsistenciaDiariaMinutosFalta: ['minutos_falta', 0],
  AsistenciaDiariaMinutosExtra: ['minutos_extra', 0],
  // Vacio = el backend lo calcula (salida - entrada). Al editar tambien arranca vacio para recalcularse.
  AsistenciaDiariaMinutosTrabajados: 'minutos_trabajados_manual',
  AsistenciaDiariaObservacion: 'observacion',
});

const emptyForm = modelo.emptyForm;
const mapToForm = (item) => ({
  ...modelo.mapToForm(item),
  AsistenciaDiariaHoraEntrada: aCampoFecha(item.hora_entrada),
  AsistenciaDiariaHoraSalida: aCampoFecha(item.hora_salida),
  AsistenciaDiariaMinutosTardanza: String(item.minutos_tardanza ?? 0),
  AsistenciaDiariaMinutosFalta: String(item.minutos_falta ?? 0),
  AsistenciaDiariaMinutosExtra: String(item.minutos_extra ?? 0),
});

const minutos = entero({ min: 0, max: 1440 });

const validate = validador({
  VinculoLaboralId: [requerido],
  EstadoAsistenciaId: [requerido],
  AsistenciaDiariaFecha: [requerido, fecha, noFutura('La asistencia no puede registrarse para una fecha futura.')],
  AsistenciaDiariaHoraSalida: [(valor, form) => (form.AsistenciaDiariaHoraEntrada && valor < form.AsistenciaDiariaHoraEntrada ? 'La salida no puede ser anterior a la entrada.' : null)],
  AsistenciaDiariaMinutosTardanza: [minutos],
  AsistenciaDiariaMinutosFalta: [minutos],
  AsistenciaDiariaMinutosExtra: [minutos],
  AsistenciaDiariaMinutosTrabajados: [minutos],
});

const horas = (item) =>
  item.hora_entrada ? `${formatoFechaHora(item.hora_entrada).slice(11)} – ${item.hora_salida ? formatoFechaHora(item.hora_salida).slice(11) : 'sin salida'}` : '—';

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'estado', header: 'Estado', render: (item) => item.estado?.nombre ?? '—' },
  { key: 'horas', header: 'Entrada – salida', render: horas },
  { key: 'minutos_tardanza', header: 'Tardanza (min)' },
  { key: 'minutos_trabajados', header: 'Trabajados (min)' },
];

const card = (item) => ({
  icon: CalendarCheck,
  title: item.trabajador?.nombre_completo ?? 'Asistencia',
  meta: [`${formatoFecha(item.fecha)} · ${item.estado?.nombre ?? ''}`, horas(item), item.minutos_tardanza > 0 && `Tardanza de ${item.minutos_tardanza} min`, item.observacion],
  footer: item.justificacion_falta_id ? 'Falta justificada' : `${item.minutos_trabajados} min trabajados`,
});

export default function AsistenciaDiariaPage() {
  const crud = useCrudResource({
    endpoint: '/asistencia-diaria',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Eliminar la asistencia de ${item.trabajador?.nombre_completo ?? ''} del ${formatoFecha(item.fecha)}?`,
    deactivateErrorMessage: 'No se pudo eliminar la asistencia.',
  });

  return (
    <PageContainer>
      <PageHeader title="Asistencia diaria" subtitle="Asistencia · Asistencia diaria">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva asistencia
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
        loadingMessage="Cargando asistencia diaria…"
        emptyIcon={CalendarCheck}
        emptyMessage="No hay asistencia diaria registrada todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar asistencia diaria' : 'Nueva asistencia diaria'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <AsistenciaDiariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
