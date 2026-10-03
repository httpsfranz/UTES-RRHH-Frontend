import { Eye, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fechaHoraNoFutura, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_SUPERVISION, etiquetaDe } from '../../utils/opciones';
import { aCampoFecha, ahoraLocal, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import SupervisionInopinadaForm from './SupervisionInopinadaForm';

const modelo = formModel({
  EessId: 'eess_id',
  VinculoLaboralId: 'vinculo_laboral_id',
  UsuarioId: 'usuario_id',
  DocumentoSustentoId: 'documento_sustento_id',
  SupervisionInopinadaFechaHora: 'fecha_hora',
  SupervisionInopinadaResultado: 'resultado',
  SupervisionInopinadaObservacion: 'observacion',
  SupervisionInopinadaEstado: ['estado', 'REGISTRADO'],
});

// Al crear, la fecha y hora arrancan en "ahora" (se calcula al abrir el formulario).
const emptyForm = () => ({ ...modelo.emptyForm, SupervisionInopinadaFechaHora: ahoraLocal() });
const mapToForm = (item) => ({ ...modelo.mapToForm(item), SupervisionInopinadaFechaHora: aCampoFecha(item.fecha_hora) });

const validate = validador({
  EessId: [requerido],
  UsuarioId: [requerido],
  SupervisionInopinadaFechaHora: [requerido, (valor) => fechaHoraNoFutura(valor)?.replace('La ocurrencia no puede registrarse', 'La supervisión no puede registrarse')],
  SupervisionInopinadaObservacion: [requeridoSi((form) => form.SupervisionInopinadaEstado === 'OBSERVADO', 'Indica las observaciones del acta de supervisión.')],
});

const noAnulada = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'persona', header: 'Persona supervisada', render: (item) => item.trabajador?.nombre_completo ?? 'General' },
  { key: 'supervisor', header: 'Supervisor', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_SUPERVISION, item.estado) },
];

const card = (item) => ({
  icon: Eye,
  title: item.eess?.nombre ?? 'Supervisión inopinada',
  meta: [formatoFechaHora(item.fecha_hora), item.trabajador?.nombre_completo ?? 'Supervisión general', item.resultado, item.observacion],
  footer: etiquetaDe(ESTADOS_SUPERVISION, item.estado),
});

export default function SupervisionInopinadaPage() {
  const crud = useCrudResource({
    endpoint: '/supervisiones-inopinadas',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la supervisión de ${item.eess?.nombre ?? ''} del ${formatoFechaHora(item.fecha_hora)}?`,
    deactivateErrorMessage: 'No se pudo anular la supervisión.',
  });

  return (
    <PageContainer>
      <PageHeader title="Supervisiones inopinadas" subtitle="Disciplina · Supervisión inopinada">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva supervisión
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por persona, resultado u observaciones…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando supervisiones…"
        emptyIcon={Eye}
        emptyMessage="No hay supervisiones inopinadas registradas todavía."
        columns={columns}
        card={card}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={noAnulada}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar supervisión' : 'Nueva supervisión inopinada'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <SupervisionInopinadaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
    </PageContainer>
  );
}
