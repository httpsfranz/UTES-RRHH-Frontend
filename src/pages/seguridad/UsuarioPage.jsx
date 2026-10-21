import { useState } from 'react';
import { Lock, LockOpen, Plus, UserCog } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useAuth } from '../../auth/useAuth';
import { contrasena, correo, igualA, nombreDeUsuario, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import AccionModal from '../../components/ui/AccionModal';
import UsuarioForm from './UsuarioForm';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

// La API nunca devuelve la contraseña: al editar, los campos de contraseña arrancan vacíos y, si se dejan
// vacíos, el backend conserva el hash actual.
const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  UsuarioNombre: 'nombre',
  UsuarioCorreo: 'correo',
  UsuarioPassword: 'contrasena_no_se_devuelve',
  UsuarioPasswordConfirmacion: 'contrasena_no_se_devuelve',
  UsuarioEstadoCuenta: ['estado_cuenta', 'ACTIVO'],
  UsuarioMotivoBloqueo: 'motivo_bloqueo',
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
  UsuarioMotivoBloqueo: [requeridoSi((form) => form.UsuarioEstadoCuenta === 'BLOQUEADO', 'Indica el motivo del bloqueo.')],
});

const ESTADOS = { ACTIVO: 'Activo', INACTIVO: 'Inactivo', BLOQUEADO: 'Bloqueado' };
const estadoCuenta = (item) =>
  item.estado_cuenta === 'BLOQUEADO' && item.bloqueado_hasta
    ? `Bloqueado hasta ${formatoFechaHora(item.bloqueado_hasta)}`
    : (ESTADOS[item.estado_cuenta] ?? '—');

const columns = [
  { key: 'nombre', header: 'Usuario' },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'roles', header: 'Roles', render: (item) => (item.roles ?? []).map((x) => x.nombre).join(' · ') || '—' },
  { key: 'alcance', header: 'Alcance de datos', render: (item) => (item.ambitos ?? []).map((x) => x.nombre).join(' · ') || '—' },
  { key: 'estado_cuenta', header: 'Cuenta', render: estadoCuenta },
  { key: 'ultimo_acceso', header: 'Último acceso', render: (item) => (item.ultimo_acceso ? formatoFechaHora(item.ultimo_acceso) : 'Nunca') },
];

const card = (item) => ({
  icon: UserCog,
  title: item.nombre,
  meta: [
    item.trabajador?.nombre_completo,
    `Roles: ${(item.roles ?? []).map((x) => x.nombre).join(' · ') || '—'}`,
    `Cuenta: ${estadoCuenta(item)}`,
    item.motivo_bloqueo,
  ],
  footer: item.ultimo_acceso ? `Último acceso ${formatoFechaHora(item.ultimo_acceso)}` : 'Aún no ingresa',
});

const bloqueado = (item) => item.estado_cuenta === 'BLOQUEADO';

/**
 * Cuentas de usuario. El estado (activa, desactivada o bloqueada) se elige en el mismo formulario o con los botones de
 * la fila; bloquear o desactivar una cuenta cierra todas sus sesiones abiertas. Tras 5 intentos fallidos la cuenta se
 * bloquea sola por 15 minutos (parametros LOGIN_INTENTOS_MAX y LOGIN_BLOQUEO_MIN).
 */
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
    buildConfirmMessage: (item) => `¿Desactivar la cuenta "${item.nombre}"? Se cerrarán sus sesiones abiertas.`,
  });
  const acciones = useAccionDeRegistro('/usuarios', { alTerminar: () => crud.cargar() });
  const [bloqueando, setBloqueando] = useState(null);
  // La propia cuenta no se desactiva ni se bloquea desde aqui (el backend tambien lo impide): otro administrador debe hacerlo.
  const { usuario: yo } = useAuth();
  const esOtro = (item) => String(item.id) !== String(yo?.id);

  return (
    <PageContainer>
      <PageHeader title="Usuarios" subtitle="Cuentas de acceso, su estado (activa, desactivada o bloqueada) y su último ingreso.">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nuevo usuario
          </Button>
        )}
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por usuario, trabajador o correo…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando usuarios…"
        emptyIcon={UserCog}
        emptyMessage="No hay usuarios registrados todavía."
        columns={columns}
        card={card}
        acciones={[
          {
            icon: Lock,
            label: 'Bloquear cuenta',
            visible: (item) => acciones.puede('bloquear') && item.activo && !bloqueado(item) && esOtro(item),
            onClick: setBloqueando,
          },
          {
            icon: LockOpen,
            label: 'Desbloquear cuenta',
            visible: (item) => acciones.puede('desbloquear') && bloqueado(item),
            onClick: (item) => acciones.ejecutar(item, { accion: 'desbloquear' }),
          },
        ]}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
        puedeAlternar={(item) => !item.activo || esOtro(item)}
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

      <AccionModal
        abierto={bloqueando?.id ?? null}
        titulo={`Bloquear la cuenta ${bloqueando?.nombre ?? ''}`}
        inicial={{ Motivo: '' }}
        ayuda="El bloqueo no tiene plazo: dura hasta que la desbloquees. Sus sesiones abiertas se cierran de inmediato."
        enviar={(form) => acciones.ejecutar(bloqueando, { accion: 'bloquear', cuerpo: form, enModal: true })}
        onClose={() => setBloqueando(null)}
        campos={(form, setForm, errors) => (
          <TextoEstandar
            form={form}
            setForm={setForm}
            errors={errors}
            name="Motivo"
            opciones={TEXTOS.motivoBloqueo}
            label="Motivo"
            required
            maxLength={200}
          />
        )}
      />
    </PageContainer>
  );
}
