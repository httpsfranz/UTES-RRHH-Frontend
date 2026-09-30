import { Activity, Plus } from 'lucide-react';
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
import EstadoAsistenciaForm from './EstadoAsistenciaForm';

const { emptyForm, mapToForm } = formModel({
  EstadoAsistenciaCodigo: 'codigo',
  EstadoAsistenciaNombre: 'nombre',
  EstadoAsistenciaDescripcion: 'descripcion',
  EstadoAsistenciaEsFalta: ['es_falta', false],
  EstadoAsistenciaEsDescontable: ['es_descontable', false],
  EstadoAsistenciaEsLaborable: ['es_laborable', true],
});

const validate = validador({
  EstadoAsistenciaCodigo: [requerido, codigo],
  EstadoAsistenciaNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'es_falta', header: 'Falta', render: (item) => siNo(item.es_falta) },
  { key: 'es_descontable', header: 'Descontable', render: (item) => siNo(item.es_descontable) },
  { key: 'es_laborable', header: 'Laborable', render: (item) => siNo(item.es_laborable) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, item.es_falta && 'Falta justificable', item.es_descontable && 'Descontable', !item.es_laborable && 'No laborable'],
  footer: item.codigo,
});

export default function EstadoAsistenciaPage() {
  const crud = useCrudResource({
    endpoint: '/estados-asistencia',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'EstadoAsistenciaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Estados de asistencia" subtitle="Asistencia · Estado de asistencia">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo estado
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando estados de asistencia…"
        emptyIcon={Activity}
        emptyMessage="No hay estados de asistencia registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar estado de asistencia' : 'Nuevo estado de asistencia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <EstadoAsistenciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
