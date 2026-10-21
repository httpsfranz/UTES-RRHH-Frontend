import { useState } from 'react';
import { KeyRound, Plus, Shield, Trash2 } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { usePedirBaja } from '../../components/ui/bajaContext';
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
  {
    key: 'permisos',
    header: 'Permisos',
    render: (item) => String(item.permisos_total ?? 0),
  },
  {
    key: 'usuarios',
    header: 'Usuarios',
    render: (item) => String(item.usuarios_total ?? 0),
  },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, `${item.permisos_total ?? 0} permisos · ${item.usuarios_total ?? 0} usuarios`],
  footer: item.codigo,
  icon: Shield,
});

// Roles segun las responsabilidades institucionales + asignacion de sus permisos (tabla puente Seguridad.RolPermiso).
// Un rol activo no se elimina: primero se desactiva (PATCH) y, si nunca se asigno a un usuario, se puede eliminar.
// Los permisos de un rol se
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
  const acciones = useAccionDeRegistro('/roles', {
    alTerminar: () => crud.cargar(),
  });
  const pedirBaja = usePedirBaja();

  // Desactivar es un PATCH (DELETE elimina de verdad y solo se permite con el rol ya inactivo).
  async function alternar(item) {
    if (!item.activo) return crud.reactivar(item);
    const motivo = await pedirBaja({
      mensaje: `¿Desactivar el rol "${item.nombre}"? Sus usuarios dejan de tener sus permisos.`,
      endpoint: '/roles',
    });
    if (motivo === null) return null;
    return acciones.ejecutar(item, {
      metodo: 'patch',
      cuerpo: { RolEstado: false, MotivoBaja: motivo },
    });
  }

  function eliminar(item) {
    if (!window.confirm(`¿Eliminar definitivamente el rol "${item.nombre}"?`)) return;
    acciones.ejecutar(item, { metodo: 'delete' });
  }

  return (
    <PageContainer>
      <PageHeader title="Roles" subtitle="Seguridad · Rol">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nuevo rol
          </Button>
        )}
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando roles…"
        emptyIcon={Shield}
        emptyMessage="No hay roles registrados todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: KeyRound, label: 'Permisos', onClick: setRolDePermisos },
          {
            icon: Trash2,
            label: 'Eliminar rol',
            visible: (item) => crud.puedeEditar && !item.activo,
            onClick: eliminar,
          },
        ]}
        onEdit={crud.abrirEditar}
        onToggle={crud.puedeEditar ? alternar : undefined}
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
