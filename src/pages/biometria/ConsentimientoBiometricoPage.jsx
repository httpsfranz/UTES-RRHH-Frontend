import { Plus, ShieldQuestion } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { unoDe, requerido, validador } from '../../utils/validaciones';
import { formatoFechaHora, siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import { DECISIONES_CONSENTIMIENTO, valoresDe } from '../../utils/opciones';
import ConsentimientoBiometricoForm from './ConsentimientoBiometricoForm';

// Historial de eventos: solo se registra (no hay editar ni desactivar).
const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  ConsentimientoBiometricoAceptado: 'decision',
  ConsentimientoBiometricoVersion: 'version',
  DocumentoSustentoId: 'documento_sustento_id',
});

const validate = validador({
  TrabajadorId: [requerido],
  ConsentimientoBiometricoAceptado: [requerido, unoDe(valoresDe(DECISIONES_CONSENTIMIENTO), 'Indica si el trabajador acepta o revoca.')],
});

const decision = (item) => (item.aceptado ? 'Aceptó' : 'Revocó');

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'decision', header: 'Decisión', render: decision },
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFechaHora(item.fecha) },
  { key: 'version', header: 'Versión', render: (item) => item.version ?? '—' },
  { key: 'vigente', header: 'Vigente', render: (item) => siNo(item.vigente) },
];

const card = (item) => ({
  icon: ShieldQuestion,
  title: item.trabajador?.nombre_completo ?? 'Consentimiento',
  meta: [decision(item), formatoFechaHora(item.fecha), item.version && `Versión ${item.version}`, item.vigente ? 'Es el consentimiento vigente' : 'Reemplazado por un evento posterior'],
  footer: item.trabajador?.numero_documento && `Doc. ${item.trabajador.numero_documento}`,
});

export default function ConsentimientoBiometricoPage() {
  const crud = useCrudResource({
    endpoint: '/consentimientos-biometricos',
    emptyForm,
    mapToForm,
    validate,
  });

  return (
    <PageContainer>
      <PageHeader title="Consentimientos biométricos" subtitle="Biometría · Consentimiento biométrico">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Registrar consentimiento
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o documento…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando consentimientos…"
        emptyIcon={ShieldQuestion}
        emptyMessage="No hay consentimientos registrados todavía."
        columns={columns}
        card={card}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title="Registrar consentimiento biométrico"
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ConsentimientoBiometricoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
