import { useState } from 'react';
import { CircleCheck, Hourglass, Plus, Undo2 } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { fecha, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_COMPENSACION, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResolucionModal from '../../components/ui/ResolucionModal';
import CompensacionHorariaForm from './CompensacionHorariaForm';
import DevolverHorasModal from './DevolverHorasModal';

// Solo se digita QUIEN, QUE DIA y el motivo: las horas, el tipo (sobretiempo), quien autoriza y el limite los pone el sistema.
const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  CompensacionHorariaFechaTrabajo: 'fecha_trabajo',
  CompensacionHorariaAutorizadoPreviamente: ['autorizado_previamente', false],
  CompensacionHorariaObservacion: 'observacion',
});

const pendiente = (item) => item.estado === 'PENDIENTE';
const aprobada = (item) => item.estado === 'APROBADO';
const noAnulada = (item) => item.estado !== 'ANULADO' && item.estado !== 'CONSUMIDO';
const estado = (item) => (item.vencida && item.estado !== 'VENCIDO' ? `${etiquetaDe(ESTADOS_COMPENSACION, item.estado)} (vencida)` : etiquetaDe(ESTADOS_COMPENSACION, item.estado));
const horas = (item) => (item.fecha_trabajo && pendiente(item) && Number(item.horas_generadas) === 0 ? 'Por calcular' : String(item.horas_generadas));

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'fecha_trabajo', header: 'Día autorizado', render: (item) => (item.fecha_trabajo ? formatoFecha(item.fecha_trabajo) : '—') },
  { key: 'horas_generadas', header: 'Horas (de la marca)', render: horas },
  { key: 'horas_pendientes', header: 'Por compensar (h)' },
  { key: 'limite', header: 'Compensar hasta', render: (item) => (item.fecha_limite ? formatoFecha(item.fecha_limite) : '—') },
  { key: 'autoriza', header: 'Autorizó', render: (item) => item.usuario_autorizacion?.nombre ?? '—' },
  { key: 'estado', header: 'Estado', render: estado },
];

const card = (item) => ({
  icon: Hourglass,
  title: item.trabajador?.nombre_completo ?? 'Compensación horaria',
  meta: [item.fecha_trabajo && `Día ${formatoFecha(item.fecha_trabajo)}`, `Horas: ${horas(item)} · por compensar ${item.horas_pendientes} h`, item.fecha_limite && `Hasta el ${formatoFecha(item.fecha_limite)}`, item.observacion],
  footer: estado(item),
});

const validate = validador({
  VinculoLaboralId: [requerido],
  CompensacionHorariaFechaTrabajo: [requerido, fecha],
});

export default function CompensacionHorariaListaPage() {
  const crud = useCrudResource({
    endpoint: '/compensaciones-horarias',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la compensación de ${item.trabajador?.nombre_completo ?? ''} (${item.horas_generadas} h)?`,
    deactivateErrorMessage: 'No se pudo anular la compensación.',
  });
  const acciones = useAccionDeRegistro('/compensaciones-horarias', { alTerminar: () => crud.cargar() });
  const [aprobando, setAprobando] = useState(null);
  const [devolviendo, setDevolviendo] = useState(null);

  return (
    <PageContainer>
      <PageHeader title="Autorizaciones de trabajo fuera de jornada" subtitle="Compensaciones · Autorizaciones">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Autorizar trabajo fuera de jornada
          </Button>
        )}
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador u observación…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando compensaciones…"
        emptyIcon={Hourglass}
        emptyMessage="No hay compensaciones horarias registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: "Validar horas", visible: pendiente, onClick: setAprobando },
          { icon: Undo2, label: 'Devolver horas', visible: (item) => acciones.puede('devolver') && aprobada(item), onClick: setDevolviendo },
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
        title={crud.editando ? "Editar autorización" : "Autorizar trabajo fuera de jornada"}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CompensacionHorariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>

      <ResolucionModal
        item={aprobando}
        accion={aprobando ? 'aprobar' : null}
        titulo="Validar horas a compensar"
        ayuda="Valida las horas calculadas de la marca de salida (mínimo 1 h, RIT Art. 17). Al validarlas pasan a la asistencia del día como sobretiempo."
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={() => setAprobando(null)}
      />

      <DevolverHorasModal
        item={devolviendo}
        devolver={(item, horas) => acciones.ejecutar(item, { accion: 'devolver', cuerpo: { Horas: horas }, enModal: true })}
        onClose={() => setDevolviendo(null)}
      />
    </PageContainer>
  );
}
