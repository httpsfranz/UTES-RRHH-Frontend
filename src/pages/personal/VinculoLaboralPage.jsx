import { Briefcase, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useOpciones } from '../../hooks/useOpciones';
import { alfanumerico, codigo, fecha, noAnteriorA, numeroPlaza, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { formatoFecha, siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import VinculoLaboralForm from './VinculoLaboralForm';

const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  EessId: 'eess_id',
  RegimenLaboralId: 'regimen_laboral_id',
  CondicionLaboralId: 'condicion_laboral_id',
  CargoId: 'cargo_id',
  VinculoLaboralCodigo: 'codigo',
  VinculoLaboralCodigoAirhsp: 'codigo_airhsp',
  VinculoLaboralNumeroPlaza: 'numero_plaza',
  VinculoLaboralFechaInicio: 'fecha_inicio',
  VinculoLaboralFechaFin: 'fecha_fin',
  VinculoLaboralMotivoCese: 'motivo_cese',
});

const vigencia = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'sin fin'}`;

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'cargo', header: 'Cargo', render: (item) => item.cargo?.nombre ?? '—' },
  { key: 'condicion', header: 'Condición', render: (item) => item.condicion?.nombre ?? '—' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'airhsp', header: 'AIRHSP', render: (item) => item.codigo_airhsp ?? '—' },
  { key: 'vigencia', header: 'Vigencia', render: vigencia },
  { key: 'vigente', header: 'Vigente hoy', render: (item) => siNo(item.vigente) },
];

const card = (item) => ({
  initial: item.trabajador?.nombre_completo,
  title: item.trabajador?.nombre_completo ?? 'Vínculo laboral',
  meta: [
    [item.cargo?.nombre, item.condicion?.nombre].filter(Boolean).join(' · '),
    item.eess?.nombre,
    vigencia(item),
    item.vigente ? 'Vigente hoy' : 'No vigente hoy',
    item.motivo_cese && `Cese: ${item.motivo_cese}`,
  ],
  footer: item.codigo ?? (item.codigo_airhsp ? `AIRHSP ${item.codigo_airhsp}` : `ID: ${item.id}`),
});

export default function VinculoLaboralPage() {
  // AIRHSP es obligatorio solo para las condiciones que lo exigen: la validacion de usuario necesita el catalogo.
  const condiciones = useOpciones('/condiciones-laborales');
  const exigeAirhsp = (form) =>
    Boolean(condiciones.filas.find((fila) => String(fila.id) === String(form.CondicionLaboralId))?.requiere_airhsp);

  const validate = validador({
    TrabajadorId: [requerido],
    EessId: [requerido],
    RegimenLaboralId: [requerido],
    CondicionLaboralId: [requerido],
    CargoId: [requerido],
    VinculoLaboralCodigo: [codigo],
    VinculoLaboralCodigoAirhsp: [requeridoSi(exigeAirhsp, 'Esta condición laboral exige el código AIRHSP.'), alfanumerico],
    VinculoLaboralNumeroPlaza: [numeroPlaza],
    VinculoLaboralFechaInicio: [requerido, fecha],
    VinculoLaboralFechaFin: [fecha, noAnteriorA('VinculoLaboralFechaInicio', 'La fecha de fin no puede ser anterior a la de inicio.')],
  });

  const crud = useCrudResource({
    endpoint: '/vinculos-laborales',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'VinculoLaboralEstado',
    buildConfirmMessage: (item) => `¿Desactivar el vínculo laboral de "${item.trabajador?.nombre_completo ?? item.id}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Vínculos laborales" subtitle="Personal · Vínculo laboral">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo vínculo
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, código o AIRHSP…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando vínculos laborales…"
        emptyIcon={Briefcase}
        emptyMessage="No hay vínculos laborales registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar vínculo laboral' : 'Nuevo vínculo laboral'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <VinculoLaboralForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
