import { useState } from 'react';
import { CircleCheck, CircleX, Plus, Stethoscope } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { fecha, noAnteriorA, numeroPlaza, requerido, validador } from '../../utils/validaciones';
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
import DescansoMedicoForm from './DescansoMedicoForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  DocumentoSustentoId: 'documento_sustento_id',
  DescansoMedicoNumeroCitt: 'numero_citt',
  DescansoMedicoDiagnostico: 'diagnostico',
  DescansoMedicoFechaInicio: 'fecha_inicio',
  DescansoMedicoFechaFin: 'fecha_fin',
  DescansoMedicoObservacion: 'observacion',
});

const validate = validador({
  VinculoLaboralId: [requerido],
  DescansoMedicoNumeroCitt: [numeroPlaza],
  DescansoMedicoFechaInicio: [requerido, fecha],
  DescansoMedicoFechaFin: [requerido, fecha, noAnteriorA('DescansoMedicoFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
});

const dias = (item) => Math.round((Date.parse(item.fecha_fin) - Date.parse(item.fecha_inicio)) / 86400000) + 1;
const rango = (item) => `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)} (${dias(item)} d)`;
const pendiente = (item) => item.estado === 'PENDIENTE';
const noAnulada = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'citt', header: 'CITT', render: (item) => item.numero_citt ?? '—' },
  { key: 'diagnostico', header: 'Diagnóstico', render: (item) => item.diagnostico ?? '—' },
  { key: 'fechas', header: 'Fechas', render: rango },
  { key: 'estado', header: 'Resolución', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: Stethoscope,
  title: item.trabajador?.nombre_completo ?? 'Descanso médico',
  meta: [rango(item), item.numero_citt && `CITT ${item.numero_citt}`, item.diagnostico, item.observacion],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function DescansoMedicoPage() {
  const crud = useCrudResource({
    endpoint: '/descansos-medicos',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular el descanso médico de ${item.trabajador?.nombre_completo ?? ''} (${rango(item)})?`,
    deactivateErrorMessage: 'No se pudo anular el descanso médico.',
  });
  const acciones = useAccionDeRegistro('/descansos-medicos', { alTerminar: () => crud.cargar() });
  const [resolucion, setResolucion] = useState({ item: null, accion: null });
  const cerrar = () => setResolucion({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Descansos médicos" subtitle="Solicitudes · Descanso médico">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo descanso médico
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, CITT o diagnóstico…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando descansos médicos…"
        emptyIcon={Stethoscope}
        emptyMessage="No hay descansos médicos registrados todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar descanso médico' : 'Nuevo descanso médico'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <DescansoMedicoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolucion.item}
        accion={resolucion.accion}
        titulo={resolucion.accion === 'rechazar' ? 'Rechazar descanso médico' : 'Aprobar descanso médico'}
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={cerrar}
      />
    </PageContainer>
  );
}
