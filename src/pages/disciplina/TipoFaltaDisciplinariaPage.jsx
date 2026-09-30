import { Gavel, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido, unoDe } from '../../utils/validaciones';
import { GRAVEDADES, etiquetaDe, valoresDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoFaltaDisciplinariaForm from './TipoFaltaDisciplinariaForm';

const { emptyForm, mapToForm } = formModel({
  TipoFaltaDisciplinariaCodigo: 'codigo',
  TipoFaltaDisciplinariaNombre: 'nombre',
  TipoFaltaDisciplinariaGravedad: 'gravedad',
  TipoFaltaDisciplinariaBaseLegal: 'base_legal',
  TipoFaltaDisciplinariaDescripcion: 'descripcion',
});

const validate = validador({
  TipoFaltaDisciplinariaCodigo: [requerido, codigo],
  TipoFaltaDisciplinariaNombre: [requerido],
  TipoFaltaDisciplinariaGravedad: [unoDe(valoresDe(GRAVEDADES))],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'gravedad', header: 'Gravedad', render: (item) => item.gravedad ? etiquetaDe(GRAVEDADES, item.gravedad) : '—' },
  { key: 'base_legal', header: 'Base legal' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.gravedad && `Gravedad: ${etiquetaDe(GRAVEDADES, item.gravedad)}`, item.base_legal, item.descripcion],
  footer: item.codigo,
});

export default function TipoFaltaDisciplinariaPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-falta-disciplinaria',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoFaltaDisciplinariaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de falta disciplinaria" subtitle="Disciplina · Tipo de falta disciplinaria">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo tipo de falta
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando tipos de falta disciplinaria…"
        emptyIcon={Gavel}
        emptyMessage="No hay tipos de falta disciplinaria registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de falta disciplinaria' : 'Nuevo tipo de falta disciplinaria'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoFaltaDisciplinariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
