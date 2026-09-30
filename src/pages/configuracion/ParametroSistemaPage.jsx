import { Settings2, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ParametroSistemaForm from './ParametroSistemaForm';

const { emptyForm, mapToForm } = formModel({
  ParametroSistemaCodigo: 'codigo',
  ParametroSistemaValor: 'valor',
  ParametroSistemaDescripcion: 'descripcion',
});

const validate = validador({
  ParametroSistemaCodigo: [requerido, codigo],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'valor', header: 'Valor' },
  { key: 'descripcion', header: 'Descripción' },
];

const card = (item) => ({
  title: item.codigo,
  meta: [item.valor && `Valor: ${item.valor}`, item.descripcion],
  footer: `ID: ${item.id}`,
});

export default function ParametroSistemaPage() {
  const crud = useCrudResource({
    endpoint: '/parametros-sistema',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ParametroSistemaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Parámetros del sistema" subtitle="Configuración · Parámetro del sistema">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo parámetro
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando parámetros del sistema…"
        emptyIcon={Settings2}
        emptyMessage="No hay parámetros del sistema registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar parámetro del sistema' : 'Nuevo parámetro del sistema'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ParametroSistemaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
