import { Plus, ScanFace } from 'lucide-react';
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
import DispositivoMarcacionForm from './DispositivoMarcacionForm';

const campoVacio = {
  DispositivoMarcacionCodigo: '',
  DispositivoMarcacionNombre: '',
  DispositivoMarcacionTipo: '',
  EessId: '',
  DispositivoMarcacionUbicacion: '',
  DispositivoMarcacionIp: '',
};

// El Resource de este recurso todavia devuelve las columnas de SQL Server tal
// cual (PascalCase), no el camelCase que usan los modulos ya migrados (ver
// Paso 0 de la guia de modulos CRUD) — asi que el form escribe con esos mismos
// nombres de columna y aqui solo se rellenan los '' por defecto al editar.
function mapToForm(dispositivo) {
  return {
    DispositivoMarcacionCodigo: dispositivo.DispositivoMarcacionCodigo ?? '',
    DispositivoMarcacionNombre: dispositivo.DispositivoMarcacionNombre ?? '',
    DispositivoMarcacionTipo: dispositivo.DispositivoMarcacionTipo ?? '',
    EessId: dispositivo.EessId ?? '',
    DispositivoMarcacionUbicacion: dispositivo.DispositivoMarcacionUbicacion ?? '',
    DispositivoMarcacionIp: dispositivo.DispositivoMarcacionIp ?? '',
  };
}

export default function DispositivoMarcacionPage() {
  const {
    items: dispositivos,
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
    endpoint: '/dispositivos-marcacion',
    emptyForm: campoVacio,
    mapToForm,
    idKey: 'DispositivoMarcacionId',
    buildConfirmMessage: (item) => `¿Desactivar "${item.DispositivoMarcacionNombre}"?`,
    deactivateErrorMessage: 'No se pudo desactivar el dispositivo de marcación.',
  });

  return (
    <PageContainer>
      <PageHeader title="Dispositivos de Marcación" subtitle="Biometría · Dispositivo de marcación">
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo dispositivo
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>

      {loading ? (
        <LoadingState message="Cargando dispositivos de marcación…" />
      ) : dispositivos.length === 0 ? (
        <EmptyState icon={ScanFace} message="No hay dispositivos de marcación registrados todavía." />
      ) : (
        <CardGrid>
          {dispositivos.map((dispositivo) => (
            <EntityCard
              key={dispositivo.DispositivoMarcacionId}
              icon={ScanFace}
              active={dispositivo.DispositivoMarcacionEstado}
              title={dispositivo.DispositivoMarcacionNombre}
              meta={[
                dispositivo.DispositivoMarcacionTipo && `Tipo: ${dispositivo.DispositivoMarcacionTipo}`,
                dispositivo.DispositivoMarcacionUbicacion,
                dispositivo.DispositivoMarcacionIp && `IP: ${dispositivo.DispositivoMarcacionIp}`,
              ]}
              footer={dispositivo.DispositivoMarcacionCodigo}
              onEdit={() => abrirEditar(dispositivo)}
              onToggle={dispositivo.DispositivoMarcacionEstado ? () => desactivar(dispositivo) : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar dispositivo de marcación' : 'Nuevo dispositivo de marcación'}
      >
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <DispositivoMarcacionForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </PageContainer>
  );
}
