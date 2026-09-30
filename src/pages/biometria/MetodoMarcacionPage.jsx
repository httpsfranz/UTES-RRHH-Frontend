import { Fingerprint, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import MetodoMarcacionForm from './MetodoMarcacionForm';

const { emptyForm, mapToForm } = formModel({
  MetodoMarcacionCodigo: 'codigo',
  MetodoMarcacionNombre: 'nombre',
  MetodoMarcacionDescripcion: 'descripcion',
});

const validate = validador({
  MetodoMarcacionCodigo: [requerido, codigo],
  MetodoMarcacionNombre: [requerido],
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

export default function MetodoMarcacionPage() {
  const crud = useCrudResource({
    endpoint: '/metodos-marcacion',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'MetodoMarcacionEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Métodos de marcación" subtitle="Biometría · Método de marcación">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo método
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando métodos de marcación…"
        emptyIcon={Fingerprint}
        emptyMessage="No hay métodos de marcación registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar método de marcación' : 'Nuevo método de marcación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <MetodoMarcacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
