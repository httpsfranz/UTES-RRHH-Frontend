import { Plus, UsersRound } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { requerido, validador } from '../../utils/validaciones';
import { ESTADOS_PROGRAMACION, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ProgramacionTrabajadorForm from './ProgramacionTrabajadorForm';

const { emptyForm, mapToForm } = formModel({
  ProgramacionPeriodoId: 'programacion_periodo_id',
  VinculoLaboralId: 'vinculo_laboral_id',
  ProgramacionTrabajadorObservacion: 'observacion',
});

const borrador = (item) => item.estado === 'BORRADOR';
const periodo = (item) => (item.periodo ? `${formatoFecha(item.periodo.fecha_inicio)} – ${formatoFecha(item.periodo.fecha_fin)}` : '—');
const horas = (item) => (item.horas_programadas ? `${item.horas_programadas} h` : '0 h');

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'periodo', header: 'Período', render: periodo },
  { key: 'turnos', header: 'Turnos', render: (item) => String(item.turnos_programados ?? 0) },
  { key: 'horas', header: 'Horas programadas', render: horas },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_PROGRAMACION, item.estado) },
];

const card = (item) => ({
  icon: UsersRound,
  title: item.trabajador?.nombre_completo ?? 'Trabajador programado',
  meta: [periodo(item), `${item.turnos_programados ?? 0} turnos · ${horas(item)}`, item.observacion],
  footer: etiquetaDe(ESTADOS_PROGRAMACION, item.estado),
});

export default function ProgramacionTrabajadorPage() {
  const validate = validador({
    ProgramacionPeriodoId: [requerido],
    VinculoLaboralId: [requerido],
  });

  const crud = useCrudResource({
    endpoint: '/programaciones-trabajador',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Retirar a ${item.trabajador?.nombre_completo ?? 'este trabajador'} de la programación? Se retiran también sus turnos.`,
    deactivateErrorMessage: 'No se pudo retirar al trabajador de la programación.',
  });

  return (
    <PageContainer>
      <PageHeader title="Trabajadores programados" subtitle="Programación · Trabajadores programados">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Agregar trabajador
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
        loadingMessage="Cargando trabajadores programados…"
        emptyIcon={UsersRound}
        emptyMessage="No hay trabajadores programados todavía."
        columns={columns}
        card={card}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Retirar' }}
        puedeEditar={borrador}
        puedeAlternar={borrador}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar programación del trabajador' : 'Agregar trabajador a la programación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ProgramacionTrabajadorForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
