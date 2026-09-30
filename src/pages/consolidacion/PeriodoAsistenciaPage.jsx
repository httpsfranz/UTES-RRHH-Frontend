import { CalendarDays, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import CardGrid from '../../components/ui/CardGrid';
import EntityCard from '../../components/ui/EntityCard';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import PeriodoAsistenciaForm from './PeriodoAsistenciaForm';

const campoVacio = {
  anio: '',
  mes: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'ABIERTO',
};

function mapToForm(periodo) {
  return {
    anio: periodo.anio ?? '',
    mes: periodo.mes ?? '',
    fechaInicio: periodo.fechaInicio ?? '',
    fechaFin: periodo.fechaFin ?? '',
    estado: periodo.estado ?? 'ABIERTO',
  };
}

function mapToPayload(form) {
  return {
    PeriodoAsistenciaAnio: form.anio,
    PeriodoAsistenciaMes: form.mes,
    PeriodoAsistenciaFechaInicio: form.fechaInicio,
    PeriodoAsistenciaFechaFin: form.fechaFin,
    PeriodoAsistenciaEstado: form.estado,
  };
}

export default function PeriodoAsistenciaPage() {
  const {
    items: periodos,
    loading,
    error,
    buscar,
    setBuscar,
    cargar,
    modalOpen,
    editando,
    form,
    setForm,
    erroresForm,
    guardando,
    abrirCrear,
    abrirEditar,
    cerrarModal,
    guardar,
  } = useCrudResource({
    endpoint: '/periodos-asistencia',
    emptyForm: campoVacio,
    mapToForm,
    mapToPayload,
    searchParam: 'buscar',
    saveErrorMessage:
      'No se pudo guardar el período de asistencia.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Períodos de Asistencia"
        subtitle="Consolidación · Período de asistencia"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo período
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando períodos de asistencia…" />
      ) : periodos.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          message="No hay períodos de asistencia registrados todavía."
        />
      ) : (
        <CardGrid>
          {periodos.map((periodo) => (
            <EntityCard
              key={periodo.id}
              icon={CalendarDays}
              active={periodo.estado === 'ABIERTO'}
              title={`${periodo.anio} - ${String(periodo.mes).padStart(2, '0')}`}
              meta={[
                periodo.fechaInicio &&
                  `Inicio: ${periodo.fechaInicio}`,
                periodo.fechaFin &&
                  `Fin: ${periodo.fechaFin}`,
                periodo.estado &&
                  `Estado: ${periodo.estado}`,
              ]}
              footer={`ID: ${periodo.id}`}
              onEdit={() => abrirEditar(periodo)}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={
          editando
            ? 'Editar período de asistencia'
            : 'Nuevo período de asistencia'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <PeriodoAsistenciaForm
            form={form}
            setForm={setForm}
            errors={erroresForm}
          />

          <FormActions
            onCancel={cerrarModal}
            submitting={guardando}
          />
        </Form>
      </Modal>
    </div>
  );
}