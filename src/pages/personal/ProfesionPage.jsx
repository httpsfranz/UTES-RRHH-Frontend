import { GraduationCap, Plus } from 'lucide-react';
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
import ProfesionForm from './ProfesionForm';

const { emptyForm, mapToForm } = formModel({
  ProfesionCodigo: 'codigo',
  ProfesionNombre: 'nombre',
  ProfesionDescripcion: 'descripcion',
  ProfesionRequiereColegiatura: ['requiere_colegiatura', false],
});

const validate = validador({
  ProfesionCodigo: [requerido, codigo],
  ProfesionNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'requiere_colegiatura', header: 'Colegiatura', render: (item) => siNo(item.requiere_colegiatura) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, item.requiere_colegiatura && 'Requiere colegiatura'],
  footer: item.codigo,
});

export default function ProfesionPage() {
  const crud = useCrudResource({
    endpoint: '/profesiones',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ProfesionEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Profesiones" subtitle="Personal · Profesión">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva profesión
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando profesiones…"
        emptyIcon={GraduationCap}
        emptyMessage="No hay profesiones registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar profesión' : 'Nueva profesión'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ProfesionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
