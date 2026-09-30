import { Plus, UserCheck } from 'lucide-react';
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
import TipoResponsabilidadForm from './TipoResponsabilidadForm';

const campoVacio = {
  TipoResponsabilidadCodigo: '',
  TipoResponsabilidadNombre: '',
  TipoResponsabilidadDescripcion: '',
};

function mapToForm(tipo) {
  return {
    TipoResponsabilidadCodigo: tipo.codigo ?? '',
    TipoResponsabilidadNombre: tipo.nombre ?? '',
    TipoResponsabilidadDescripcion: tipo.descripcion ?? '',
  };
}

export default function TipoResponsabilidadPage() {
  const {
    items: tipos, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/tipos-responsabilidad',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el tipo de responsabilidad.',
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de responsabilidad" subtitle="Organización · Tipo de responsabilidad">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de responsabilidad…" />
      ) : tipos.length === 0 ? (
        <EmptyState icon={UserCheck} message="No hay tipos de responsabilidad registrados todavía." />
      ) : (
        <CardGrid>
          {tipos.map((tipo) => (
            <EntityCard
              key={tipo.id}
              icon={UserCheck}
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
        title={editando ? 'Editar tipo de responsabilidad' : 'Nuevo tipo de responsabilidad'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <TipoResponsabilidadForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
