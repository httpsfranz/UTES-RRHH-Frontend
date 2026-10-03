import { useState } from 'react';
import { CircleCheck, CircleX, FileCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { fecha, noAnteriorA, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_SOLICITUD, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResolucionModal from '../../components/ui/ResolucionModal';
import JustificacionFaltaForm from './JustificacionFaltaForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  ConceptoJustificacionId: 'concepto_justificacion_id',
  DocumentoSustentoId: 'documento_sustento_id',
  UsuarioRegistroId: 'usuario_registro_id',
  JustificacionFaltaFechaInicio: 'fecha_inicio',
  JustificacionFaltaFechaFin: 'fecha_fin',
  JustificacionFaltaDocumentoNumero: 'documento_numero',
  JustificacionFaltaObservacion: 'observacion',
});

const rango = (item) => (item.fecha_inicio === item.fecha_fin ? formatoFecha(item.fecha_inicio) : `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)}`);
const pendiente = (item) => item.estado === 'PENDIENTE';
const noAnulada = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'concepto', header: 'Concepto', render: (item) => item.concepto?.nombre ?? '—' },
  { key: 'fechas', header: 'Fechas', render: rango },
  { key: 'estado', header: 'Resolución', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: FileCheck,
  title: item.trabajador?.nombre_completo ?? 'Justificación',
  meta: [item.concepto?.nombre, rango(item), item.motivo_rechazo && `Rechazo: ${item.motivo_rechazo}`, item.observacion],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function JustificacionFaltaPage() {
  // Obligatorio solo si el concepto elegido exige documento: la validacion de usuario necesita el catalogo.
  const conceptos = useOpciones('/conceptos-justificacion');
  const exigeDocumento = (form) =>
    Boolean(conceptos.filas.find((fila) => String(fila.id) === String(form.ConceptoJustificacionId))?.requiere_documento);

  const validate = validador({
    VinculoLaboralId: [requerido],
    ConceptoJustificacionId: [requerido],
    UsuarioRegistroId: [requerido],
    DocumentoSustentoId: [requeridoSi(exigeDocumento, 'Este concepto exige adjuntar el documento de sustento.')],
    JustificacionFaltaFechaInicio: [requerido, fecha],
    JustificacionFaltaFechaFin: [requerido, fecha, noAnteriorA('JustificacionFaltaFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
  });

  const crud = useCrudResource({
    endpoint: '/justificaciones-falta',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la justificación de ${item.trabajador?.nombre_completo ?? ''} (${rango(item)})? Si estaba aprobada, sus faltas vuelven a ser injustificadas.`,
    deactivateErrorMessage: 'No se pudo anular la justificación.',
  });
  const acciones = useAccionDeRegistro('/justificaciones-falta', { alTerminar: () => crud.cargar() });
  const [resolucion, setResolucion] = useState({ item: null, accion: null });
  const cerrar = () => setResolucion({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Justificación de faltas" subtitle="Asistencia · Justificación de faltas">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva justificación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, documento u observación…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando justificaciones…"
        emptyIcon={FileCheck}
        emptyMessage="No hay justificaciones registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar justificación' : 'Nueva justificación de faltas'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <JustificacionFaltaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolucion.item}
        accion={resolucion.accion}
        titulo={resolucion.accion === 'rechazar' ? 'Rechazar justificación' : 'Aprobar justificación'}
        ayuda={resolucion.accion === 'aprobar' ? 'Las faltas injustificadas de esos días pasarán a "Falta justificada".' : undefined}
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={cerrar}
      />
    </PageContainer>
  );
}
