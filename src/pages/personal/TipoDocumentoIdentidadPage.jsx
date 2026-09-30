import { FileText, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
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
import TipoDocumentoIdentidadForm from './TipoDocumentoIdentidadForm';

const campoVacio = {
  TipoDocumentoIdentidadCodigo: '',
  TipoDocumentoIdentidadNombre: '',
  TipoDocumentoIdentidadAbreviatura: '',
  TipoDocumentoIdentidadLongitud: '',
  TipoDocumentoIdentidadEstado: true,
};

function mapToForm(tipoDocumento) {
  return {
    TipoDocumentoIdentidadCodigo:
      tipoDocumento.TipoDocumentoIdentidadCodigo ?? tipoDocumento.codigo ?? '',

    TipoDocumentoIdentidadNombre:
      tipoDocumento.TipoDocumentoIdentidadNombre ?? tipoDocumento.nombre ?? '',

    TipoDocumentoIdentidadAbreviatura:
      tipoDocumento.TipoDocumentoIdentidadAbreviatura ?? tipoDocumento.abreviatura ?? '',

    TipoDocumentoIdentidadLongitud:
      tipoDocumento.TipoDocumentoIdentidadLongitud ?? tipoDocumento.longitud ?? '',

    TipoDocumentoIdentidadEstado:
      Boolean(tipoDocumento.TipoDocumentoIdentidadEstado ?? tipoDocumento.activo ?? true),
  };
}

export default function TipoDocumentoIdentidadPage() {
  const {
    items: tiposDocumentos,
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
    endpoint: '/tipos-documento-identidad',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage:
      'No se pudo desactivar el tipo de documento de identidad.',
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Tipos de Documento de Identidad"
        subtitle="Personal · Tipo de documento de identidad"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo de documento
        </Button>
      </PageHeader>

      <div className="mb-6">
        <SearchInput
          value={buscar}
          onChange={setBuscar}
          onSubmit={() => cargar()}
        />
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      {loading ? (
        <LoadingState message="Cargando tipos de documentos de identidad…" />
      ) : tiposDocumentos.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="No hay tipos de documentos de identidad registrados todavía."
        />
      ) : (
        <CardGrid>
          {tiposDocumentos.map((item) => {
            const id = item.TipoDocumentoIdentidadId ?? item.id;
            const nombre = item.TipoDocumentoIdentidadNombre ?? item.nombre;
            const codigo = item.TipoDocumentoIdentidadCodigo ?? item.codigo;
            const abreviatura = item.TipoDocumentoIdentidadAbreviatura ?? item.abreviatura;
            const longitud = item.TipoDocumentoIdentidadLongitud ?? item.longitud;
            const activo = Boolean(item.TipoDocumentoIdentidadEstado ?? item.activo);

            return (
              <EntityCard
                key={id}
                icon={FileText}
                active={activo}
                title={nombre}
                meta={[
                  codigo && `Código: ${codigo}`,
                  abreviatura && `Abreviatura: ${abreviatura}`,
                  longitud && `Longitud: ${longitud}`,
                ].filter(Boolean)}
                footer={`ID: ${id}`}
                onEdit={() => abrirEditar(item)}
                onToggle={activo ? () => desactivar(item) : undefined}
              />
            );
          })}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={
          editando
            ? 'Editar tipo de documento de identidad'
            : 'Nuevo tipo de documento de identidad'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <TipoDocumentoIdentidadForm
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
    </div>
  );
}