import { useState } from 'react';
import { ArrowLeftRight, CircleCheck, CircleX, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { requerido, requeridoSi, validador } from '../../utils/validaciones';
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
import CambioTurnoForm from './CambioTurnoForm';

const { emptyForm, mapToForm } = formModel({
  TipoCambioTurnoId: 'tipo_cambio_turno_id',
  TurnoProgramadoId: 'turno_programado_id',
  TurnoProgramadoContraparteId: 'turno_programado_contraparte_id',
  TurnoIdNuevo: 'turno_id_nuevo',
  VinculoLaboralSolicitanteId: 'vinculo_laboral_solicitante_id',
  VinculoLaboralReemplazanteId: 'vinculo_laboral_reemplazante_id',
  DocumentoSustentoId: 'documento_sustento_id',
  UsuarioRegistroId: 'usuario_registro_id',
  CambioTurnoMotivo: 'motivo',
  CambioTurnoObservacion: 'observacion',
});

const pendiente = (item) => item.estado === 'PENDIENTE';
const turno = (item) => (item.turno_programado ? `${formatoFecha(item.turno_programado.fecha)} · ${item.turno_programado.turno?.nombre ?? ''}` : '—');
const conQuien = (item) => item.reemplazante?.nombre_completo ?? item.turno_nuevo?.nombre ?? '—';

const columns = [
  { key: 'solicitante', header: 'Solicitante', render: (item) => item.solicitante?.nombre_completo ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => item.tipo?.nombre ?? '—' },
  { key: 'turno', header: 'Turno', render: turno },
  { key: 'con', header: 'Reemplazante / turno nuevo', render: conQuien },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: ArrowLeftRight,
  title: `${item.tipo?.nombre ?? 'Cambio de turno'} · ${item.solicitante?.nombre_completo ?? ''}`,
  meta: [turno(item), item.reemplazante && `Con ${item.reemplazante.nombre_completo}`, item.turno_nuevo && `Nuevo turno: ${item.turno_nuevo.nombre}`, item.motivo],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function CambioTurnoPage() {
  // Lo que exige cada tipo (reemplazante, turno de la contraparte, turno nuevo) sale del catalogo de tipos.
  const tipos = useOpciones('/tipos-cambio-turno');
  const codigoDe = (form) => tipos.filas.find((fila) => String(fila.id) === String(form.TipoCambioTurnoId))?.codigo;
  const llevaReemplazante = (form) => Boolean(tipos.filas.find((fila) => String(fila.id) === String(form.TipoCambioTurnoId))?.requiere_reemplazante);
  const sinReemplazante = (form) => Boolean(form.TipoCambioTurnoId) && !llevaReemplazante(form);

  const validate = validador({
    TipoCambioTurnoId: [requerido],
    TurnoProgramadoId: [requerido],
    VinculoLaboralSolicitanteId: [requerido],
    UsuarioRegistroId: [requerido],
    VinculoLaboralReemplazanteId: [requeridoSi(llevaReemplazante, 'Este tipo de cambio exige un reemplazante (RIT, Art. 20).')],
    TurnoProgramadoContraparteId: [requeridoSi((form) => codigoDe(form) === 'PERMUTA', 'Indica el turno que se recibe a cambio.')],
    TurnoIdNuevo: [requeridoSi((form) => codigoDe(form) === 'REPROGRAMACION', 'Indica el turno al que se reprograma.')],
    CambioTurnoMotivo: [requeridoSi(sinReemplazante, 'Sin reemplazante, el cambio solo procede justificado: indica el motivo (RIT, Art. 20).')],
    DocumentoSustentoId: [requeridoSi(sinReemplazante, 'Sin reemplazante se necesita la autorización escrita del jefe: adjunta el documento (RIT, Art. 20).')],
  });

  const crud = useCrudResource({
    endpoint: '/cambios-turno',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la solicitud de ${item.tipo?.nombre?.toLowerCase() ?? 'cambio de turno'} de ${item.solicitante?.nombre_completo ?? ''}?`,
    deactivateErrorMessage: 'No se pudo anular la solicitud.',
  });
  const acciones = useAccionDeRegistro('/cambios-turno', { alTerminar: () => crud.cargar() });
  const [resolviendo, setResolviendo] = useState({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Cambios de turno" subtitle="Programación · Cambios de turno">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Solicitar cambio
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por solicitante o motivo…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando cambios de turno…"
        emptyIcon={ArrowLeftRight}
        emptyMessage="No hay solicitudes de cambio de turno todavía."
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
        title={crud.editando ? 'Editar solicitud de cambio de turno' : 'Solicitar cambio de turno'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CambioTurnoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolviendo.item}
        accion={resolviendo.accion}
        titulo={resolviendo.accion === 'rechazar' ? 'Rechazar cambio de turno' : 'Aprobar cambio de turno'}
        ayuda="Al aprobar, el cambio se aplica a la programación publicada: el turno pasa al reemplazante, se permuta, se reprograma o queda sin efecto. Requiere la autorización del jefe del establecimiento y el visto bueno de Control de Asistencia (RIT, Art. 20)."
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={() => setResolviendo({ item: null, accion: null })}
      />
    </PageContainer>
  );
}
