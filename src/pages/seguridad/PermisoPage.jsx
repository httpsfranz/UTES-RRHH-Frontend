import { Plus, ShieldCheck } from 'lucide-react';
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
import PermisoForm from './PermisoForm';

const campoVacio = {
  PermisoCodigo: '',
  PermisoNombre: '',
  PermisoModulo: '',
  PermisoDescripcion: '',
};

function mapToForm(permiso) {
  return {
    PermisoCodigo: permiso.codigo ?? '',
    PermisoNombre: permiso.nombre ?? '',
    PermisoModulo: permiso.modulo ?? '',
    PermisoDescripcion: permiso.descripcion ?? '',
  };
}

export default function PermisoPage() {
  const {
    items, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/permisos',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el permiso.',
  });

  return (
    <PageContainer>
      <PageHeader title="Permisos" subtitle="Seguridad · Permiso">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo permiso
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando permisos…" />
      ) : items.length === 0 ? (
        <EmptyState icon={ShieldCheck} message="No hay permisos registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={ShieldCheck}
              active={item.activo}
              title={item.nombre}
              meta={[item.modulo && `Módulo: ${item.modulo}`, item.descripcion]}
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
        title={editando ? 'Editar permiso' : 'Nuevo permiso'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <PermisoForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
