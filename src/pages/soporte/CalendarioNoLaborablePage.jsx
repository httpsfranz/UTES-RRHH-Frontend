import { useState } from 'react';
import { CalendarDays, CalendarRange, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, fecha, requerido, unoDe } from '../../utils/validaciones';
import { formatoFecha, siNo } from '../../utils/formato';
import { MESES, TIPOS_DIA_NO_LABORABLE, etiquetaDe, valoresDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import Select from '../../components/ui/Select';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import CalendarioNoLaborableForm from './CalendarioNoLaborableForm';

const { emptyForm, mapToForm } = formModel({
  CalendarioNoLaborableFecha: 'fecha',
  CalendarioNoLaborableTipo: 'tipo',
  MicroredId: 'microred_id',
  CalendarioNoLaborableDescripcion: 'descripcion',
  CalendarioNoLaborableNormaSustento: 'norma_sustento',
  CalendarioNoLaborableCompensable: ['compensable', false],
});

const validate = validador({
  CalendarioNoLaborableFecha: [requerido, fecha],
  CalendarioNoLaborableTipo: [requerido, unoDe(valoresDe(TIPOS_DIA_NO_LABORABLE))],
});

const periodos = (item) => (item.periodos_afectados ?? []).map((p) => `${etiquetaDe(MESES, String(p.mes))} ${p.anio} (${p.estado.toLowerCase()})`).join(' · ') || 'Sin período registrado';

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_DIA_NO_LABORABLE, item.tipo) },
  { key: 'descripcion', header: 'Descripción' },
  { key: 'microred', header: 'Alcance', render: (item) => item.microred?.nombre ?? 'Toda la Red' },
  { key: 'norma', header: 'Norma de sustento', render: (item) => item.norma_sustento ?? '—' },
  { key: 'compensable', header: 'Compensable', render: (item) => siNo(item.compensable) },
  { key: 'periodos', header: 'Período de asistencia', render: periodos },
];

const card = (item) => ({
  icon: CalendarDays,
  title: formatoFecha(item.fecha),
  meta: [item.descripcion, item.microred?.nombre ?? 'Toda la Red', item.norma_sustento, `Período: ${periodos(item)}`],
  footer: etiquetaDe(TIPOS_DIA_NO_LABORABLE, item.tipo),
});

const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = Array.from({ length: 5 }, (_, i) => String(ANIO_ACTUAL - 2 + i)).map((a) => ({ value: a, label: a }));

/**
 * Calendario no laborable: feriados y dias no laborables por año y mes. La norma de sustento se completa sola segun
 * el tipo; no se repite un dia (ni para una microred si ya lo es para toda la Red); cada dia muestra el periodo de
 * asistencia que afecta (al registrarlo se recalcula la asistencia de ese dia; un periodo cerrado no admite cambios).
 */
export default function CalendarioNoLaborablePage() {
  const [filtro, setFiltro] = useState({ Anio: String(ANIO_ACTUAL), Mes: '' });
  const crud = useCrudResource({
    endpoint: '/calendario-no-laborable',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'CalendarioNoLaborableEstado',
    buildConfirmMessage: (item) => `¿Desactivar el día no laborable del ${formatoFecha(item.fecha)}? Su asistencia se recalcula como día normal.`,
    deactivateErrorMessage: 'No se pudo desactivar el día no laborable.',
  });
  const visibles = crud.items.filter((item) => item.fecha?.startsWith(filtro.Anio) && (!filtro.Mes || Number(item.fecha.slice(5, 7)) === Number(filtro.Mes)));

  return (
    <PageContainer>
      <PageHeader title="Calendario no laborable" subtitle="Feriados y días no laborables por año y mes, con su norma y el período de asistencia que afectan.">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nuevo día no laborable
          </Button>
        )}
      </PageHeader>

      <Toolbar>
        <ToolbarItem ancho="sm">
          <Select form={filtro} setForm={setFiltro} name="Anio" label="Año" icon={CalendarRange} options={ANIOS} />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Select form={filtro} setForm={setFiltro} name="Mes" label="Mes" icon={CalendarDays} options={[{ value: '', label: 'Todo el año' }, ...MESES]} />
        </ToolbarItem>
      </Toolbar>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} placeholder="Buscar por descripción o norma…" />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={visibles}
        total={visibles.length}
        loading={crud.loading}
        loadingMessage="Cargando días no laborables…"
        emptyIcon={CalendarDays}
        emptyMessage="No hay días no laborables registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar día no laborable' : 'Nuevo día no laborable'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CalendarioNoLaborableForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
