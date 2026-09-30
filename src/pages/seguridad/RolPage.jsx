import { Shield, Plus } from 'lucide-react';
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
import RolForm from './RolForm';

const campoVacio = {
  RolCodigo: '',
  RolNombre: '',
  RolDescripcion: '',
};

function mapToForm(item) {
  return {
    RolCodigo: item.codigo ?? '',
    RolNombre: item.nombre ?? '',
    RolDescripcion: item.descripcion ?? '',
  };
}

export default function RolPage() {
  const {
    items, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/roles',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el rol.',
  });

  return (
    <PageContainer>
      <PageHeader title="Roles" subtitle="Seguridad · Rol">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo rol
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando roles…" />
      ) : items.length === 0 ? (
        <EmptyState icon={Shield} message="No hay roles registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={Shield}
              active={item.activo}
              title={item.nombre}
              meta={[item.descripcion]}
              footer={item.codigo}
              onEdit={() => abrirEditar(item)}
              onToggle={item.activo ? () => desactivar(item) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar rol' : 'Nuevo rol'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <RolForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
