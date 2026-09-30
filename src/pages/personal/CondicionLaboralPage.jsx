import { Plus, Briefcase } from 'lucide-react';
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
import CondicionLaboralForm from './CondicionLaboralForm';

const campoVacio = {
  CondicionLaboralCodigo: '',
  CondicionLaboralNombre: '',
  CondicionLaboralDescripcion: '',
  CondicionLaboralEsPermanente: false,
  CondicionLaboralRequiereAirhsp: false,
};

function mapToForm(condicion) {
  return {
    CondicionLaboralCodigo: condicion.codigo ?? '',
    CondicionLaboralNombre: condicion.nombre ?? '',
    CondicionLaboralDescripcion: condicion.descripcion ?? '',
    CondicionLaboralEsPermanente: Boolean(condicion.es_permanente),
    CondicionLaboralRequiereAirhsp: Boolean(condicion.requiere_airhsp),
  };
}

export default function CondicionLaboralPage() {
  const {
    items: condiciones, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/condiciones-laborales',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar la condición laboral.',
  });

  return (
    <PageContainer>
      <PageHeader title="Condiciones laborales" subtitle="Personal · Condición laboral">
        <Button onClick={abrirCrear} icon={Plus}>
          Nueva condición
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando condiciones laborales…" />
      ) : condiciones.length === 0 ? (
        <EmptyState icon={Briefcase} message="No hay condiciones laborales registradas todavía." />
      ) : (
        <CardGrid>
          {condiciones.map((condicion) => (
            <EntityCard
              key={condicion.id}
              icon={Briefcase}
              active={condicion.activo}
              title={condicion.nombre}
              meta={[
                condicion.descripcion,
                condicion.es_permanente && 'Permanente',
                condicion.requiere_airhsp && 'Requiere AIRHSP',
              ]}
              footer={condicion.codigo}
              onEdit={() => abrirEditar(condicion)}
              onToggle={condicion.activo ? () => desactivar(condicion) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar condición laboral' : 'Nueva condición laboral'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <CondicionLaboralForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
