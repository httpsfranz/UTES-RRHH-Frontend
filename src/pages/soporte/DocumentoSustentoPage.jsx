import { FileText, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, entero, requerido } from '../../utils/validaciones';
import { formatoBytes, formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import DocumentoSustentoForm from './DocumentoSustentoForm';

const { emptyForm, mapToForm } = formModel({
  DocumentoSustentoNombre: 'nombre',
  DocumentoSustentoRuta: 'ruta',
  DocumentoSustentoTipo: 'tipo',
  DocumentoSustentoExtension: 'extension',
  DocumentoSustentoTamanoBytes: 'tamano_bytes',
  DocumentoSustentoHash: 'hash',
});

const validate = validador({
  DocumentoSustentoNombre: [requerido],
  DocumentoSustentoTamanoBytes: [entero({ min: 0 })],
});

const columns = [
  { key: 'nombre', header: 'Nombre' },
  { key: 'tipo', header: 'Tipo' },
  { key: 'tamano_bytes', header: 'Tamaño', render: (item) => formatoBytes(item.tamano_bytes) },
  { key: 'fecha_registro', header: 'Registrado', render: (item) => formatoFecha(item.fecha_registro) },
];

const card = (item) => ({
  icon: FileText,
  title: item.nombre,
  meta: [item.tipo, item.tamano_bytes !== null && formatoBytes(item.tamano_bytes), item.ruta, formatoFecha(item.fecha_registro)],
  footer: item.extension && `.${item.extension}`,
});

export default function DocumentoSustentoPage() {
  const crud = useCrudResource({
    endpoint: '/documentos-sustento',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Eliminar el documento "${item.nombre}"?`,
    deactivateErrorMessage: 'No se pudo eliminar el documento.',
  });

  return (
    <PageContainer>
      <PageHeader title="Documentos de sustento" subtitle="Soporte · Documento de sustento">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo documento
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando documentos de sustento…"
        emptyIcon={FileText}
        emptyMessage="No hay documentos de sustento registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar documento de sustento' : 'Nuevo documento de sustento'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <DocumentoSustentoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
