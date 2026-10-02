import { BookOpenText, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fechaHoraNoFutura, requerido, requeridoSi, unoDe, validador } from '../../utils/validaciones';
import { ESTADOS_OCURRENCIA, TIPOS_OCURRENCIA, etiquetaDe, valoresDe } from '../../utils/opciones';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import OcurrenciaPorteriaForm from './OcurrenciaPorteriaForm';

// El navegador trabaja con "AAAA-MM-DDTHH:MM" (datetime-local); la API entrega y recibe "AAAA-MM-DD HH:MM[:SS]".
const aCampoFecha = (fechaHora) => (fechaHora ? fechaHora.slice(0, 16).replace(' ', 'T') : '');

function ahoraLocal() {
  const ahora = new Date();
  const dosDigitos = (n) => String(n).padStart(2, '0');
  return `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}T${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}`;
}

const modelo = formModel({
  EessId: 'eess_id',
  VinculoLaboralId: 'vinculo_laboral_id',
  OcurrenciaPorteriaTipo: ['tipo', 'SALIDA_CON_PAPELETA'],
  OcurrenciaPorteriaFechaHora: 'fecha_hora',
  OcurrenciaPorteriaDescripcion: 'descripcion',
  OcurrenciaPorteriaEstado: ['estado', 'REGISTRADO'],
});

// Al crear, la fecha y hora arrancan en "ahora" (se calcula al abrir el formulario, no al cargar la pagina).
const emptyForm = () => ({ ...modelo.emptyForm, OcurrenciaPorteriaFechaHora: ahoraLocal() });
const mapToForm = (item) => ({ ...modelo.mapToForm(item), OcurrenciaPorteriaFechaHora: aCampoFecha(item.fecha_hora) });

const validate = validador({
  EessId: [requerido],
  VinculoLaboralId: [requeridoSi((form) => form.OcurrenciaPorteriaTipo !== 'OTRO', 'Indica la persona involucrada (solo el tipo "Otro" puede omitirla).')],
  OcurrenciaPorteriaTipo: [requerido, unoDe(valoresDe(TIPOS_OCURRENCIA))],
  OcurrenciaPorteriaFechaHora: [requerido, fechaHoraNoFutura],
  OcurrenciaPorteriaDescripcion: [requeridoSi((form) => form.OcurrenciaPorteriaTipo === 'OTRO', 'Describe la ocurrencia.')],
  OcurrenciaPorteriaEstado: [unoDe(valoresDe(ESTADOS_OCURRENCIA))],
});

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_OCURRENCIA, item.tipo) },
  { key: 'trabajador', header: 'Persona', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_OCURRENCIA, item.estado) },
];

const card = (item) => ({
  icon: BookOpenText,
  title: etiquetaDe(TIPOS_OCURRENCIA, item.tipo),
  meta: [formatoFechaHora(item.fecha_hora), item.trabajador?.nombre_completo, item.eess?.nombre, item.descripcion],
  footer: etiquetaDe(ESTADOS_OCURRENCIA, item.estado),
});

// Una ocurrencia anulada es definitiva: ni se edita ni se reactiva.
const noAnulada = (item) => item.estado !== 'ANULADO';

export default function OcurrenciaPorteriaPage() {
  const crud = useCrudResource({
    endpoint: '/ocurrencias-porteria',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la ocurrencia de ${etiquetaDe(TIPOS_OCURRENCIA, item.tipo).toLowerCase()} del ${formatoFechaHora(item.fecha_hora)}? Una ocurrencia anulada ya no se puede modificar.`,
    deactivateErrorMessage: 'No se pudo anular la ocurrencia.',
  });

  return (
    <PageContainer>
      <PageHeader title="Ocurrencias de portería" subtitle="Solicitudes · Ocurrencia de portería">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva ocurrencia
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por persona, descripción o establecimiento…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando ocurrencias…"
        emptyIcon={BookOpenText}
        emptyMessage="No hay ocurrencias de portería registradas todavía."
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
        title={crud.editando ? 'Editar ocurrencia' : 'Nueva ocurrencia de portería'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <OcurrenciaPorteriaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
    </PageContainer>
  );
}
