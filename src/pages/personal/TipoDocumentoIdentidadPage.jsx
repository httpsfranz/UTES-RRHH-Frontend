import { BadgeCheck, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, entero, requerido } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TipoDocumentoIdentidadForm from './TipoDocumentoIdentidadForm';

const { emptyForm, mapToForm } = formModel({
  TipoDocumentoIdentidadCodigo: 'codigo',
  TipoDocumentoIdentidadNombre: 'nombre',
  TipoDocumentoIdentidadAbreviatura: 'abreviatura',
  TipoDocumentoIdentidadLongitud: 'longitud',
});

const validate = validador({
  TipoDocumentoIdentidadCodigo: [requerido, codigo],
  TipoDocumentoIdentidadNombre: [requerido],
  TipoDocumentoIdentidadLongitud: [entero({ min: 1, max: 20 })],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'abreviatura', header: 'Abreviatura' },
  { key: 'longitud', header: 'Longitud' },
];

const card = (item) => ({
  title: item.nombre,
  meta: [item.abreviatura, item.longitud && `${item.longitud} caracteres`],
  footer: item.codigo,
});

export default function TipoDocumentoIdentidadPage() {
  const crud = useCrudResource({
    endpoint: '/tipos-documento-identidad',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TipoDocumentoIdentidadEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Tipos de documento de identidad" subtitle="Personal · Tipo de documento de identidad">
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
        loadingMessage="Cargando tipos de documento de identidad…"
        emptyIcon={BadgeCheck}
        emptyMessage="No hay tipos de documento de identidad registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tipo de documento de identidad' : 'Nuevo tipo de documento de identidad'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TipoDocumentoIdentidadForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
