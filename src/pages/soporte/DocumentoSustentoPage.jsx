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
import DocumentoSustentoForm from './DocumentoSustentoForm';

const campoVacio = {
  DocumentoSustentoNombre: '',
  DocumentoSustentoRuta: '',
  DocumentoSustentoTipo: '',
  DocumentoSustentoExtension: '',
  DocumentoSustentoTamanoBytes: '',
  DocumentoSustentoHash: '',
};

function mapToForm(item) {
  return {
    DocumentoSustentoNombre: item.nombre ?? '',
    DocumentoSustentoRuta: item.ruta ?? '',
    DocumentoSustentoTipo: item.tipo ?? '',
    DocumentoSustentoExtension: item.extension ?? '',
    DocumentoSustentoTamanoBytes: item.tamano_bytes ?? '',
    DocumentoSustentoHash: item.hash ?? '',
  };
}

export default function DocumentoSustentoPage() {
  const {
    items, loading, error, buscar, setBuscar, cargar, modalOpen, editando,
    form, setForm, erroresForm, guardando, abrirCrear, abrirEditar, cerrarModal, guardar, desactivar,
  } = useCrudResource({
    endpoint: '/documentos-sustento',
    emptyForm: campoVacio,
    mapToForm,
    buildConfirmMessage: (item) => `¿Eliminar el documento "${item.nombre}"?`,
    deactivateErrorMessage: 'No se pudo eliminar el documento.',
  });

  return (
    <PageContainer>
      <PageHeader title="Documentos de sustento" subtitle="Soporte · Documento de sustento">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo documento de sustento
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando documentos de sustento…" />
      ) : items.length === 0 ? (
        <EmptyState icon={FileText} message="No hay documentos de sustento registrados todavía." />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={item.id}
              icon={FileText}
              title={item.nombre}
              meta={[item.tipo, item.ruta, item.fecha_registro]}
              footer={item.extension && `.${item.extension}`}
              onEdit={() => abrirEditar(item)}
              onDelete={() => desactivar(item)}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar documento de sustento' : 'Nuevo documento de sustento'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <DocumentoSustentoForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
