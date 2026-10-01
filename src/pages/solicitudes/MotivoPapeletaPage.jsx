import { ListChecks, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import MotivoPapeletaForm from './MotivoPapeletaForm';

const { emptyForm, mapToForm } = formModel({
  MotivoPapeletaCodigo: 'codigo',
  TipoPapeletaId: 'tipo_papeleta_id',
  MotivoPapeletaNombre: 'nombre',
  MotivoPapeletaDescripcion: 'descripcion',
});

const validate = validador({
  MotivoPapeletaCodigo: [requerido, codigo],
  TipoPapeletaId: [requerido],
  MotivoPapeletaNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'tipo', header: 'Tipo de papeleta', render: (item) => item.tipo_papeleta?.nombre ?? '—' },
];

const card = (item) => ({
  initial: item.nombre?.[0],
  title: item.nombre,
  meta: [item.tipo_papeleta?.nombre, item.descripcion],
  footer: item.codigo,
});

export default function MotivoPapeletaPage() {
  const crud = useCrudResource({
    endpoint: '/motivos-papeleta',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'MotivoPapeletaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Motivos de papeleta" subtitle="Solicitudes · Motivo de papeleta">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo motivo
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando motivos de papeleta…"
        emptyIcon={ListChecks}
        emptyMessage="No hay motivos de papeleta registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar motivo de papeleta' : 'Nuevo motivo de papeleta'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <MotivoPapeletaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
