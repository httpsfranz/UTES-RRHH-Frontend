import { useState } from 'react';
import { CircleCheck, CircleX, Plane, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { diasCalendario, formatoFecha } from '../../utils/formato';
import { fecha, noAnteriorA, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_SOLICITUD, etiquetaDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResolucionModal from '../../components/ui/ResolucionModal';
import GoceVacacionalForm from './GoceVacacionalForm';

const { emptyForm, mapToForm } = formModel({
  RolVacacionalId: 'rol_vacacional_id',
  GoceVacacionalFechaInicio: 'fecha_inicio',
  GoceVacacionalFechaFin: 'fecha_fin',
  DocumentoSustentoId: 'documento_sustento_id',
});

const pendiente = (item) => item.estado === 'PENDIENTE';
const anulable = (item) => item.estado === 'PENDIENTE' || item.estado === 'APROBADO';
const goce = (item) => `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)}`;
const descanso = (item) => (item.rol_vacacional ? `${formatoFecha(item.rol_vacacional.fecha_programada)} – ${formatoFecha(item.rol_vacacional.fecha_fin_programada)}` : '—');

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'goce', header: 'Goce', render: goce },
  { key: 'dias', header: 'Días', render: (item) => String(item.dias) },
  { key: 'descanso', header: 'Descanso programado', render: descanso },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: Plane,
  title: item.trabajador?.nombre_completo ?? 'Goce vacacional',
  meta: [`${goce(item)} (${item.dias} días)`, `Descanso programado: ${descanso(item)}`, item.documento?.nombre],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function GoceVacacionalPage() {
  const validate = validador({
    RolVacacionalId: [requerido],
    GoceVacacionalFechaInicio: [requerido, fecha],
    GoceVacacionalFechaFin: [requerido, fecha, noAnteriorA('GoceVacacionalFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
    // Un goce menor de 7 dias es un fraccionamiento: se solicita por escrito (RIT, Art. 72 y 73).
    DocumentoSustentoId: [
      requeridoSi((form) => {
        const dias = diasCalendario(form.GoceVacacionalFechaInicio, form.GoceVacacionalFechaFin);
        return dias !== null && dias < 7;
      }, 'Un goce menor de 7 días es un fraccionamiento: adjunta el documento que lo sustenta (RIT, Art. 72 y 73).'),
    ],
  });

  const crud = useCrudResource({
    endpoint: '/goces-vacacionales',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular el goce vacacional de ${item.trabajador?.nombre_completo ?? ''} (${goce(item)})?`,
    deactivateErrorMessage: 'No se pudo anular el goce.',
  });
  const acciones = useAccionDeRegistro('/goces-vacacionales', { alTerminar: () => crud.cargar() });
  const [resolviendo, setResolviendo] = useState({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Goce vacacional" subtitle="Vacaciones · Goce vacacional">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Solicitar goce
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o documento…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando goces vacacionales…"
        emptyIcon={Plane}
        emptyMessage="No hay goces vacacionales solicitados todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolviendo({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolviendo({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={anulable}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar goce vacacional' : 'Solicitar goce vacacional'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <GoceVacacionalForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolviendo.item}
        accion={resolviendo.accion}
        titulo={resolviendo.accion === 'rechazar' ? 'Rechazar goce vacacional' : 'Aprobar goce vacacional'}
        ayuda="Al aprobar se descuentan los días del goce de los disponibles del período vacacional y, si cubre todo el descanso programado, este queda gozado."
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={() => setResolviendo({ item: null, accion: null })}
      />
    </PageContainer>
  );
}
