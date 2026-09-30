import { FileBadge, Plus } from 'lucide-react';
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
import TipoPapeletaForm from './TipoPapeletaForm';

const { emptyForm, mapToForm } = formModel({
  TipoPapeletaCodigo: 'codigo',
  TipoPapeletaNombre: 'nombre',
  TipoPapeletaDescripcion: 'descripcion',
  TipoPapeletaEsDescontable: ['es_descontable', false],
  TipoPapeletaRequiereSustento: ['requiere_sustento', false],
  TipoPapeletaAfectaJornada: ['afecta_jornada', true],
  TipoPapeletaEsCompensable: ['es_compensable', false],
});

const validate = validador({
  TipoPapeletaCodigo: [requerido, codigo],
  TipoPapeletaNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'es_descontable', header: 'Descontable', render: (item) => siNo(item.es_descontable) },
  { key: 'requiere_sustento', header: 'Sustento', render: (item) => siNo(item.requiere_sustento) },
  { key: 'es_compensable', header: 'Compensable', render: (item) => siNo(item.es_compensable) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, item.es_descontable && 'Descontable', item.requiere_sustento && 'Requiere sustento', item.es_compensable && 'Compensable'],
  footer: item.codigo,
});

export default function TipoPapeletaPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-papeleta',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoPapeletaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de papeleta" subtitle="Solicitudes · Tipo de papeleta">
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
        loadingMessage="Cargando tipos de papeleta…"
        emptyIcon={FileBadge}
        emptyMessage="No hay tipos de papeleta registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de papeleta' : 'Nuevo tipo de papeleta'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoPapeletaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
