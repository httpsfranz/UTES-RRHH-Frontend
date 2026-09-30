import { Scale, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import RegimenLaboralForm from './RegimenLaboralForm';

const { emptyForm, mapToForm } = formModel({
  RegimenLaboralCodigo: 'codigo',
  RegimenLaboralNombre: 'nombre',
  RegimenLaboralBaseLegal: 'base_legal',
  RegimenLaboralDescripcion: 'descripcion',
});

const validate = validador({
  RegimenLaboralCodigo: [requerido, codigo],
  RegimenLaboralNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'base_legal', header: 'Base legal' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.base_legal, item.descripcion],
  footer: item.codigo,
});

export default function RegimenLaboralPage() {
  const crud = useCrudResource({
    endpoint: '/regimenes-laborales',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'RegimenLaboralEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Regímenes laborales" subtitle="Personal · Régimen laboral">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo régimen
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando regímenes laborales…"
        emptyIcon={Scale}
        emptyMessage="No hay regímenes laborales registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar régimen laboral' : 'Nuevo régimen laboral'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <RegimenLaboralForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
