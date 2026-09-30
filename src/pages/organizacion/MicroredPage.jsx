import { Building2, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, requerido, telefonoPeruano, ubigeo } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import MicroredForm from './MicroredForm';

const { emptyForm, mapToForm } = formModel({
  MicroredCodigo: 'codigo',
  MicroredUbigeo: 'ubigeo',
  MicroredNombre: 'nombre',
  MicroredDistrito: 'distrito',
  MicroredTelefono: 'telefono',
  MicroredDireccion: 'direccion',
  MicroredDescripcion: 'descripcion',
});

const validate = validador({
  MicroredCodigo: [requerido, codigo],
  MicroredUbigeo: [ubigeo],
  MicroredNombre: [requerido],
  MicroredTelefono: [telefonoPeruano],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'distrito', header: 'Distrito' },
  { key: 'telefono', header: 'Teléfono' },
];

const card = (item) => ({
  initial: item.nombre?.[0],
  title: item.nombre,
  meta: [item.distrito, item.telefono && `Tel. ${item.telefono}`],
  footer: item.codigo,
});

export default function MicroredPage() {
  const crud = useCrudResource({
    endpoint: '/microredes',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'MicroredEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Microredes" subtitle="Organización · Microred">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva microred
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando microredes…"
        emptyIcon={Building2}
        emptyMessage="No hay microredes registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar microred' : 'Nueva microred'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <MicroredForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
