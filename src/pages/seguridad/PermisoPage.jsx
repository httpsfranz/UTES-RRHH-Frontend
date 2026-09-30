import { KeyRound, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import PermisoForm from './PermisoForm';

const { emptyForm, mapToForm } = formModel({
  PermisoCodigo: 'codigo',
  PermisoNombre: 'nombre',
  PermisoModulo: 'modulo',
  PermisoDescripcion: 'descripcion',
});

const validate = validador({
  PermisoCodigo: [requerido, codigo],
  PermisoNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'modulo', header: 'Módulo' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.modulo, item.descripcion],
  footer: item.codigo,
});

export default function PermisoPage() {
  const crud = useCrudResource({
    endpoint: '/permisos',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'PermisoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Permisos" subtitle="Seguridad · Permiso">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo permiso
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando permisos…"
        emptyIcon={KeyRound}
        emptyMessage="No hay permisos registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar permiso' : 'Nuevo permiso'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <PermisoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
