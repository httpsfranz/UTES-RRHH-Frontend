import { Hospital, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, codigo, digitosExactos, requerido, telefonoPeruano, ubigeo, unoDe } from '../../utils/validaciones';
import { CATEGORIAS_EESS, valoresDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import EstablecimientoSaludForm from './EstablecimientoSaludForm';

const { emptyForm, mapToForm } = formModel({
  EessCodigo: 'codigo',
  EessCodigoRenipres: 'renipres',
  EessNombre: 'nombre',
  MicroredId: 'microred_id',
  TipoEstablecimientoId: 'tipo_establecimiento_id',
  EessCategoria: 'categoria',
  EessUbigeo: 'ubigeo',
  EessTelefono: 'telefono',
  EessDireccion: 'direccion',
  EessDescripcion: 'descripcion',
});

const validate = validador({
  EessCodigo: [requerido, codigo],
  EessCodigoRenipres: [digitosExactos(8, 'El código RENIPRESS')],
  EessNombre: [requerido],
  MicroredId: [requerido],
  TipoEstablecimientoId: [requerido],
  EessCategoria: [unoDe(valoresDe(CATEGORIAS_EESS))],
  EessUbigeo: [ubigeo],
  EessTelefono: [telefonoPeruano],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'microred', header: 'Microred', render: (item) => item.microred?.nombre ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => item.tipo?.nombre ?? '—' },
  { key: 'categoria', header: 'Categoría' },
];

const card = (item) => ({
  initial: item.nombre?.[0],
  title: item.nombre,
  meta: [item.microred?.nombre, item.tipo?.nombre, item.categoria && `Categoría ${item.categoria}`, item.telefono && `Tel. ${item.telefono}`],
  footer: item.codigo,
});

export default function EstablecimientoSaludPage() {
  const crud = useCrudResource({
    endpoint: '/establecimientos',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'EessEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Establecimientos de salud" subtitle="Organización · Establecimiento de salud">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo establecimiento
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando establecimientos de salud…"
        emptyIcon={Hospital}
        emptyMessage="No hay establecimientos de salud registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar establecimiento de salud' : 'Nuevo establecimiento de salud'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <EstablecimientoSaludForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
