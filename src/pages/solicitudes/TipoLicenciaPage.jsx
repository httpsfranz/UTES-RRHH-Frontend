import { FileCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, entero, requerido } from '../../utils/validaciones';
import { siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoLicenciaForm from './TipoLicenciaForm';

const { emptyForm, mapToForm } = formModel({
  TipoLicenciaCodigo: 'codigo',
  TipoLicenciaNombre: 'nombre',
  TipoLicenciaDescripcion: 'descripcion',
  TipoLicenciaMaximoDias: 'maximo_dias',
  TipoLicenciaBaseLegal: 'base_legal',
  TipoLicenciaConGoce: ['con_goce', true],
});

const validate = validador({
  TipoLicenciaCodigo: [requerido, codigo],
  TipoLicenciaNombre: [requerido],
  TipoLicenciaMaximoDias: [entero({ min: 1, max: 3650 })],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'con_goce', header: 'Con goce', render: (item) => siNo(item.con_goce) },
  { key: 'maximo_dias', header: 'Máx. días' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.con_goce ? 'Con goce de haber' : 'Sin goce de haber', item.maximo_dias && `Hasta ${item.maximo_dias} días`, item.base_legal],
  footer: item.codigo,
});

export default function TipoLicenciaPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-licencia',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoLicenciaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de licencia" subtitle="Solicitudes · Tipo de licencia">
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
        loadingMessage="Cargando tipos de licencia…"
        emptyIcon={FileCheck}
        emptyMessage="No hay tipos de licencia registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de licencia' : 'Nuevo tipo de licencia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoLicenciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
