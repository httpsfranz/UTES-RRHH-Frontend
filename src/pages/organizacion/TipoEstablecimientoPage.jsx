import { Building2, Plus } from 'lucide-react';
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
import TipoEstablecimientoForm from './TipoEstablecimientoForm';

const campoVacio = {
  TipoEstablecimientoCodigo: '',
  TipoEstablecimientoNombre: '',
  TipoEstablecimientoDescripcion: '',
};

// La respuesta ya viene en camelCase (TipoEstablecimientoResource) pero el
// formulario sigue escribiendo en PascalCase (TipoEstablecimientoRequest), asi
// que el mapeo de edicion no es 1:1 y se define aca, explicito.
function mapToForm(tipo) {
  return {
    TipoEstablecimientoCodigo: tipo.codigo ?? '',
    TipoEstablecimientoNombre: tipo.nombre ?? '',
    TipoEstablecimientoDescripcion: tipo.descripcion ?? '',
  };
}

export default function TipoEstablecimientoPage() {
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
    endpoint: '/tipos-establecimiento',
    emptyForm: campoVacio,
    mapToForm,
  });

  return (
    <div className="p-6">
      <PageHeader title="Tipos de establecimiento" subtitle="Organización · Tipo de establecimiento">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de establecimiento…" />
      ) : tipos.length === 0 ? (
        <EmptyState icon={Building2} message="No hay tipos de establecimiento registrados todavía." />
      ) : (
        <CardGrid>
          {tipos.map((tipo) => (
            <EntityCard
              key={tipo.id}
              initial={tipo.nombre?.[0] ?? 'T'}
              active={tipo.activo}
              title={tipo.nombre}
              meta={[tipo.descripcion]}
              footer={tipo.codigo}
              onEdit={() => abrirEditar(tipo)}
              onToggle={tipo.activo ? () => desactivar(tipo) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar tipo de establecimiento' : 'Nuevo tipo de establecimiento'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <TipoEstablecimientoForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </div>
  );
}
