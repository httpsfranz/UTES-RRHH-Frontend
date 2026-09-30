import { CalendarClock, Plus } from 'lucide-react';
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
import TipoJornadaForm from './TipoJornadaForm';

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

function mapToPayload(form) {
  return {
    TipoJornadaCodigo: form.codigo,
    TipoJornadaNombre: form.nombre,
    TipoJornadaDescripcion: form.descripcion,
  };
}

export default function TipoJornadaPage() {
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
    endpoint: '/tipos-jornada',
    emptyForm: campoVacio,
    mapToForm,
    mapToPayload,
    deactivateErrorMessage:
      'No se pudo desactivar el tipo de jornada.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Tipos de Jornada"
        subtitle="Configuración · Tipo de jornada"
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
        <LoadingState message="Cargando tipos de jornada…" />
      ) : tipos.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          message="No hay tipos de jornada registrados todavía."
        />
      ) : (
        <CardGrid>
          {tipos.map((tipo) => (
            <EntityCard
              key={tipo.id}
              icon={CalendarClock}
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
            ? 'Editar tipo de jornada'
            : 'Nuevo tipo de jornada'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <TipoJornadaForm
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