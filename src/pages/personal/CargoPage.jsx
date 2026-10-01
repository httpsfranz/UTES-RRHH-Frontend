import { Briefcase, Plus } from 'lucide-react';
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
import CargoForm from './CargoForm';

const { emptyForm, mapToForm } = formModel({
  CargoCodigo: 'codigo',
  GrupoOcupacionalId: 'grupo_ocupacional_id',
  CargoNombre: 'nombre',
  CargoDescripcion: 'descripcion',
  CargoEsJefatura: ['es_jefatura', false],
});

const validate = validador({
  CargoCodigo: [codigo],
  GrupoOcupacionalId: [requerido],
  CargoNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'grupo', header: 'Grupo ocupacional', render: (item) => item.grupo_ocupacional?.nombre ?? '—' },
  { key: 'es_jefatura', header: 'Jefatura', render: (item) => siNo(item.es_jefatura) },
];

const card = (item) => ({
  initial: item.nombre?.[0],
  title: item.nombre,
  meta: [item.grupo_ocupacional?.nombre, item.es_jefatura && 'Cargo de jefatura', item.descripcion],
  footer: item.codigo ?? 'Sin código',
});

export default function CargoPage() {
  const crud = useCrudResource({
    endpoint: '/cargos',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'CargoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Cargos" subtitle="Personal · Cargo">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo cargo
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando cargos…"
        emptyIcon={Briefcase}
        emptyMessage="No hay cargos registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar cargo' : 'Nuevo cargo'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CargoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
