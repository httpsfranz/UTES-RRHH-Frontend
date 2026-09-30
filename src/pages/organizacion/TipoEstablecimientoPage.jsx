import { Landmark, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoEstablecimientoForm from './TipoEstablecimientoForm';

const { emptyForm, mapToForm } = formModel({
  TipoEstablecimientoCodigo: 'codigo',
  TipoEstablecimientoNombre: 'nombre',
  TipoEstablecimientoDescripcion: 'descripcion',
});

const validate = validador({
  TipoEstablecimientoCodigo: [requerido, codigo],
  TipoEstablecimientoNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'descripcion', header: 'Descripción' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion],
  footer: item.codigo,
});

export default function TipoEstablecimientoPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-establecimiento',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoEstablecimientoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de establecimiento" subtitle="Organización · Tipo de establecimiento">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo tipo
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando tipos de establecimiento…"
        emptyIcon={Landmark}
        emptyMessage="No hay tipos de establecimiento registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de establecimiento' : 'Nuevo tipo de establecimiento'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoEstablecimientoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
