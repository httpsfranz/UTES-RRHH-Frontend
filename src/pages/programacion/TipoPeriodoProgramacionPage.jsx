import { CalendarRange, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, entero, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoPeriodoProgramacionForm from './TipoPeriodoProgramacionForm';

const { emptyForm, mapToForm } = formModel({
  TipoPeriodoProgramacionCodigo: 'codigo',
  TipoPeriodoProgramacionNombre: 'nombre',
  TipoPeriodoProgramacionDias: 'dias',
  TipoPeriodoProgramacionDescripcion: 'descripcion',
});

const validate = validador({
  TipoPeriodoProgramacionCodigo: [requerido, codigo],
  TipoPeriodoProgramacionNombre: [requerido],
  TipoPeriodoProgramacionDias: [entero({ min: 1, max: 366 })],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'dias', header: 'Días' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.dias && `${item.dias} días`, item.descripcion],
  footer: item.codigo,
});

export default function TipoPeriodoProgramacionPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-periodo-programacion',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoPeriodoProgramacionEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de período de programación" subtitle="Programación · Tipo de período">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo tipo de período
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando tipos de período…"
        emptyIcon={CalendarRange}
        emptyMessage="No hay tipos de período registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de período' : 'Nuevo tipo de período'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoPeriodoProgramacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
