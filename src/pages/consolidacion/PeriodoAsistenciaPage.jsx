import { CalendarRange, Lock, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { validador, entero, fecha, noAnteriorA, requerido, unoDe } from '../../utils/validaciones';
import { ESTADOS_PERIODO, MESES, etiquetaDe, valoresDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import PeriodoAsistenciaForm from './PeriodoAsistenciaForm';

const { emptyForm, mapToForm } = formModel({
  PeriodoAsistenciaAnio: 'anio',
  PeriodoAsistenciaMes: 'mes',
  PeriodoAsistenciaFechaInicio: 'fecha_inicio',
  PeriodoAsistenciaFechaFin: 'fecha_fin',
  PeriodoAsistenciaEstado: ['estado', 'ABIERTO'],
});

const validate = validador({
  PeriodoAsistenciaAnio: [requerido, entero({ min: 2000, max: 2100 })],
  PeriodoAsistenciaMes: [requerido, unoDe(valoresDe(MESES))],
  PeriodoAsistenciaFechaInicio: [requerido, fecha],
  PeriodoAsistenciaFechaFin: [requerido, fecha, noAnteriorA('PeriodoAsistenciaFechaInicio', 'La fecha de fin no puede ser anterior a la de inicio.')],
  PeriodoAsistenciaEstado: [requerido, unoDe(valoresDe(ESTADOS_PERIODO))],
});

const columns = [
  { key: 'periodo', header: 'Período', render: (item) => `${item.anio}-${String(item.mes).padStart(2, '0')}` },
  { key: 'fecha_inicio', header: 'Inicio', render: (item) => formatoFecha(item.fecha_inicio) },
  { key: 'fecha_fin', header: 'Fin', render: (item) => formatoFecha(item.fecha_fin) },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_PERIODO, item.estado) },
  { key: 'cierre', header: 'Cerrado', render: (item) => (item.fecha_cierre ? `${formatoFecha(item.fecha_cierre)} por ${item.cerrado_por ?? '—'}` : '—') },
];

const card = (item) => ({
  title: `${etiquetaDe(MESES, item.mes)} ${item.anio}`,
  meta: [`Del ${formatoFecha(item.fecha_inicio)} al ${formatoFecha(item.fecha_fin)}`, item.fecha_cierre && `Cerrado el ${formatoFecha(item.fecha_cierre)} por ${item.cerrado_por ?? '—'}`],
  footer: etiquetaDe(ESTADOS_PERIODO, item.estado),
});

const abierto = (item) => item.estado !== 'CERRADO';

// Un periodo se cierra con su accion (exige que todos sus consolidados esten conformes) y ya no se reabre ni se edita.
export default function PeriodoAsistenciaPage() {
  const crud = useCrudResource({
    endpoint: '/periodos-asistencia',
    emptyForm,
    mapToForm,
    validate,
  });

  const acciones = useAccionDeRegistro('/periodos-asistencia', { alTerminar: () => crud.cargar() });

  function cerrar(item) {
    if (!window.confirm(`¿Cerrar el período ${item.anio}-${String(item.mes).padStart(2, '0')}? Ya no se podrá reabrir ni modificar su asistencia.`)) return;
    acciones.ejecutar(item, { metodo: 'patch', cuerpo: { PeriodoAsistenciaEstado: 'CERRADO' } });
  }
  return (
    <PageContainer>
      <PageHeader title="Períodos de asistencia" subtitle="Consolidación · Período de asistencia">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nuevo período
          </Button>
        )}
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando períodos de asistencia…"
        emptyIcon={CalendarRange}
        emptyMessage="No hay períodos de asistencia registrados todavía."
        columns={columns}
        card={card}
        acciones={[{ icon: Lock, label: 'Cerrar período', visible: (item) => acciones.puede() && abierto(item), onClick: cerrar }]}
        puedeEditar={abierto}
        onEdit={crud.abrirEditar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar período de asistencia' : 'Nuevo período de asistencia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <PeriodoAsistenciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
