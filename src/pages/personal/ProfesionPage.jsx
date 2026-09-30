import { Plus, GraduationCap } from 'lucide-react';
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
import ProfesionForm from './ProfesionForm';

const campoVacio = {
  ProfesionCodigo: '',
  ProfesionNombre: '',
  ProfesionDescripcion: '',
  ProfesionRequiereColegiatura: false,
};

function mapToForm(profesion) {
  return {
    ProfesionCodigo: profesion.codigo ?? '',
    ProfesionNombre: profesion.nombre ?? '',
    ProfesionDescripcion: profesion.descripcion ?? '',
    ProfesionRequiereColegiatura: Boolean(profesion.requiere_colegiatura),
  };
}

export default function ProfesionPage() {
  const {
    items: profesiones, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/profesiones',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar la profesión.',
  });

  return (
    <PageContainer>
      <PageHeader title="Profesiones" subtitle="Personal · Profesión">
        <Button onClick={abrirCrear} icon={Plus}>
          Nueva profesión
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando profesiones…" />
      ) : profesiones.length === 0 ? (
        <EmptyState icon={GraduationCap} message="No hay profesiones registradas todavía." />
      ) : (
        <CardGrid>
          {profesiones.map((profesion) => (
            <EntityCard
              key={profesion.id}
              icon={GraduationCap}
              active={profesion.activo}
              title={profesion.nombre}
              meta={[profesion.descripcion, profesion.requiere_colegiatura && 'Requiere colegiatura']}
              footer={profesion.codigo}
              onEdit={() => abrirEditar(profesion)}
              onToggle={profesion.activo ? () => desactivar(profesion) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar profesión' : 'Nueva profesión'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <ProfesionForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
