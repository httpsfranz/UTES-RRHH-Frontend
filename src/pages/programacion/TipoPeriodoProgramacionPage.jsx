import { CalendarRange, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
import PageContainer from '../../components/ui/PageContainer';
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
import TipoPeriodoProgramacionForm from './TipoPeriodoProgramacionForm';

const campoVacio = {
  TipoPeriodoProgramacionCodigo: '',
  TipoPeriodoProgramacionNombre: '',
  TipoPeriodoProgramacionDias: '',
  TipoPeriodoProgramacionDescripcion: '',
};

function mapToForm(tipo) {
  return {
    TipoPeriodoProgramacionCodigo: tipo.codigo ?? '',
    TipoPeriodoProgramacionNombre: tipo.nombre ?? '',
    TipoPeriodoProgramacionDias: tipo.dias ?? '',
    TipoPeriodoProgramacionDescripcion: tipo.descripcion ?? '',
  };
}

export default function TipoPeriodoProgramacionPage() {
  const {
    items, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/tipos-periodo-programacion',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el tipo de período.',
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de período de programación" subtitle="Programación · Tipo de período">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo de período
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de período…" />
      ) : items.length === 0 ? (
        <EmptyState icon={CalendarRange} message="No hay tipos de período registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={CalendarRange}
              active={item.activo}
              title={item.nombre}
              meta={[item.dias && `${item.dias} días`, item.descripcion]}
              footer={item.codigo}
              onEdit={() => abrirEditar(item)}
              onToggle={item.activo ? () => desactivar(item) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar tipo de período' : 'Nuevo tipo de período'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <TipoPeriodoProgramacionForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
