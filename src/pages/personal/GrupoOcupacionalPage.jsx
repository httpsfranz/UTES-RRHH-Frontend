import { Plus, Layers } from 'lucide-react';
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
import GrupoOcupacionalForm from './GrupoOcupacionalForm';

const campoVacio = {
  GrupoOcupacionalCodigo: '',
  GrupoOcupacionalNombre: '',
  GrupoOcupacionalDescripcion: '',
};

function mapToForm(grupo) {
  return {
    GrupoOcupacionalCodigo: grupo.codigo ?? '',
    GrupoOcupacionalNombre: grupo.nombre ?? '',
    GrupoOcupacionalDescripcion: grupo.descripcion ?? '',
  };
}

export default function GrupoOcupacionalPage() {
  const {
    items: grupos, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/grupos-ocupacionales',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el grupo ocupacional.',
  });

  return (
    <PageContainer>
      <PageHeader title="Grupos ocupacionales" subtitle="Personal · Grupo ocupacional">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo grupo
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando grupos ocupacionales…" />
      ) : grupos.length === 0 ? (
        <EmptyState icon={Layers} message="No hay grupos ocupacionales registrados todavía." />
      ) : (
        <CardGrid>
          {grupos.map((grupo) => (
            <EntityCard
              key={grupo.id}
              icon={Layers}
              active={grupo.activo}
              title={grupo.nombre}
              meta={[grupo.descripcion]}
              footer={grupo.codigo}
              onEdit={() => abrirEditar(grupo)}
              onToggle={grupo.activo ? () => desactivar(grupo) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar grupo ocupacional' : 'Nuevo grupo ocupacional'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <GrupoOcupacionalForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
