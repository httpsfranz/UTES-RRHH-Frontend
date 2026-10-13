import { useState } from 'react';
import { KeyRound, Plus, Shield } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import RolForm from './RolForm';
import RolPermisosModal from './RolPermisosModal';

const { emptyForm, mapToForm } = formModel({
  RolNombre: 'nombre',
  RolDescripcion: 'descripcion',
});

const validate = validador({
  RolNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'descripcion', header: 'Descripción' },
  { key: 'permisos', header: 'Permisos', render: (item) => String(item.permisos_total ?? 0) },
  { key: 'usuarios', header: 'Usuarios', render: (item) => String(item.usuarios_total ?? 0) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, `${item.permisos_total ?? 0} permisos · ${item.usuarios_total ?? 0} usuarios`],
  footer: item.codigo,
  icon: Shield,
});

// Roles + asignacion de sus permisos (tabla puente Seguridad.RolPermiso): los permisos de un rol se
// gestionan desde aqui con el boton "Permisos", no en una pantalla aparte.
export default function RolPage() {
  const crud = useCrudResource({
    endpoint: '/roles',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'RolEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });
  const [rolDePermisos, setRolDePermisos] = useState(null);

  return (
    <PageContainer>
      <PageHeader title="Roles" subtitle="Seguridad · Rol">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo rol
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando roles…"
        emptyIcon={Shield}
        emptyMessage="No hay roles registrados todavía."
        columns={columns}
        card={card}
        acciones={[{ icon: KeyRound, label: 'Permisos', onClick: setRolDePermisos }]}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar rol' : 'Nuevo rol'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <RolForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <RolPermisosModal rol={rolDePermisos} onClose={() => setRolDePermisos(null)} />
    </PageContainer>
  );
}
