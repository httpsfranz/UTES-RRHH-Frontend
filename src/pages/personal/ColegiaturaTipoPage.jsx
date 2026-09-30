import { IdCard, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ColegiaturaTipoForm from './ColegiaturaTipoForm';

const { emptyForm, mapToForm } = formModel({
  ColegiaturaTipoCodigo: 'codigo',
  ColegiaturaTipoNombre: 'nombre',
  ProfesionId: 'profesion_id',
  ColegiaturaTipoEntidad: 'entidad',
  ColegiaturaTipoDescripcion: 'descripcion',
});

const validate = validador({
  ColegiaturaTipoCodigo: [requerido, codigo],
  ColegiaturaTipoNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'profesion', header: 'Profesión', render: (item) => item.profesion?.nombre ?? '—' },
  { key: 'entidad', header: 'Entidad' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.profesion?.nombre, item.entidad],
  footer: item.codigo,
});

export default function ColegiaturaTipoPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-colegiatura',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ColegiaturaTipoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de colegiatura" subtitle="Personal · Tipo de colegiatura">
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
        loadingMessage="Cargando tipos de colegiatura…"
        emptyIcon={IdCard}
        emptyMessage="No hay tipos de colegiatura registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de colegiatura' : 'Nuevo tipo de colegiatura'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ColegiaturaTipoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
