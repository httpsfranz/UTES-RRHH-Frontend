import { CalendarDays, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import CardGrid from '../../components/ui/CardGrid';
import EntityCard from '../../components/ui/EntityCard';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import CalendarioNoLaborableForm from './CalendarioNoLaborableForm';

const campoVacio = {
  MicroredId: '',
  CalendarioNoLaborableFecha: '',
  CalendarioNoLaborableTipo: '',
  CalendarioNoLaborableDescripcion: '',
  CalendarioNoLaborableCompensable: false,
  CalendarioNoLaborableNormaSustento: '',
};

function mapToForm(item) {
  return {
    MicroredId: item.microred_id ?? '',
    CalendarioNoLaborableFecha: item.fecha ?? '',
    CalendarioNoLaborableTipo: item.tipo ?? '',
    CalendarioNoLaborableDescripcion: item.descripcion ?? '',
    CalendarioNoLaborableCompensable: Boolean(item.compensable),
    CalendarioNoLaborableNormaSustento: item.norma_sustento ?? '',
  };
}

export default function CalendarioNoLaborablePage() {
  const {
    items, loading, error, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/calendario-no-laborable',
    emptyForm: campoVacio,
    mapToForm,
    buildConfirmMessage: (item) => `¿Eliminar el día no laborable del ${item.fecha}?`,
    deactivateErrorMessage: 'No se pudo eliminar el día no laborable.',
  });

  return (
    <PageContainer>
      <PageHeader title="Calendario no laborable" subtitle="Soporte · Día no laborable">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo día no laborable
        </Button>
      </PageHeader>

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando calendario no laborable…" />
      ) : items.length === 0 ? (
        <EmptyState icon={CalendarDays} message="No hay calendario no laborable registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={CalendarDays}
              title={item.fecha}
              meta={[item.descripcion, item.compensable && 'Compensable', item.norma_sustento]}
              footer={item.tipo}
              onEdit={() => abrirEditar(item)}
              onDelete={() => desactivar(item)}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar día no laborable' : 'Nuevo día no laborable'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <CalendarioNoLaborableForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
