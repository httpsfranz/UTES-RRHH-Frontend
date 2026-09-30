import { AlertTriangle, Plus } from 'lucide-react';
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
import TipoFaltaDisciplinariaForm from './TipoFaltaDisciplinariaForm';

const campoVacio = {
  codigo: '',
  nombre: '',
  gravedad: '',
  baseLegal: '',
  descripcion: '',
};

function mapToForm(tipo) {
  return {
    codigo: tipo.codigo ?? '',
    nombre: tipo.nombre ?? '',
    gravedad: tipo.gravedad ?? '',
    baseLegal: tipo.baseLegal ?? '',
    descripcion: tipo.descripcion ?? '',
  };
}

function mapToPayload(form) {
  return {
    TipoFaltaDisciplinariaCodigo: form.codigo,
    TipoFaltaDisciplinariaNombre: form.nombre,
    TipoFaltaDisciplinariaGravedad: form.gravedad || null,
    TipoFaltaDisciplinariaBaseLegal: form.baseLegal || null,
    TipoFaltaDisciplinariaDescripcion: form.descripcion || null,
  };
}

export default function TipoFaltaDisciplinariaPage() {
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
    endpoint: '/tipos-falta-disciplinaria',
    emptyForm: campoVacio,
    mapToForm,
    mapToPayload,
    deactivateErrorMessage:
      'No se pudo desactivar el tipo de falta disciplinaria.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Tipos de Falta Disciplinaria"
        subtitle="Disciplina · Tipo de falta disciplinaria"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nueva falta
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de falta disciplinaria…" />
      ) : tipos.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          message="No hay tipos de falta disciplinaria registrados todavía."
        />
      ) : (
        <CardGrid>
          {tipos.map((tipo) => (
            <EntityCard
              key={tipo.id}
              icon={AlertTriangle}
              active={tipo.activo}
              title={tipo.nombre}
              meta={[
                tipo.codigo && `Código: ${tipo.codigo}`,
                tipo.gravedad && `Gravedad: ${tipo.gravedad}`,
                tipo.baseLegal && `Base legal: ${tipo.baseLegal}`,
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
            ? 'Editar tipo de falta disciplinaria'
            : 'Nueva falta disciplinaria'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <TipoFaltaDisciplinariaForm
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