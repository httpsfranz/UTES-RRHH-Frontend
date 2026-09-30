import { Repeat, Plus } from 'lucide-react';
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
import TipoCambioTurnoForm from './TipoCambioTurnoForm';

const { emptyForm, mapToForm } = formModel({
  TipoCambioTurnoCodigo: 'codigo',
  TipoCambioTurnoNombre: 'nombre',
  TipoCambioTurnoDescripcion: 'descripcion',
  TipoCambioTurnoRequiereReemplazante: ['requiere_reemplazante', false],
});

const validate = validador({
  TipoCambioTurnoCodigo: [requerido, codigo],
  TipoCambioTurnoNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'requiere_reemplazante', header: 'Reemplazante', render: (item) => siNo(item.requiere_reemplazante) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, item.requiere_reemplazante && 'Requiere reemplazante'],
  footer: item.codigo,
});

export default function TipoCambioTurnoPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-cambio-turno',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoCambioTurnoEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de cambio de turno" subtitle="Programación · Tipo de cambio de turno">
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
        loadingMessage="Cargando tipos de cambio de turno…"
        emptyIcon={Repeat}
        emptyMessage="No hay tipos de cambio de turno registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de cambio de turno' : 'Nuevo tipo de cambio de turno'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoCambioTurnoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
