import { Percent, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TablaToleranciaForm from './TablaToleranciaForm';

const { emptyForm, mapToForm } = formModel({
  TablaToleranciaCodigo: 'codigo',
  TablaToleranciaNombre: 'nombre',
  TablaToleranciaDescripcion: 'descripcion',
});

const validate = validador({
  TablaToleranciaCodigo: [requerido, codigo],
  TablaToleranciaNombre: [requerido],
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

export default function TablaToleranciaPage() {
  const crud = useCrudResource({
    endpoint: '/tablas-tolerancia',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TablaToleranciaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tablas de tolerancia" subtitle="Configuración · Tabla de tolerancia">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva tabla
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando tablas de tolerancia…"
        emptyIcon={Percent}
        emptyMessage="No hay tablas de tolerancia registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tabla de tolerancia' : 'Nueva tabla de tolerancia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TablaToleranciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
