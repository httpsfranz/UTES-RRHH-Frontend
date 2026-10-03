import { useState } from 'react';
import { CalendarClock, Palmtree, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { fecha, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_ROL_VACACIONAL, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import RolVacacionalForm from './RolVacacionalForm';
import ReprogramarRolModal from './ReprogramarRolModal';

const { emptyForm, mapToForm } = formModel({
  PeriodoVacacionalId: 'periodo_vacacional_id',
  RolVacacionalFechaProgramada: 'fecha_programada',
  RolVacacionalDias: 'dias',
});

const programado = (item) => item.estado === 'PROGRAMADO';
const descanso = (item) => `${formatoFecha(item.fecha_programada)} – ${formatoFecha(item.fecha_fin_programada)}`;

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'anio', header: 'Récord', render: (item) => String(item.periodo_vacacional?.anio ?? '—') },
  { key: 'descanso', header: 'Descanso', render: descanso },
  { key: 'dias', header: 'Días', render: (item) => String(item.dias) },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_ROL_VACACIONAL, item.estado) },
];

const card = (item) => ({
  icon: Palmtree,
  title: item.trabajador?.nombre_completo ?? 'Rol vacacional',
  meta: [`Récord ${item.periodo_vacacional?.anio ?? ''}`, `${descanso(item)} (${item.dias} días)`, item.goces_registrados ? `${item.goces_registrados} goce(s) solicitado(s)` : null],
  footer: etiquetaDe(ESTADOS_ROL_VACACIONAL, item.estado),
});

export default function RolVacacionalPage() {
  const validate = validador({
    PeriodoVacacionalId: [requerido],
    RolVacacionalFechaProgramada: [requerido, fecha],
    RolVacacionalDias: [requerido, (valor) => (/^\d+$/.test(String(valor)) && Number(valor) >= 1 && Number(valor) <= 30 ? null : 'El descanso va de 1 a 30 días calendario enteros.')],
  });

  const crud = useCrudResource({
    endpoint: '/roles-vacacionales',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular el descanso de ${item.trabajador?.nombre_completo ?? ''} (${descanso(item)})?`,
    deactivateErrorMessage: 'No se pudo anular el descanso.',
  });
  const acciones = useAccionDeRegistro('/roles-vacacionales', { alTerminar: () => crud.cargar() });
  const [reprogramando, setReprogramando] = useState(null);

  return (
    <PageContainer>
      <PageHeader title="Rol vacacional" subtitle="Vacaciones · Rol vacacional">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Programar descanso
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
        loadingMessage="Cargando el rol vacacional…"
        emptyIcon={Palmtree}
        emptyMessage="No hay descansos programados todavía."
        columns={columns}
        card={card}
        acciones={[{ icon: CalendarClock, label: 'Reprogramar', visible: programado, onClick: setReprogramando }]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Anular' }}
        puedeEditar={programado}
        puedeAlternar={programado}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar descanso programado' : 'Programar descanso vacacional'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <RolVacacionalForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ReprogramarRolModal
        item={reprogramando}
        reprogramar={(item, nueva) => acciones.ejecutar(item, { accion: 'reprogramar', cuerpo: { RolVacacionalFechaProgramada: nueva }, enModal: true })}
        onClose={() => setReprogramando(null)}
      />
    </PageContainer>
  );
}
