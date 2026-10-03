import { useState } from 'react';
import { CircleCheck, Hourglass, Plus, Undo2 } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
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

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  TipoCompensacionId: 'tipo_compensacion_id',
  CompensacionHorariaAutorizadoPor: 'autorizado_por',
  CompensacionHorariaHorasGeneradas: 'horas_generadas',
  CompensacionHorariaFechaLimite: 'fecha_limite',
  CompensacionHorariaAutorizadoPreviamente: ['autorizado_previamente', false],
  CompensacionHorariaObservacion: 'observacion',
});

const pendiente = (item) => item.estado === 'PENDIENTE';
const aprobada = (item) => item.estado === 'APROBADO';
const noAnulada = (item) => item.estado !== 'ANULADO' && item.estado !== 'CONSUMIDO';
const estado = (item) => (item.vencida && item.estado !== 'VENCIDO' ? `${etiquetaDe(ESTADOS_COMPENSACION, item.estado)} (vencida)` : etiquetaDe(ESTADOS_COMPENSACION, item.estado));

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'tipo', header: 'Origen', render: (item) => item.tipo?.nombre ?? '—' },
  { key: 'horas_generadas', header: 'Generadas (h)' },
  { key: 'horas_pendientes', header: 'Pendientes (h)' },
  { key: 'limite', header: 'Compensar hasta', render: (item) => (item.fecha_limite ? formatoFecha(item.fecha_limite) : '—') },
  { key: 'estado', header: 'Estado', render: estado },
];

const card = (item) => ({
  icon: Hourglass,
  title: item.trabajador?.nombre_completo ?? 'Compensación horaria',
  meta: [item.tipo?.nombre, `${item.horas_generadas} h generadas, ${item.horas_devueltas} devueltas, ${item.horas_pendientes} pendientes`, item.fecha_limite && `Hasta el ${formatoFecha(item.fecha_limite)}`, !item.autorizado_previamente && 'Sin autorización previa'],
  footer: estado(item),
});

export default function CompensacionHorariaPage() {
  // El minimo de una hora aplica solo al sobretiempo: la validacion de usuario necesita el catalogo de tipos.
  const tipos = useOpciones('/tipos-compensacion');
  const validate = validador({
    VinculoLaboralId: [requerido],
    TipoCompensacionId: [requerido],
    CompensacionHorariaHorasGeneradas: [
      requerido,
      (valor) => (/^\d+(\.\d{1,2})?$/.test(String(valor)) && Number(valor) > 0 && Number(valor) <= 24 ? null : 'Debe ser mayor que 0 y hasta 24, con hasta 2 decimales.'),
      (valor, form) =>
        tipos.filas.find((fila) => String(fila.id) === String(form.TipoCompensacionId))?.codigo === 'HORA_EXTRA' && Number(valor) < 1
          ? 'El trabajo fuera de la jornada a compensar es de una hora diaria como mínimo (RIT, Art. 17).'
          : null,
    ],
    CompensacionHorariaFechaLimite: [fecha],
  });

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
      <PageHeader title="Compensación horaria" subtitle="Compensaciones · Compensación horaria">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva compensación
        </Button>
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
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: setAprobando },
          { icon: Undo2, label: 'Devolver horas', visible: aprobada, onClick: setDevolviendo },
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
        title={crud.editando ? 'Editar compensación' : 'Nueva compensación horaria'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CompensacionHorariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={aprobando}
        accion={aprobando ? 'aprobar' : null}
        titulo="Aprobar compensación"
        ayuda="Solo procede si el trabajo fue autorizado previamente por el jefe inmediato (RIT, Art. 17). Quien aprueba queda como quien autoriza."
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
