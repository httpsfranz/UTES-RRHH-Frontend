import { FilePlus2, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useOpciones } from '../../hooks/useOpciones';
import { codigo, entero, fecha, noFutura, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_CARGA_PROGRAMACION, MESES, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import CargaProgramacionForm from './CargaProgramacionForm';

const { emptyForm, mapToForm } = formModel({
  EessId: 'eess_id',
  DocumentoSustentoId: 'documento_sustento_id',
  UsuarioRegistroId: 'usuario_registro_id',
  TipoPeriodoProgramacionId: 'tipo_periodo_programacion_id',
  ProgramacionPeriodoId: 'programacion_periodo_id',
  CargaProgramacionCodigo: 'codigo',
  CargaProgramacionAnio: 'anio',
  CargaProgramacionMes: 'mes',
  CargaProgramacionNumero: 'numero',
  CargaProgramacionFechaDocumento: 'fecha_documento',
  CargaProgramacionDocumentoNumero: 'documento_numero',
  CargaProgramacionMotivo: 'motivo',
  CargaProgramacionObservacion: 'observacion',
  CargaProgramacionEstado: ['estado', 'REGISTRADO'],
});

const periodo = (item) => `${etiquetaDe(MESES, String(item.mes))} ${item.anio}${item.numero ? ` · quincena ${item.numero}` : ''}`;
const nombreEstado = (item) => etiquetaDe([...ESTADOS_CARGA_PROGRAMACION, { value: 'ANULADO', label: 'Anulado' }], item.estado);
const noAnulada = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'codigo', header: 'Código' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'periodo', header: 'Período', render: periodo },
  { key: 'fecha_documento', header: 'Documento', render: (item) => formatoFecha(item.fecha_documento) },
  { key: 'estado', header: 'Estado', render: nombreEstado },
];

const card = (item) => ({
  icon: FilePlus2,
  title: item.eess?.nombre ?? 'Carga de programación',
  meta: [periodo(item), `Documento del ${formatoFecha(item.fecha_documento)}`, item.documento_numero, item.observacion],
  footer: `${item.codigo} · ${nombreEstado(item)}`,
});

export default function CargaProgramacionPage() {
  // La quincena es obligatoria solo para el tipo quincenal: la validacion de usuario necesita el catalogo.
  const tipos = useOpciones('/tipos-periodo-programacion');
  const validate = validador({
    EessId: [requerido],
    DocumentoSustentoId: [requerido],
    UsuarioRegistroId: [requerido],
    CargaProgramacionCodigo: [codigo],
    CargaProgramacionAnio: [requerido, entero({ min: 2000, max: 2100 })],
    CargaProgramacionMes: [requerido],
    CargaProgramacionNumero: [
      requeridoSi(
        (form) => tipos.filas.find((fila) => String(fila.id) === String(form.TipoPeriodoProgramacionId))?.codigo === 'QUINCENAL',
        'Indica si la programación es de la quincena 1 o 2.',
      ),
    ],
    CargaProgramacionFechaDocumento: [requerido, fecha, noFutura('La fecha del documento no puede ser futura.')],
    CargaProgramacionObservacion: [requeridoSi((form) => form.CargaProgramacionEstado === 'OBSERVADO', 'Indica la observación de la carga.')],
  });

  const crud = useCrudResource({
    endpoint: '/cargas-programacion',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la carga ${item.codigo}?`,
    deactivateErrorMessage: 'No se pudo anular la carga.',
  });

  return (
    <PageContainer>
      <PageHeader title="Carga de programación" subtitle="Programación · Carga de programación">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva carga
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por código, oficio o motivo…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando cargas de programación…"
        emptyIcon={FilePlus2}
        emptyMessage="No hay cargas de programación registradas todavía."
        columns={columns}
        card={card}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={noAnulada}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar carga de programación' : 'Nueva carga de programación'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CargaProgramacionForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
    </PageContainer>
  );
}
