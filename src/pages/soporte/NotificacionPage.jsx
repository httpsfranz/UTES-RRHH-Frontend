import { Bell, MailCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { requerido, validador } from '../../utils/validaciones';
import { formatoFechaHora, siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import NotificacionForm from './NotificacionForm';

const { emptyForm, mapToForm } = formModel({
  UsuarioId: 'usuario_id',
  NotificacionTipo: 'tipo',
  NotificacionTitulo: 'titulo',
  NotificacionMensaje: 'mensaje',
  NotificacionEnlace: 'enlace',
});

const enlaceInterno = (valor) => (/^\/[A-Za-z0-9\-_/.?=&%#]*$/.test(valor) ? null : 'Debe ser una ruta interna que empiece con "/" (por ejemplo /solicitudes/papeletas).');
const tipo = (valor) => (/^[A-Z][A-Z0-9_]*$/.test(valor) ? null : 'Usa mayúsculas, números y guion bajo (por ejemplo PAPELETA_APROBADA).');

const validate = validador({
  UsuarioId: [requerido],
  NotificacionTipo: [requerido, tipo],
  NotificacionTitulo: [requerido],
  NotificacionMensaje: [requerido],
  NotificacionEnlace: [enlaceInterno],
});

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFechaHora(item.fecha) },
  { key: 'usuario', header: 'Destinatario', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'tipo', header: 'Tipo' },
  { key: 'titulo', header: 'Título' },
  { key: 'leida', header: 'Leída', render: (item) => siNo(item.leida) },
];

const card = (item) => ({
  icon: Bell,
  title: item.titulo,
  meta: [item.mensaje, item.usuario && `Para ${item.usuario.nombre}`, formatoFechaHora(item.fecha)],
  footer: item.leida ? 'Leída' : 'Sin leer',
});

export default function NotificacionPage() {
  const crud = useCrudResource({
    endpoint: '/notificaciones',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Eliminar la notificación "${item.titulo}"?`,
    deactivateErrorMessage: 'No se pudo eliminar la notificación.',
  });
  const acciones = useAccionDeRegistro('/notificaciones', { alTerminar: () => crud.cargar() });

  return (
    <PageContainer>
      <PageHeader title="Notificaciones" subtitle="Soporte · Notificación">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva notificación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por título, mensaje o tipo…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando notificaciones…"
        emptyIcon={Bell}
        emptyMessage="No hay notificaciones registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          {
            icon: MailCheck,
            label: 'Marcar como leída',
            visible: (item) => !item.leida,
            onClick: (item) => acciones.ejecutar(item, { metodo: 'patch', cuerpo: { NotificacionLeida: true } }),
          },
        ]}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar notificación' : 'Nueva notificación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <NotificacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
