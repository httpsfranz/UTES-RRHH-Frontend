import { Plus, UserCog } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { contrasena, correo, igualA, nombreDeUsuario, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import UsuarioForm from './UsuarioForm';

// La API nunca devuelve la contraseña: al editar, los campos de contraseña arrancan vacíos y, si se dejan
// vacíos, el backend conserva el hash actual.
const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  UsuarioNombre: 'nombre',
  UsuarioCorreo: 'correo',
  UsuarioPassword: 'contrasena_no_se_devuelve',
  UsuarioPasswordConfirmacion: 'contrasena_no_se_devuelve',
});

const validate = validador({
  TrabajadorId: [requerido],
  UsuarioNombre: [requerido, nombreDeUsuario],
  UsuarioCorreo: [correo],
  UsuarioPassword: [contrasena],
  UsuarioPasswordConfirmacion: [
    requeridoSi((form) => Boolean(form.UsuarioPassword), 'Confirma la contraseña.'),
    igualA('UsuarioPassword', 'La confirmación no coincide con la contraseña.'),
  ],
});

const columns = [
  { key: 'nombre', header: 'Usuario' },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'documento', header: 'Documento', render: (item) => item.trabajador?.numero_documento ?? '—' },
  { key: 'correo', header: 'Correo', render: (item) => item.correo ?? '—' },
  { key: 'fecha_creacion', header: 'Creado', render: (item) => formatoFechaHora(item.fecha_creacion) },
];

const card = (item) => ({
  icon: UserCog,
  title: item.nombre,
  meta: [item.trabajador?.nombre_completo, item.correo, `Creado ${formatoFechaHora(item.fecha_creacion)}`],
  footer: item.trabajador?.numero_documento && `Doc. ${item.trabajador.numero_documento}`,
});

export default function UsuarioPage() {
  // Al crear la contraseña es obligatoria; al editar solo se valida si se escribe una nueva.
  const crud = useCrudResource({
    endpoint: '/usuarios',
    emptyForm,
    mapToForm,
    validate: (form) => {
      const errores = validate(form);
      if (!crud.editando && !form.UsuarioPassword) errores.UsuarioPassword = ['Este campo es obligatorio.'];
      return errores;
    },
    estadoKey: 'UsuarioEstado',
    buildConfirmMessage: (item) => `¿Desactivar la cuenta "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Usuarios" subtitle="Seguridad · Usuario">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo usuario
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por usuario, trabajador o correo…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando usuarios…"
        emptyIcon={UserCog}
        emptyMessage="No hay usuarios registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar usuario' : 'Nuevo usuario'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <UsuarioForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
    </PageContainer>
  );
}
