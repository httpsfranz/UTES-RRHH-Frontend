import { FileSpreadsheet, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { entero, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_CARGA, etiquetaDe } from '../../utils/opciones';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import CargaAsistenciaManualForm from './CargaAsistenciaManualForm';

const { emptyForm, mapToForm } = formModel({
  UsuarioId: 'usuario_id',
  EessId: 'eess_id',
  DocumentoSustentoId: 'documento_sustento_id',
  CargaAsistenciaManualNombreArchivo: 'nombre_archivo',
  CargaAsistenciaManualRegistros: 'registros',
  CargaAsistenciaManualObservacion: 'observacion',
  CargaAsistenciaManualEstado: ['estado', 'REGISTRADO'],
});

const validate = validador({
  UsuarioId: [requerido],
  CargaAsistenciaManualRegistros: [entero({ min: 0, max: 1000000 }), requeridoSi((form) => form.CargaAsistenciaManualEstado === 'PROCESADO', 'Indica cuántos registros se cargaron.')],
  CargaAsistenciaManualObservacion: [requeridoSi((form) => form.CargaAsistenciaManualEstado === 'OBSERVADO', 'Indica la observación de la carga.')],
});

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFechaHora(item.fecha) },
  { key: 'archivo', header: 'Archivo', render: (item) => item.nombre_archivo ?? '—' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? 'Toda la Red' },
  { key: 'usuario', header: 'Cargado por', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'registros', header: 'Registros', render: (item) => item.registros ?? '—' },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_CARGA, item.estado) },
];

const card = (item) => ({
  icon: FileSpreadsheet,
  title: item.nombre_archivo ?? `Carga ${item.id}`,
  meta: [formatoFechaHora(item.fecha), item.eess?.nombre ?? 'Toda la Red', item.usuario && `Cargado por ${item.usuario.nombre}`, item.registros !== null && `${item.registros} registros`, item.observacion],
  footer: etiquetaDe([...ESTADOS_CARGA, { value: 'ANULADO', label: 'Anulado' }], item.estado),
});

const noAnulada = (item) => item.estado !== 'ANULADO';

export default function CargaAsistenciaManualPage() {
  const crud = useCrudResource({
    endpoint: '/cargas-asistencia-manual',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la carga "${item.nombre_archivo ?? item.id}"? Sus marcaciones quedarán invalidadas.`,
    deactivateErrorMessage: 'No se pudo anular la carga.',
  });

  return (
    <PageContainer>
      <PageHeader title="Carga manual de asistencia" subtitle="Asistencia · Carga manual de asistencia">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva carga
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por archivo u observación…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando partes diarios…"
        emptyIcon={FileSpreadsheet}
        emptyMessage="No hay cargas de asistencia registradas todavía."
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
        title={crud.editando ? 'Editar carga de asistencia' : 'Nueva carga de asistencia manual'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CargaAsistenciaManualForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
    </PageContainer>
  );
}
