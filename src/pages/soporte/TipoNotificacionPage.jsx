import { BellRing, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { requerido, validador } from '../../utils/validaciones';
import { ALCANCES_NOTIFICACION, etiquetaDe } from '../../utils/opciones';
import { siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoNotificacionForm from './TipoNotificacionForm';

const { emptyForm, mapToForm } = formModel({
  TipoNotificacionNombre: 'nombre',
  TipoNotificacionDescripcion: 'descripcion',
  TipoNotificacionRolesDestino: 'roles_destino',
  TipoNotificacionAlcance: ['alcance', 'EESS'],
  TipoNotificacionAlInteresado: ['al_interesado', true],
  TipoNotificacionEnviaCorreo: ['envia_correo', false],
});

const validate = validador({ TipoNotificacionNombre: [requerido], TipoNotificacionAlcance: [requerido] });

const columns = [
  { key: 'nombre', header: 'Tipo de aviso' },
  { key: 'alcance', header: 'Destinatarios', render: (item) => etiquetaDe(ALCANCES_NOTIFICACION, item.alcance) },
  { key: 'roles', header: 'Roles', render: (item) => item.roles_destino || '—' },
  { key: 'al_interesado', header: 'Al interesado', render: (item) => siNo(item.al_interesado) },
  { key: 'envia_correo', header: 'Correo', render: (item) => siNo(item.envia_correo) },
];

const card = (item) => ({
  icon: BellRing,
  title: item.nombre,
  meta: [item.descripcion, etiquetaDe(ALCANCES_NOTIFICACION, item.alcance), item.roles_destino && `Roles: ${item.roles_destino}`, item.envia_correo ? 'También por correo' : 'Solo bandeja'],
  footer: item.codigo,
});

// Tipos de notificacion y sus reglas de envio: a quien llega cada aviso que genera el sistema y si va por correo.
export default function TipoNotificacionPage() {
  const crud = useCrudResource({ endpoint: '/tipos-notificacion', emptyForm, mapToForm, validate, estadoKey: 'TipoNotificacionEstado' });

  return (
    <PageContainer>
      <PageHeader title="Tipos de notificación" subtitle="Soporte · Tipos de notificación">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nuevo tipo
          </Button>
        )}
      </PageHeader>
      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />
      <Alert>{crud.error}</Alert>
      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando tipos de notificación…"
        emptyIcon={BellRing}
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />
      <FormModal open={crud.modalOpen} onClose={crud.cerrarModal} title={crud.editando ? 'Editar regla de envío' : 'Nuevo tipo de notificación'} onSubmit={crud.guardar} error={crud.erroresForm.general?.[0]} submitting={crud.guardando}>
        <TipoNotificacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
