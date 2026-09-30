import { ClipboardList, Plus } from 'lucide-react';
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
import TipoPapeletaForm from './TipoPapeletaForm';

const campoVacio = {
  TipoPapeletaCodigo: '',
  TipoPapeletaNombre: '',
  TipoPapeletaDescripcion: '',
  TipoPapeletaEsDescontable: false,
  TipoPapeletaRequiereSustento: false,
  TipoPapeletaAfectaJornada: false,
  TipoPapeletaEsCompensable: false,
};

function mapToForm(item) {
  return {
    TipoPapeletaCodigo: item.codigo ?? '',
    TipoPapeletaNombre: item.nombre ?? '',
    TipoPapeletaDescripcion: item.descripcion ?? '',
    TipoPapeletaEsDescontable: Boolean(item.es_descontable),
    TipoPapeletaRequiereSustento: Boolean(item.requiere_sustento),
    TipoPapeletaAfectaJornada: Boolean(item.afecta_jornada),
    TipoPapeletaEsCompensable: Boolean(item.es_compensable),
  };
}

export default function TipoPapeletaPage() {
  const {
    items, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/tipos-papeleta',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el tipo de papeleta.',
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de papeleta" subtitle="Solicitudes · Tipo de papeleta">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo de papeleta
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de papeleta…" />
      ) : items.length === 0 ? (
        <EmptyState icon={ClipboardList} message="No hay tipos de papeleta registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={ClipboardList}
              active={item.activo}
              title={item.nombre}
              meta={[
                item.descripcion,
                item.es_descontable && 'Descontable',
                item.requiere_sustento && 'Requiere sustento',
                item.afecta_jornada && 'Afecta jornada',
                item.es_compensable && 'Compensable',
              ]}
              footer={item.codigo}
              onEdit={() => abrirEditar(item)}
              onToggle={item.activo ? () => desactivar(item) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar tipo de papeleta' : 'Nuevo tipo de papeleta'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <TipoPapeletaForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
