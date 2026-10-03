import { CalendarRange, Lock, Plus, Send } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { entero, fecha, noAnteriorA, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_PROGRAMACION, MESES, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ProgramacionPeriodoForm from './ProgramacionPeriodoForm';

const { emptyForm, mapToForm } = formModel({
  EessId: 'eess_id',
  TipoPeriodoProgramacionId: 'tipo_periodo_programacion_id',
  UsuarioRegistroId: 'usuario_registro_id',
  ProgramacionPeriodoCodigo: 'codigo',
  ProgramacionPeriodoAnio: 'anio',
  ProgramacionPeriodoMes: 'mes',
  ProgramacionPeriodoNumero: 'numero',
  ProgramacionPeriodoFechaInicio: 'fecha_inicio',
  ProgramacionPeriodoFechaFin: 'fecha_fin',
  ProgramacionPeriodoObservacion: 'observacion',
});

const periodo = (item) => {
  const mes = item.mes ? etiquetaDe(MESES, String(item.mes)) : '';
  const numero = item.numero ? ` · ${item.tipo_periodo?.codigo === 'SEMANAL' ? 'semana' : 'quincena'} ${item.numero}` : '';
  return `${mes} ${item.anio}${numero}`.trim();
};
const borrador = (item) => item.estado === 'BORRADOR';
const publicada = (item) => item.estado === 'PUBLICADA';
const noCerrada = (item) => item.estado !== 'CERRADA' && item.estado !== 'ANULADA';

const columns = [
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => item.tipo_periodo?.nombre ?? '—' },
  { key: 'periodo', header: 'Período', render: periodo },
  { key: 'fechas', header: 'Fechas', render: (item) => `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)}` },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_PROGRAMACION, item.estado) },
];

const card = (item) => ({
  icon: CalendarRange,
  title: `${item.eess?.nombre ?? 'Programación'} · ${periodo(item)}`,
  meta: [item.tipo_periodo?.nombre, `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)}`, item.codigo, item.observacion],
  footer: etiquetaDe(ESTADOS_PROGRAMACION, item.estado),
});

export default function ProgramacionPeriodoPage() {
  // Mes y numero dependen del tipo de periodo: la validacion de usuario necesita el catalogo.
  const tipos = useOpciones('/tipos-periodo-programacion');
  const codigoDe = (form) => tipos.filas.find((fila) => String(fila.id) === String(form.TipoPeriodoProgramacionId))?.codigo;

  const validate = validador({
    EessId: [requerido],
    TipoPeriodoProgramacionId: [requerido],
    UsuarioRegistroId: [requerido],
    ProgramacionPeriodoAnio: [requerido, entero({ min: 2000, max: 2100 })],
    ProgramacionPeriodoMes: [requeridoSi((form) => ['MENSUAL', 'QUINCENAL', 'SEMANAL'].includes(codigoDe(form)), 'Indica el mes de la programación.')],
    ProgramacionPeriodoNumero: [requeridoSi((form) => ['QUINCENAL', 'SEMANAL'].includes(codigoDe(form)), 'Indica el número de quincena o semana.')],
    ProgramacionPeriodoFechaInicio: [requerido, fecha],
    ProgramacionPeriodoFechaFin: [requerido, fecha, noAnteriorA('ProgramacionPeriodoFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
  });

  const crud = useCrudResource({
    endpoint: '/programaciones-periodo',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la programación de ${item.eess?.nombre ?? ''} (${periodo(item)})?`,
    deactivateErrorMessage: 'No se pudo anular la programación.',
  });
  const acciones = useAccionDeRegistro('/programaciones-periodo', { alTerminar: () => crud.cargar() });
  const confirmar = (accion, mensaje) => (item) => {
    if (window.confirm(mensaje(item))) acciones.ejecutar(item, { accion });
  };

  return (
    <PageContainer>
      <PageHeader title="Programación por período" subtitle="Programación · Programación por período">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva programación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por código u observación…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando programaciones…"
        emptyIcon={CalendarRange}
        emptyMessage="No hay programaciones registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          {
            icon: Send,
            label: 'Publicar',
            visible: borrador,
            onClick: confirmar('publicar', (item) => `¿Publicar la programación de ${item.eess?.nombre ?? ''}? Una vez publicada ya no se podrá modificar.`),
          },
          { icon: Lock, label: 'Cerrar', visible: publicada, onClick: confirmar('cerrar', () => '¿Cerrar la programación?') },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={borrador}
        puedeAlternar={noCerrada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar programación' : 'Nueva programación por período'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ProgramacionPeriodoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
