import { ClipboardList, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import { siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ConceptoJustificacionForm from './ConceptoJustificacionForm';

const { emptyForm, mapToForm } = formModel({
  ConceptoJustificacionCodigo: 'codigo',
  ConceptoJustificacionNombre: 'nombre',
  ConceptoJustificacionDescripcion: 'descripcion',
  ConceptoJustificacionRequiereDocumento: ['requiere_documento', true],
  ConceptoJustificacionEsRemunerado: ['es_remunerado', true],
});

const validate = validador({
  ConceptoJustificacionCodigo: [requerido, codigo],
  ConceptoJustificacionNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'requiere_documento', header: 'Requiere documento', render: (item) => siNo(item.requiere_documento) },
  { key: 'es_remunerado', header: 'Remunerado', render: (item) => siNo(item.es_remunerado) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, item.requiere_documento && 'Requiere documento', item.es_remunerado ? 'Remunerado' : 'Sin goce de haber'],
  footer: item.codigo,
});

export default function ConceptoJustificacionPage() {
  const crud = useCrudResource({
    endpoint: '/conceptos-justificacion',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ConceptoJustificacionEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Conceptos de justificación" subtitle="Asistencia · Concepto de justificación">
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
        loadingMessage="Cargando conceptos de justificación…"
        emptyIcon={ClipboardList}
        emptyMessage="No hay conceptos de justificación registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar concepto de justificación' : 'Nuevo concepto de justificación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ConceptoJustificacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
