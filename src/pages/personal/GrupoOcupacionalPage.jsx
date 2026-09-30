import { Users, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import GrupoOcupacionalForm from './GrupoOcupacionalForm';

const { emptyForm, mapToForm } = formModel({
  GrupoOcupacionalCodigo: 'codigo',
  GrupoOcupacionalNombre: 'nombre',
  GrupoOcupacionalDescripcion: 'descripcion',
});

const validate = validador({
  GrupoOcupacionalCodigo: [requerido, codigo],
  GrupoOcupacionalNombre: [requerido],
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

export default function GrupoOcupacionalPage() {
  const crud = useCrudResource({
    endpoint: '/grupos-ocupacionales',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'GrupoOcupacionalEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Grupos ocupacionales" subtitle="Personal · Grupo ocupacional">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo grupo
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando grupos ocupacionales…"
        emptyIcon={Users}
        emptyMessage="No hay grupos ocupacionales registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar grupo ocupacional' : 'Nuevo grupo ocupacional'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <GrupoOcupacionalForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
