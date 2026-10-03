import { Gavel, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, noAnteriorA, numeroPlaza, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_PAD, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ExpedientePadForm from './ExpedientePadForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  TipoFaltaDisciplinariaId: 'tipo_falta_disciplinaria_id',
  DocumentoSustentoId: 'documento_sustento_id',
  ExpedientePadNumero: 'numero',
  ExpedientePadFechaInicio: 'fecha_inicio',
  ExpedientePadFechaFin: 'fecha_fin',
  ExpedientePadDescripcion: 'descripcion',
  ExpedientePadSancion: 'sancion',
  ExpedientePadEstado: ['estado', 'INICIADO'],
});

// RIT Art. 101: la amonestacion verbal no pasa por el PAD; la sancion es una de la Ley 30057.
const sancion = (valor) => {
  if (/verbal/i.test(valor)) return 'La amonestación verbal no pasa por el procedimiento disciplinario (RIT, Art. 101).';
  return /amonestaci[oó]n|suspensi[oó]n|destituci[oó]n/i.test(valor) ? null : 'Debe ser una sanción de la Ley 30057: amonestación escrita, suspensión sin goce de remuneraciones o destitución.';
};

const validate = validador({
  VinculoLaboralId: [requerido],
  TipoFaltaDisciplinariaId: [requerido],
  ExpedientePadNumero: [numeroPlaza],
  ExpedientePadFechaInicio: [requerido, fecha],
  ExpedientePadFechaFin: [
    requeridoSi((form) => ['RESUELTO', 'ARCHIVADO'].includes(form.ExpedientePadEstado), 'Indica la fecha en que terminó el procedimiento.'),
    fecha,
    noAnteriorA('ExpedientePadFechaInicio', 'La fecha final no puede ser anterior a la inicial.'),
  ],
  ExpedientePadSancion: [requeridoSi((form) => form.ExpedientePadEstado === 'RESUELTO', 'Indica la sanción con la que se resuelve el expediente.'), sancion],
});

const enCurso = (item) => item.estado === 'INICIADO' || item.estado === 'EN_PROCESO';

const columns = [
  { key: 'numero', header: 'N.º', render: (item) => item.numero ?? '—' },
  { key: 'trabajador', header: 'Servidor', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'falta', header: 'Falta', render: (item) => item.tipo_falta?.nombre ?? '—' },
  { key: 'inicio', header: 'Inicio', render: (item) => formatoFecha(item.fecha_inicio) },
  { key: 'sancion', header: 'Sanción', render: (item) => item.sancion ?? '—' },
  { key: 'estado', header: 'Etapa', render: (item) => etiquetaDe(ESTADOS_PAD, item.estado) },
];

const card = (item) => ({
  icon: Gavel,
  title: item.trabajador?.nombre_completo ?? 'Expediente PAD',
  meta: [item.tipo_falta?.nombre, `Inicio ${formatoFecha(item.fecha_inicio)}`, item.sancion && `Sanción: ${item.sancion}`, item.descripcion],
  footer: `${item.numero ?? 'Sin número'} · ${etiquetaDe(ESTADOS_PAD, item.estado)}`,
});

export default function ExpedientePadPage() {
  const crud = useCrudResource({
    endpoint: '/expedientes-pad',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular el expediente ${item.numero ?? ''} de ${item.trabajador?.nombre_completo ?? ''}? Solo se anula un expediente abierto por error.`,
    deactivateErrorMessage: 'No se pudo anular el expediente.',
  });

  return (
    <PageContainer>
      <PageHeader title="Expedientes PAD" subtitle="Disciplina · Expediente PAD">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo expediente
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por servidor, número o descripción…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando expedientes…"
        emptyIcon={Gavel}
        emptyMessage="No hay expedientes disciplinarios registrados todavía."
        columns={columns}
        card={card}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Anular' }}
        puedeEditar={enCurso}
        puedeAlternar={enCurso}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Tramitar expediente' : 'Nuevo expediente disciplinario'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ExpedientePadForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} estadoActual={crud.editando?.estado} />
      </FormModal>
    </PageContainer>
  );
}
