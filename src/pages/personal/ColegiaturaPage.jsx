import { BadgeCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { alfanumerico, fecha, noAnteriorA, noFutura, requerido, validador } from '../../utils/validaciones';
import { formatoFecha, siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ColegiaturaForm from './ColegiaturaForm';

const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  ColegiaturaTipoId: 'colegiatura_tipo_id',
  DocumentoSustentoId: 'documento_sustento_id',
  ColegiaturaNumero: 'numero',
  ColegiaturaFechaColegiatura: 'fecha_colegiatura',
  ColegiaturaFechaHabilitacion: 'fecha_habilitacion',
  ColegiaturaFechaVencimiento: 'fecha_vencimiento',
  ColegiaturaObservacion: 'observacion',
  ColegiaturaEsHabilitado: ['es_habilitado', true],
  ColegiaturaEsPrincipal: ['es_principal', false],
});

const validate = validador({
  TrabajadorId: [requerido],
  ColegiaturaTipoId: [requerido],
  ColegiaturaNumero: [requerido, alfanumerico],
  ColegiaturaFechaColegiatura: [fecha, noFutura('La fecha de colegiatura no puede ser futura.')],
  ColegiaturaFechaHabilitacion: [
    fecha,
    noAnteriorA('ColegiaturaFechaColegiatura', 'La habilitación no puede ser anterior a la fecha de colegiatura.'),
  ],
  ColegiaturaFechaVencimiento: [
    fecha,
    noAnteriorA('ColegiaturaFechaHabilitacion', 'El vencimiento no puede ser anterior a la fecha de habilitación.'),
  ],
});

const situacion = (item) => (item.vencida ? 'Vencida' : item.vigente ? 'Vigente' : 'No habilitado');

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'colegio', header: 'Colegio', render: (item) => item.tipo?.nombre ?? '—' },
  { key: 'numero', header: 'N.º de colegiatura' },
  { key: 'vencimiento', header: 'Vence', render: (item) => (item.fecha_vencimiento ? formatoFecha(item.fecha_vencimiento) : 'Sin vencimiento') },
  { key: 'situacion', header: 'Situación', render: situacion },
  { key: 'principal', header: 'Principal', render: (item) => siNo(item.es_principal) },
];

const card = (item) => ({
  icon: BadgeCheck,
  title: item.trabajador?.nombre_completo ?? 'Colegiatura',
  meta: [
    `${item.tipo?.nombre ?? 'Colegio'} N.º ${item.numero}`,
    situacion(item),
    item.fecha_vencimiento && `Vence el ${formatoFecha(item.fecha_vencimiento)}`,
    item.es_principal && 'Colegiatura principal',
  ],
  footer: item.tipo?.codigo,
});

export default function ColegiaturaPage() {
  const crud = useCrudResource({
    endpoint: '/colegiaturas',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ColegiaturaEstado',
    buildConfirmMessage: (item) => `¿Desactivar la colegiatura ${item.numero} de "${item.trabajador?.nombre_completo ?? ''}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Colegiaturas" subtitle="Personal · Colegiatura">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva colegiatura
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, colegio o número…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando colegiaturas…"
        emptyIcon={BadgeCheck}
        emptyMessage="No hay colegiaturas registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar colegiatura' : 'Nueva colegiatura'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ColegiaturaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
