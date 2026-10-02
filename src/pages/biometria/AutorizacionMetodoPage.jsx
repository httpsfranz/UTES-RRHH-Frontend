import { Plus, ShieldCheck } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, noAnteriorA, requerido, validador } from '../../utils/validaciones';
import { formatoFecha, siNo } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import AutorizacionMetodoForm from './AutorizacionMetodoForm';

const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  MetodoMarcacionId: 'metodo_marcacion_id',
  AutorizacionMetodoFechaInicio: 'fecha_inicio',
  AutorizacionMetodoFechaFin: 'fecha_fin',
});

const validate = validador({
  TrabajadorId: [requerido],
  MetodoMarcacionId: [requerido],
  AutorizacionMetodoFechaInicio: [requerido, fecha],
  AutorizacionMetodoFechaFin: [fecha, noAnteriorA('AutorizacionMetodoFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
});

const vigencia = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'sin fin'}`;

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'metodo', header: 'Método autorizado', render: (item) => item.metodo?.nombre ?? '—' },
  { key: 'vigencia', header: 'Vigencia', render: vigencia },
  { key: 'vigente', header: 'Vigente hoy', render: (item) => siNo(item.vigente) },
];

const card = (item) => ({
  icon: ShieldCheck,
  title: item.trabajador?.nombre_completo ?? 'Autorización',
  meta: [item.metodo?.nombre, vigencia(item), item.vigente ? 'Vigente hoy' : 'No vigente hoy'],
  footer: item.metodo?.codigo,
});

export default function AutorizacionMetodoPage() {
  const crud = useCrudResource({
    endpoint: '/autorizaciones-metodo',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'AutorizacionMetodoEstado',
    buildConfirmMessage: (item) => `¿Desactivar la autorización de ${item.metodo?.nombre ?? 'método'} de "${item.trabajador?.nombre_completo ?? ''}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Autorizaciones de método" subtitle="Biometría · Autorización de método">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva autorización
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o método…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando autorizaciones…"
        emptyIcon={ShieldCheck}
        emptyMessage="No hay autorizaciones de método registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar autorización' : 'Nueva autorización de método'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <AutorizacionMetodoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
