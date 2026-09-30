import { Clock3, Plus } from 'lucide-react';
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
import TablaToleranciaForm from './TablaToleranciaForm';

const campoVacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
};

function mapToForm(tabla) {
  return {
    codigo: tabla.codigo ?? '',
    nombre: tabla.nombre ?? '',
    descripcion: tabla.descripcion ?? '',
  };
}

function mapToPayload(form) {
  return {
    TablaToleranciaCodigo: form.codigo,
    TablaToleranciaNombre: form.nombre,
    TablaToleranciaDescripcion: form.descripcion,
  };
}

export default function TablaToleranciaPage() {
  const {
    items: tablas,
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
    endpoint: '/tablas-tolerancia',
    emptyForm: campoVacio,
    mapToForm,
    mapToPayload,
    deactivateErrorMessage:
      'No se pudo desactivar la tabla de tolerancia.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Tablas de Tolerancia"
        subtitle="Configuración · Tabla de tolerancia"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nueva tabla
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tablas de tolerancia…" />
      ) : tablas.length === 0 ? (
        <EmptyState
          icon={Clock3}
          message="No hay tablas de tolerancia registradas todavía."
        />
      ) : (
        <CardGrid>
          {tablas.map((tabla) => (
            <EntityCard
              key={tabla.id}
              icon={Clock3}
              active={tabla.activo}
              title={tabla.nombre}
              meta={[
                tabla.codigo && `Código: ${tabla.codigo}`,
                tabla.descripcion,
              ]}
              footer={`ID: ${tabla.id}`}
              onEdit={() => abrirEditar(tabla)}
              onToggle={
                tabla.activo
                  ? () => desactivar(tabla)
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
            ? 'Editar tabla de tolerancia'
            : 'Nueva tabla de tolerancia'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <TablaToleranciaForm
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