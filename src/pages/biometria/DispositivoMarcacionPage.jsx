import { ScanFace, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, ip, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import DispositivoMarcacionForm from './DispositivoMarcacionForm';

const { emptyForm, mapToForm } = formModel({
  DispositivoMarcacionCodigo: 'codigo',
  DispositivoMarcacionNombre: 'nombre',
  DispositivoMarcacionTipo: 'tipo',
  EessId: 'eess_id',
  DispositivoMarcacionUbicacion: 'ubicacion',
  DispositivoMarcacionIp: 'ip',
});

const validate = validador({
  DispositivoMarcacionCodigo: [requerido, codigo],
  DispositivoMarcacionNombre: [requerido],
  DispositivoMarcacionTipo: [requerido],
  DispositivoMarcacionIp: [ip],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'tipo', header: 'Tipo' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? 'Sin asignar' },
  { key: 'ip', header: 'IP' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.tipo && `Tipo: ${item.tipo}`, item.eess?.nombre, item.ubicacion, item.ip && `IP: ${item.ip}`],
  footer: item.codigo,
});

export default function DispositivoMarcacionPage() {
  const crud = useCrudResource({
    endpoint: '/dispositivos-marcacion',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'DispositivoMarcacionEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Dispositivos de marcación" subtitle="Biometría · Dispositivo de marcación">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo dispositivo
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando dispositivos de marcación…"
        emptyIcon={ScanFace}
        emptyMessage="No hay dispositivos de marcación registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar dispositivo de marcación' : 'Nuevo dispositivo de marcación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <DispositivoMarcacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
