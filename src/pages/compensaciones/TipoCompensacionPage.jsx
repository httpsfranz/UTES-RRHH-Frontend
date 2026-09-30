import { FileText, Plus } from 'lucide-react';
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
import TipoCompensacionForm from './TipoCompensacionForm';

const campoVacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
};

function mapToForm(tipo) {
  return {
    codigo: tipo.codigo ?? '',
    nombre: tipo.nombre ?? '',
    descripcion: tipo.descripcion ?? '',
  };
}

export default function TipoCompensacionPage() {
  const {
    items: tipos,
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
    desactivar,
  } = useCrudResource({
    endpoint: '/tipos-compensacion',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage:
      'No se pudo desactivar el tipo de compensación.',
  });

  return (
    <PageContainer>
      <PageHeader
        title="Tipos de Compensación"
        subtitle="Compensaciones · Tipo de compensación"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de compensación…" />
      ) : tipos.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="No hay tipos de compensación registrados todavía."
        />
      ) : (
        <CardGrid>
          {tipos.map((tipo) => (
            <EntityCard
              key={tipo.id}
              icon={FileText}
              active={tipo.activo}
              title={tipo.nombre}
              meta={[
                tipo.codigo && `Código: ${tipo.codigo}`,
                tipo.descripcion,
              ]}
              footer={`ID: ${tipo.id}`}
              onEdit={() => abrirEditar(tipo)}
              onToggle={
                tipo.activo
                  ? () => desactivar(tipo)
                  : undefined
              }
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={
          editando
            ? 'Editar tipo de compensación'
            : 'Nuevo tipo de compensación'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <TipoCompensacionForm
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
    </PageContainer>
  );
}