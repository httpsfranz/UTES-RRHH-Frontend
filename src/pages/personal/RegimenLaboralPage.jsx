import { FileText, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import CardGrid from '../../components/ui/CardGrid';
import EntityCard from '../../components/ui/EntityCard';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import RegimenLaboralForm from './RegimenLaboralForm';

const campoVacio = {
  RegimenLaboralCodigo: '',
  RegimenLaboralNombre: '',
  RegimenLaboralBaseLegal: '',
  RegimenLaboralDescripcion: '',
  RegimenLaboralEstado: true,
};

function mapToForm(regimen) {
  return {
    RegimenLaboralCodigo: regimen.codigo ?? '',
    RegimenLaboralNombre: regimen.nombre ?? '',
    RegimenLaboralBaseLegal: regimen.base_legal ?? '',
    RegimenLaboralDescripcion: regimen.descripcion ?? '',
    RegimenLaboralEstado: regimen.activo ?? true,
  };
}

export default function RegimenLaboralPage() {
  const {
    items: regimenes,
    loading,
    error,
    buscar,
    setBuscar,
    cargar,
    modalOpen,
    editando,
    form,
    setForm,
    erroresForm,
    guardando,
    abrirCrear,
    abrirEditar,
    cerrarModal,
    guardar,
    desactivar,
  } = useCrudResource({
    endpoint: '/regimenes-laborales',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage:
      'No se pudo desactivar el régimen laboral.',
  });

  return (
    <PageContainer>
      <PageHeader
        title="Regímenes Laborales"
        subtitle="Personal · Régimen laboral"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo régimen
        </Button>
      </PageHeader>

      <SearchInput
        value={buscar}
        onChange={setBuscar}
        onSubmit={() => cargar()}
      />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando regímenes laborales…" />
      ) : regimenes.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="No hay regímenes laborales registrados todavía."
        />
      ) : (
        <CardGrid>
          {regimenes.map((regimen) => (
            <EntityCard
              key={regimen.id}
              icon={FileText}
              active={regimen.activo}
              title={regimen.nombre}
              meta={[
                regimen.codigo &&
                  `Código: ${regimen.codigo}`,
                regimen.base_legal &&
                  `Base legal: ${regimen.base_legal}`,
                regimen.descripcion,
              ].filter(Boolean)}
              footer={`ID: ${regimen.id}`}
              onEdit={() => abrirEditar(regimen)}
              onToggle={
                regimen.activo
                  ? () => desactivar(regimen)
                  : undefined
              }
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={
          editando
            ? 'Editar régimen laboral'
            : 'Nuevo régimen laboral'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <RegimenLaboralForm
            form={form}
            setForm={setForm}
            errors={erroresForm}
          />

          <FormActions
            onCancel={cerrarModal}
            submitting={guardando}
          />
        </Form>
      </Modal>
    </PageContainer>
  );
}