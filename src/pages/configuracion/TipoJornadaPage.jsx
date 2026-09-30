import { Clock, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoJornadaForm from './TipoJornadaForm';

const { emptyForm, mapToForm } = formModel({
  TipoJornadaCodigo: 'codigo',
  TipoJornadaNombre: 'nombre',
  TipoJornadaDescripcion: 'descripcion',
});

const validate = validador({
  TipoJornadaCodigo: [requerido, codigo],
  TipoJornadaNombre: [requerido],
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

export default function TipoJornadaPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-jornada',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoJornadaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de jornada" subtitle="Configuración · Tipo de jornada">
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
        loadingMessage="Cargando tipos de jornada…"
        emptyIcon={Clock}
        emptyMessage="No hay tipos de jornada registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de jornada' : 'Nuevo tipo de jornada'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoJornadaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
