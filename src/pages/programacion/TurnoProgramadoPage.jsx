import { CalendarCheck, CircleCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { fecha, hora, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_TURNO_PROGRAMADO, etiquetaDe } from '../../utils/opciones';
import { formatoFecha, siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TurnoProgramadoForm from './TurnoProgramadoForm';

const { emptyForm, mapToForm } = formModel({
  ProgramacionTrabajadorId: 'programacion_trabajador_id',
  TurnoId: 'turno_id',
  TurnoProgramadoFecha: 'fecha',
  TurnoProgramadoHoraEntrada: 'hora_entrada',
  TurnoProgramadoHoraSalida: 'hora_salida',
  TurnoProgramadoEsGuardia: ['es_guardia', false],
  TurnoProgramadoObservacion: 'observacion',
});

// Minutos entre dos HH:MM; si la salida no es posterior a la entrada, el turno cruza la medianoche.
const minutos = (entrada, salida) => {
  const aMinutos = (valor) => Number(valor.slice(0, 2)) * 60 + Number(valor.slice(3, 5));
  const e = aMinutos(entrada);
  const s = aMinutos(salida);
  return s > e ? s - e : 1440 - (e - s);
};

const enBorrador = (item) => item.programacion_trabajador?.estado === 'BORRADOR';
const porCumplir = (item) => ['PROGRAMADO', 'REPROGRAMADO'].includes(item.estado) && item.programacion_trabajador?.estado === 'PUBLICADA';
const horario = (item) => {
  const entrada = item.hora_entrada ?? item.turno?.hora_entrada;
  const salida = item.hora_salida ?? item.turno?.hora_salida;
  return entrada && salida ? `${entrada} – ${salida}` : '—';
};

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'turno', header: 'Turno', render: (item) => item.turno?.nombre ?? '—' },
  { key: 'horario', header: 'Horario', render: horario },
  { key: 'guardia', header: 'Guardia', render: (item) => siNo(item.es_guardia) },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_TURNO_PROGRAMADO, item.estado) },
];

const card = (item) => ({
  icon: CalendarCheck,
  title: item.trabajador?.nombre_completo ?? 'Turno programado',
  meta: [`${formatoFecha(item.fecha)} · ${item.turno?.nombre ?? ''}`, horario(item), item.es_guardia && 'Guardia', item.observacion],
  footer: etiquetaDe(ESTADOS_TURNO_PROGRAMADO, item.estado),
});

export default function TurnoProgramadoPage() {
  const validate = validador({
    ProgramacionTrabajadorId: [requerido],
    TurnoId: [requerido],
    TurnoProgramadoFecha: [requerido, fecha],
    TurnoProgramadoHoraEntrada: [hora],
    TurnoProgramadoHoraSalida: [
      hora,
      (valor, form) => (form.TurnoProgramadoHoraEntrada && !valor ? 'Indica también la hora de salida, o deja ambas vacías.' : null),
      (valor, form) =>
        valor && !form.TurnoProgramadoHoraEntrada ? 'Indica también la hora de entrada, o deja ambas vacías.' : null,
      (valor, form) =>
        valor && form.TurnoProgramadoHoraEntrada && minutos(form.TurnoProgramadoHoraEntrada, valor) > 720
          ? 'Un turno dura como máximo 12 horas: no se programan guardias de 24 horas (RIT, Art. 20).'
          : null,
    ],
  });

  const crud = useCrudResource({
    endpoint: '/turnos-programados',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Retirar el turno del ${formatoFecha(item.fecha)} de ${item.trabajador?.nombre_completo ?? ''}?`,
    deactivateErrorMessage: 'No se pudo retirar el turno.',
  });
  const acciones = useAccionDeRegistro('/turnos-programados', { alTerminar: () => crud.cargar() });
  const cumplir = (item) => {
    if (window.confirm(`¿Marcar como cumplido el turno del ${formatoFecha(item.fecha)} de ${item.trabajador?.nombre_completo ?? ''}?`)) {
      acciones.ejecutar(item, { accion: 'cumplir' });
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Turnos programados" subtitle="Programación · Turnos programados">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Programar turno
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, documento u observación…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando turnos programados…"
        emptyIcon={CalendarCheck}
        emptyMessage="No hay turnos programados todavía."
        columns={columns}
        card={card}
        acciones={[{ icon: CircleCheck, label: 'Marcar cumplido', visible: porCumplir, onClick: cumplir }]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Retirar' }}
        puedeEditar={enBorrador}
        puedeAlternar={enBorrador}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar turno programado' : 'Programar turno'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TurnoProgramadoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
