import { Clock, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, duracionDeTurno, entero, hora, requerido } from '../../utils/validaciones';
import { siNo } from '../../utils/formato';
import { formatoDuracion } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TurnoForm from './TurnoForm';

const { emptyForm, mapToForm } = formModel({
  TurnoCodigo: 'codigo',
  TurnoNombre: 'nombre',
  TipoJornadaId: 'tipo_jornada_id',
  TablaToleranciaId: 'tabla_tolerancia_id',
  TurnoHoraEntrada: 'hora_entrada',
  TurnoHoraSalida: 'hora_salida',
  TurnoToleranciaEntradaMinutos: ['tolerancia_entrada_minutos', '5'],
  TurnoToleranciaSalidaMinutos: ['tolerancia_salida_minutos', '0'],
  TurnoRefrigerioMinutos: ['refrigerio_minutos', '0'],
  TurnoPermiteHoraExtra: ['permite_hora_extra', false],
  TurnoEsGuardia: ['es_guardia', false],
});

const validate = validador({
  TurnoCodigo: [requerido, codigo],
  TurnoNombre: [requerido],
  TipoJornadaId: [requerido],
  TurnoHoraEntrada: [requerido, hora],
  TurnoHoraSalida: [requerido, hora, duracionDeTurno('TurnoHoraEntrada', 'TurnoEsGuardia')],
  TurnoToleranciaEntradaMinutos: [requerido, entero({ min: 0, max: 120 })],
  TurnoToleranciaSalidaMinutos: [requerido, entero({ min: 0, max: 120 })],
  TurnoRefrigerioMinutos: [requerido, entero({ min: 0, max: 120 })],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'horario', header: 'Horario', render: (item) => `${item.hora_entrada} – ${item.hora_salida}` },
  { key: 'duracion', header: 'Duración', render: (item) => formatoDuracion(item.duracion_minutos) },
  { key: 'tolerancia', header: 'Tolerancia', render: (item) => `${item.tolerancia_entrada_minutos} min` },
  { key: 'jornada', header: 'Jornada', render: (item) => item.tipo_jornada?.nombre ?? '—' },
  { key: 'es_guardia', header: 'Guardia', render: (item) => siNo(item.es_guardia) },
];

const card = (item) => ({
  icon: Clock,
  title: item.nombre,
  meta: [`${item.hora_entrada} – ${item.hora_salida} (${formatoDuracion(item.duracion_minutos)})`, item.tipo_jornada?.nombre, item.cruza_medianoche && 'Cruza la medianoche', item.es_guardia && 'Turno de guardia', item.refrigerio_minutos > 0 && `Refrigerio de ${item.refrigerio_minutos} min`],
  footer: item.codigo,
});

export default function TurnoPage() {
  const crud = useCrudResource({
    endpoint: '/turnos',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TurnoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Turnos" subtitle="Configuración · Turno">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo turno
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando turnos…"
        emptyIcon={Clock}
        emptyMessage="No hay turnos registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar turno' : 'Nuevo turno'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TurnoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
