import { Download, Eye, FileText, Plus } from 'lucide-react';
import { abrirDocumento } from '../../api/documentos';
import { useCrudResource } from '../../hooks/useCrudResource';
import { formatoBytes, formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import DocumentoSustentoForm from './DocumentoSustentoForm';

// El unico dato que se escribe es el archivo; lo demas lo calcula el servidor al recibirlo.
const emptyForm = { archivo: '' };
const mapToForm = () => ({ archivo: '' });

const columns = [
  { key: 'nombre', header: 'Nombre' },
  { key: 'tipo', header: 'Tipo', render: (item) => (item.extension ? item.extension.toUpperCase() : '—') },
  { key: 'tamano_bytes', header: 'Tamaño', render: (item) => formatoBytes(item.tamano_bytes) },
  { key: 'fecha_registro', header: 'Registrado', render: (item) => formatoFecha(item.fecha_registro) },
];

const card = (item) => ({
  icon: FileText,
  title: item.nombre,
  meta: [item.tamano_bytes !== null && formatoBytes(item.tamano_bytes), formatoFecha(item.fecha_registro)],
  footer: item.extension && `.${item.extension}`,
});

export default function DocumentoSustentoPage() {
  const crud = useCrudResource({
    endpoint: '/documentos-sustento',
    emptyForm,
    mapToForm,
    validate: (form) => (!crud.editando && !form.archivo ? { archivo: ['Elige el archivo que quieres subir.'] } : {}),
    buildConfirmMessage: (item) => `¿Eliminar el documento "${item.nombre}"?`,
    deactivateErrorMessage: 'No se pudo eliminar el documento.',
  });

  const abrir = (item, descargar) => abrirDocumento(item.id, { descargar, nombre: item.nombre }).catch(() => window.alert('No se pudo abrir el documento.'));
  const acciones = [
    { icon: Eye, label: 'Ver', onClick: (item) => abrir(item, false), visible: (item) => item.tiene_archivo },
    { icon: Download, label: 'Descargar', onClick: (item) => abrir(item, true), visible: (item) => item.tiene_archivo },
  ];

  return (
    <PageContainer>
      <PageHeader title="Documentos de sustento" subtitle="Soporte · Documento de sustento">
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Subir documento
          </Button>
        )}
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
        acciones={acciones}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Reemplazar archivo' : 'Subir documento de sustento'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <DocumentoSustentoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} actual={crud.editando?.nombre} />
      </FormModal>
    </PageContainer>
  );
}
