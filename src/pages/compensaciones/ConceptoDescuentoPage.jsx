import { FileText, Plus } from 'lucide-react';
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
import ConceptoDescuentoForm from './ConceptoDescuentoForm';

const campoVacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
};

function mapToForm(concepto) {
  return {
    codigo: concepto.codigo ?? '',
    nombre: concepto.nombre ?? '',
    descripcion: concepto.descripcion ?? '',
  };
}

export default function ConceptoDescuentoPage() {
  const {
    items: conceptos,
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
    endpoint: '/conceptos-descuento',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el concepto de descuento.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Conceptos de Descuento"
        subtitle="Compensaciones · Concepto de descuento"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo concepto
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando conceptos de descuento…" />
      ) : conceptos.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="No hay conceptos de descuento registrados todavía."
        />
      ) : (
        <CardGrid>
          {conceptos.map((concepto) => (
            <EntityCard
              key={concepto.id}
              icon={FileText}
              active={concepto.activo}
              title={concepto.nombre}
              meta={[
                concepto.codigo && `Código: ${concepto.codigo}`,
                concepto.descripcion,
              ]}
              footer={`ID: ${concepto.id}`}
              onEdit={() => abrirEditar(concepto)}
              onToggle={
                concepto.activo
                  ? () => desactivar(concepto)
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
            ? 'Editar concepto de descuento'
            : 'Nuevo concepto de descuento'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <ConceptoDescuentoForm
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