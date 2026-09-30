import { Fingerprint, Plus } from 'lucide-react';
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
import MetodoMarcacionForm from './MetodoMarcacionForm';

const campoVacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
};

// Aca el form y la respuesta ya comparten los mismos nombres de campo (codigo,
// nombre, descripcion), asi que el mapeo de edicion es practicamente identidad;
// se deja explicito igual para no depender de que el objeto de la API no traiga
// campos extra que no queremos meter tal cual al form.
function mapToForm(metodo) {
  return {
    codigo: metodo.codigo ?? '',
    nombre: metodo.nombre ?? '',
    descripcion: metodo.descripcion ?? '',
  };
}

export default function MetodoMarcacionPage() {
  const {
    items: metodos,
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
    endpoint: '/metodos-marcacion',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el método de marcación.',
  });

  return (
    <PageContainer>
      <PageHeader title="Métodos de Marcación" subtitle="Biometría · Método de marcación">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo método
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando métodos de marcación…" />
      ) : metodos.length === 0 ? (
        <EmptyState icon={Fingerprint} message="No hay métodos de marcación registrados todavía." />
      ) : (
        <CardGrid>
          {metodos.map((metodo) => (
            <EntityCard
              key={metodo.id}
              icon={Fingerprint}
              active={metodo.activo}
              title={metodo.nombre}
              meta={[metodo.codigo && `Código: ${metodo.codigo}`, metodo.descripcion]}
              footer={`ID: ${metodo.id}`}
              onEdit={() => abrirEditar(metodo)}
              onToggle={metodo.activo ? () => desactivar(metodo) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar método de marcación' : 'Nuevo método de marcación'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <MetodoMarcacionForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
