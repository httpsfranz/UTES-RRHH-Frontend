import { Plus, IdCard } from 'lucide-react';
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
import ColegiaturaTipoForm from './ColegiaturaTipoForm';

const campoVacio = {
  ColegiaturaTipoCodigo: '',
  ColegiaturaTipoNombre: '',
  ProfesionId: '',
  ColegiaturaTipoEntidad: '',
  ColegiaturaTipoDescripcion: '',
};

function mapToForm(tipo) {
  return {
    ColegiaturaTipoCodigo: tipo.codigo ?? '',
    ColegiaturaTipoNombre: tipo.nombre ?? '',
    ProfesionId: tipo.profesion?.id ?? '',
    ColegiaturaTipoEntidad: tipo.entidad ?? '',
    ColegiaturaTipoDescripcion: tipo.descripcion ?? '',
  };
}

export default function ColegiaturaTipoPage() {
  const {
    items: tipos, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/tipos-colegiatura',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el tipo de colegiatura.',
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de colegiatura" subtitle="Personal · Tipo de colegiatura">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de colegiatura…" />
      ) : tipos.length === 0 ? (
        <EmptyState icon={IdCard} message="No hay tipos de colegiatura registrados todavía." />
      ) : (
        <CardGrid>
          {tipos.map((tipo) => (
            <EntityCard
              key={tipo.id}
              icon={IdCard}
              active={tipo.activo}
              title={tipo.nombre}
              meta={[tipo.profesion?.nombre, tipo.entidad, tipo.descripcion]}
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
        title={editando ? 'Editar tipo de colegiatura' : 'Nuevo tipo de colegiatura'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <ColegiaturaTipoForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
