import { CalendarClock, Plus } from 'lucide-react';
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
import HorarioForm from './HorarioForm';

const { emptyForm, mapToForm } = formModel({
  HorarioCodigo: 'codigo',
  HorarioNombre: 'nombre',
  TipoJornadaId: 'tipo_jornada_id',
  EessId: 'eess_id',
  HorarioDescripcion: 'descripcion',
  HorarioEsRotativo: ['es_rotativo', false],
});

const validate = validador({
  HorarioCodigo: [requerido, codigo],
  HorarioNombre: [requerido],
  TipoJornadaId: [requerido],
});

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'jornada', header: 'Jornada', render: (item) => item.tipo_jornada?.nombre ?? '—' },
  { key: 'eess', header: 'Alcance', render: (item) => item.eess?.nombre ?? 'Toda la Red' },
  { key: 'es_rotativo', header: 'Rotativo', render: (item) => siNo(item.es_rotativo) },
];

const card = (item) => ({
  icon: CalendarClock,
  title: item.nombre,
  meta: [item.tipo_jornada?.nombre, item.eess?.nombre ?? 'Toda la Red', item.es_rotativo && 'Rotativo', item.descripcion],
  footer: item.codigo,
});

export default function HorarioPage() {
  const crud = useCrudResource({
    endpoint: '/horarios',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'HorarioEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Horarios" subtitle="Configuración · Horario">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo horario
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando horarios…"
        emptyIcon={CalendarClock}
        emptyMessage="No hay horarios registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar horario' : 'Nuevo horario'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <HorarioForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
