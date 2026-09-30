import { UserCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoResponsabilidadForm from './TipoResponsabilidadForm';

const { emptyForm, mapToForm } = formModel({
  TipoResponsabilidadCodigo: 'codigo',
  TipoResponsabilidadNombre: 'nombre',
  TipoResponsabilidadDescripcion: 'descripcion',
});

const validate = validador({
  TipoResponsabilidadCodigo: [requerido, codigo],
  TipoResponsabilidadNombre: [requerido],
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

export default function TipoResponsabilidadPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-responsabilidad',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoResponsabilidadEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de responsabilidad" subtitle="Organización · Tipo de responsabilidad">
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
        loadingMessage="Cargando tipos de responsabilidad…"
        emptyIcon={UserCheck}
        emptyMessage="No hay tipos de responsabilidad registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de responsabilidad' : 'Nuevo tipo de responsabilidad'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoResponsabilidadForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
