import { Hourglass, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, decimal, fecha, noAnteriorA, noMenorQue, requerido } from '../../utils/validaciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ParametroJornadaForm from './ParametroJornadaForm';

const { emptyForm, mapToForm } = formModel({
  TipoJornadaId: 'tipo_jornada_id',
  ParametroJornadaVigenciaDesde: 'vigencia_desde',
  ParametroJornadaVigenciaHasta: 'vigencia_hasta',
  ParametroJornadaHorasDiarias: 'horas_diarias',
  ParametroJornadaHorasSemanales: 'horas_semanales',
  ParametroJornadaHorasMensuales: 'horas_mensuales',
});

const validate = validador({
  TipoJornadaId: [requerido],
  ParametroJornadaVigenciaDesde: [requerido, fecha],
  ParametroJornadaVigenciaHasta: [fecha, noAnteriorA('ParametroJornadaVigenciaDesde', 'La vigencia hasta no puede ser anterior a la vigencia desde.')],
  ParametroJornadaHorasDiarias: [requerido, decimal({ min: 0, max: 24 })],
  ParametroJornadaHorasSemanales: [decimal({ min: 0, max: 168 }), noMenorQue('ParametroJornadaHorasDiarias', 'Las horas semanales no pueden ser menores que las diarias.')],
  ParametroJornadaHorasMensuales: [decimal({ min: 0, max: 744 }), noMenorQue('ParametroJornadaHorasSemanales', 'Las horas mensuales no pueden ser menores que las semanales.')],
});

const columns = [
  { key: 'jornada', header: 'Jornada', render: (item) => item.tipo_jornada?.nombre ?? '—' },
  { key: 'vigencia', header: 'Vigencia', render: (item) => `${formatoFecha(item.vigencia_desde)} – ${item.vigencia_hasta ? formatoFecha(item.vigencia_hasta) : 'sin fin'}` },
  { key: 'horas_diarias', header: 'Horas/día' },
  { key: 'horas_semanales', header: 'Horas/semana' },
  { key: 'horas_mensuales', header: 'Horas/mes' },
];

const card = (item) => ({
  icon: Hourglass,
  title: item.tipo_jornada?.nombre ?? 'Jornada',
  meta: [`Desde ${formatoFecha(item.vigencia_desde)}${item.vigencia_hasta ? ` hasta ${formatoFecha(item.vigencia_hasta)}` : ' (sin fin)'}`, `${item.horas_diarias} h diarias`, item.horas_semanales && `${item.horas_semanales} h semanales`, item.horas_mensuales && `${item.horas_mensuales} h mensuales`],
  footer: `ID: ${item.id}`,
});

export default function ParametroJornadaPage() {
  const crud = useCrudResource({
    endpoint: '/parametros-jornada',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ParametroJornadaEstado',
    buildConfirmMessage: (item) => `¿Desactivar "${item.nombre}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Parámetros de jornada" subtitle="Configuración · Parámetro de jornada">
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
        loadingMessage="Cargando parámetros de jornada…"
        emptyIcon={Hourglass}
        emptyMessage="No hay parámetros de jornada registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar parámetro de jornada' : 'Nuevo parámetro de jornada'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ParametroJornadaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
