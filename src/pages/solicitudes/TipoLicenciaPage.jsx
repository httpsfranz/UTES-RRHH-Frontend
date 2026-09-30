import { FileBadge, Plus } from 'lucide-react';
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
import TipoLicenciaForm from './TipoLicenciaForm';

const campoVacio = {
  TipoLicenciaCodigo: '',
  TipoLicenciaNombre: '',
  TipoLicenciaDescripcion: '',
  TipoLicenciaMaximoDias: '',
  TipoLicenciaBaseLegal: '',
  TipoLicenciaConGoce: false,
};

function mapToForm(item) {
  return {
    TipoLicenciaCodigo: item.codigo ?? '',
    TipoLicenciaNombre: item.nombre ?? '',
    TipoLicenciaDescripcion: item.descripcion ?? '',
    TipoLicenciaMaximoDias: item.maximo_dias ?? '',
    TipoLicenciaBaseLegal: item.base_legal ?? '',
    TipoLicenciaConGoce: Boolean(item.con_goce),
  };
}

export default function TipoLicenciaPage() {
  const {
    items, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/tipos-licencia',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage: 'No se pudo desactivar el tipo de licencia.',
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de licencia" subtitle="Solicitudes · Tipo de licencia">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo de licencia
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando tipos de licencia…" />
      ) : items.length === 0 ? (
        <EmptyState icon={FileBadge} message="No hay tipos de licencia registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={FileBadge}
              active={item.activo}
              title={item.nombre}
              meta={[
                item.descripcion,
                item.con_goce ? 'Con goce' : 'Sin goce',
                item.maximo_dias && `Máximo ${item.maximo_dias} días`,
                item.base_legal,
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
        title={editando ? 'Editar tipo de licencia' : 'Nuevo tipo de licencia'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <TipoLicenciaForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
