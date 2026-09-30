import { Settings2, Plus } from 'lucide-react';
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
import ParametroSistemaForm from './ParametroSistemaForm';

const campoVacio = {
  codigo: '',
  valor: '',
  descripcion: '',
};

function mapToForm(parametro) {
  return {
    codigo: parametro.codigo ?? '',
    valor: parametro.valor ?? '',
    descripcion: parametro.descripcion ?? '',
  };
}

export default function ParametroSistemaPage() {
  const {
    items: parametros,
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
    endpoint: '/parametros-sistema',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage:
      'No se pudo desactivar el parámetro del sistema.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Parámetros del Sistema"
        subtitle="Configuración · Parámetros del sistema"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo parámetro
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando parámetros del sistema…" />
      ) : parametros.length === 0 ? (
        <EmptyState
          icon={Settings2}
          message="No hay parámetros del sistema registrados todavía."
        />
      ) : (
        <CardGrid>
          {parametros.map((parametro) => (
            <EntityCard
              key={parametro.id}
              icon={Settings2}
              active={parametro.activo}
              title={parametro.codigo}
              meta={[
                parametro.valor && `Valor: ${parametro.valor}`,
                parametro.descripcion,
              ]}
              footer={`ID: ${parametro.id}`}
              onEdit={() => abrirEditar(parametro)}
              onToggle={
                parametro.activo
                  ? () => desactivar(parametro)
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
            ? 'Editar parámetro del sistema'
            : 'Nuevo parámetro del sistema'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <ParametroSistemaForm
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