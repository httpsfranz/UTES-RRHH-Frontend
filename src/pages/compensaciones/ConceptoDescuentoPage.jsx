import { Receipt, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ConceptoDescuentoForm from './ConceptoDescuentoForm';

const { emptyForm, mapToForm } = formModel({
  ConceptoDescuentoCodigo: 'codigo',
  ConceptoDescuentoNombre: 'nombre',
  ConceptoDescuentoDescripcion: 'descripcion',
});

const validate = validador({
  ConceptoDescuentoCodigo: [requerido, codigo],
  ConceptoDescuentoNombre: [requerido],
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

export default function ConceptoDescuentoPage() {
  const crud = useCrudResource({
    endpoint: '/conceptos-descuento',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ConceptoDescuentoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Conceptos de descuento" subtitle="Compensaciones · Concepto de descuento">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo concepto
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando conceptos de descuento…"
        emptyIcon={Receipt}
        emptyMessage="No hay conceptos de descuento registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar concepto de descuento' : 'Nuevo concepto de descuento'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ConceptoDescuentoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
