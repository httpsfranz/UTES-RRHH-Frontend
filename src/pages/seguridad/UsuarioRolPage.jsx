import { Plus, UserCog } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, noAnteriorA, requerido, validador } from '../../utils/validaciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import UsuarioRolForm from './UsuarioRolForm';

const { emptyForm, mapToForm } = formModel({
  UsuarioId: 'usuario_id',
  RolId: 'rol_id',
  UsuarioRolFechaInicio: 'fecha_inicio',
  UsuarioRolFechaFin: 'fecha_fin',
});

const validate = validador({
  UsuarioId: [requerido],
  RolId: [requerido],
  UsuarioRolFechaInicio: [fecha],
  UsuarioRolFechaFin: [fecha, noAnteriorA('UsuarioRolFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
});

const vigencia = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'sin fin'}`;

const columns = [
  { key: 'usuario', header: 'Usuario', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'rol', header: 'Rol', render: (item) => item.rol?.nombre ?? '—' },
  { key: 'vigencia', header: 'Vigencia', render: vigencia },
];

const card = (item) => ({
  icon: UserCog,
  title: item.usuario?.nombre ?? 'Rol de usuario',
  meta: [item.rol?.nombre, vigencia(item)],
  footer: item.rol?.codigo,
});

export default function UsuarioRolPage() {
  const crud = useCrudResource({
    endpoint: '/usuarios-roles',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'UsuarioRolEstado',
    buildConfirmMessage: (item) => `¿Quitar el rol "${item.rol?.nombre ?? ''}" a ${item.usuario?.nombre ?? ''}?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Roles de usuario" subtitle="Seguridad · Rol de usuario">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Asignar rol
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por usuario o trabajador…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando roles de usuario…"
        emptyIcon={UserCog}
        emptyMessage="No hay roles asignados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar rol de usuario' : 'Asignar rol a un usuario'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <UsuarioRolForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
