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
import CondicionLaboralForm from './CondicionLaboralForm';

const { emptyForm, mapToForm } = formModel({
  CondicionLaboralCodigo: 'codigo',
  CondicionLaboralNombre: 'nombre',
  CondicionLaboralDescripcion: 'descripcion',
  CondicionLaboralEsPermanente: ['es_permanente', false],
  CondicionLaboralRequiereAirhsp: ['requiere_airhsp', false],
});

const validate = validador({
  CondicionLaboralCodigo: [requerido, codigo],
  CondicionLaboralNombre: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'es_permanente', header: 'Permanente', render: (item) => siNo(item.es_permanente) },
  { key: 'requiere_airhsp', header: 'AIRHSP', render: (item) => siNo(item.requiere_airhsp) },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.descripcion, item.es_permanente && 'Permanente', item.requiere_airhsp && 'Requiere AIRHSP'],
  footer: item.codigo,
});

export default function CondicionLaboralPage() {
  const crud = useCrudResource({
    endpoint: '/condiciones-laborales',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'CondicionLaboralEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Condiciones laborales" subtitle="Personal · Condición laboral">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva condición
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando condiciones laborales…"
        emptyIcon={Briefcase}
        emptyMessage="No hay condiciones laborales registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar condición laboral' : 'Nueva condición laboral'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CondicionLaboralForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
