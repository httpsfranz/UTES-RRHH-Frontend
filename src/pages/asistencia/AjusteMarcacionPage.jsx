import { useState } from 'react';
import { CircleCheck, CircleX, PenLine, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { fechaHoraNoFutura, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_SOLICITUD, etiquetaDe } from '../../utils/opciones';
import { aCampoFecha, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResolucionModal from '../../components/ui/ResolucionModal';
import AjusteMarcacionForm from './AjusteMarcacionForm';

const modelo = formModel({
  MarcacionId: 'marcacion_id',
  UsuarioId: 'usuario_id',
  DocumentoSustentoId: 'documento_sustento_id',
  AjusteMarcacionFechaHoraNueva: 'fecha_hora_nueva',
  AjusteMarcacionMotivo: 'motivo',
});

const { emptyForm } = modelo;
const mapToForm = (item) => ({ ...modelo.mapToForm(item), AjusteMarcacionFechaHoraNueva: aCampoFecha(item.fecha_hora_nueva) });

const pendiente = (item) => item.estado === 'PENDIENTE';
const correccion = (item) => (item.fecha_hora_nueva ? `${formatoFechaHora(item.fecha_hora_anterior)} → ${formatoFechaHora(item.fecha_hora_nueva)}` : `${formatoFechaHora(item.fecha_hora_anterior)} → se invalida`);

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'correccion', header: 'Ajuste', render: correccion },
  { key: 'motivo', header: 'Motivo' },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: PenLine,
  title: item.trabajador?.nombre_completo ?? 'Ajuste de marcación',
  meta: [correccion(item), item.motivo, item.usuario && `Solicita ${item.usuario.nombre}`],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function AjusteMarcacionPage() {
  const validate = validador({
    MarcacionId: [requerido],
    UsuarioId: [requerido],
    AjusteMarcacionMotivo: [requerido],
    AjusteMarcacionFechaHoraNueva: [(valor) => fechaHoraNoFutura(valor)?.replace('La ocurrencia', 'La marcación')],
  });

  const crud = useCrudResource({
    endpoint: '/ajustes-marcacion',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la solicitud de ajuste de la marcación de ${item.trabajador?.nombre_completo ?? ''}?`,
    deactivateErrorMessage: 'No se pudo anular la solicitud.',
  });
  const acciones = useAccionDeRegistro('/ajustes-marcacion', { alTerminar: () => crud.cargar() });
  const [resolviendo, setResolviendo] = useState({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Ajustes de marcación" subtitle="Asistencia · Ajustes de marcación">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Solicitar ajuste
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o motivo…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando ajustes de marcación…"
        emptyIcon={PenLine}
        emptyMessage="No hay solicitudes de ajuste de marcación todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolviendo({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolviendo({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={pendiente}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar ajuste de marcación' : 'Solicitar ajuste de marcación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <AjusteMarcacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolviendo.item}
        accion={resolviendo.accion}
        titulo={resolviendo.accion === 'rechazar' ? 'Rechazar ajuste de marcación' : 'Aprobar ajuste de marcación'}
        ayuda="Al aprobar, la marcación queda corregida con la fecha y hora nuevas (o invalidada si la solicitud no trae fecha nueva). No procede en un período de asistencia cerrado."
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={() => setResolviendo({ item: null, accion: null })}
      />
    </PageContainer>
  );
}
