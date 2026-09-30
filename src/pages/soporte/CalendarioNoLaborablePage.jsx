import { CalendarDays, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, fecha, requerido, unoDe } from '../../utils/validaciones';
import { siNo } from '../../utils/formato';
import { TIPOS_DIA_NO_LABORABLE, etiquetaDe, valoresDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import CalendarioNoLaborableForm from './CalendarioNoLaborableForm';

const { emptyForm, mapToForm } = formModel({
  CalendarioNoLaborableFecha: 'fecha',
  CalendarioNoLaborableTipo: 'tipo',
  MicroredId: 'microred_id',
  CalendarioNoLaborableDescripcion: 'descripcion',
  CalendarioNoLaborableNormaSustento: 'norma_sustento',
  CalendarioNoLaborableCompensable: ['compensable', false],
});

const validate = validador({
  CalendarioNoLaborableFecha: [requerido, fecha],
  CalendarioNoLaborableTipo: [requerido, unoDe(valoresDe(TIPOS_DIA_NO_LABORABLE))],
});

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_DIA_NO_LABORABLE, item.tipo) },
  { key: 'descripcion', header: 'Descripción' },
  { key: 'microred', header: 'Alcance', render: (item) => item.microred?.nombre ?? 'Toda la Red' },
  { key: 'compensable', header: 'Compensable', render: (item) => siNo(item.compensable) },
];

const card = (item) => ({
  icon: CalendarDays,
  title: formatoFecha(item.fecha),
  meta: [item.descripcion, item.microred?.nombre ?? 'Toda la Red', item.compensable && 'Compensable', item.norma_sustento],
  footer: etiquetaDe(TIPOS_DIA_NO_LABORABLE, item.tipo),
});

export default function CalendarioNoLaborablePage() {
  const crud = useCrudResource({
    endpoint: '/calendario-no-laborable',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Eliminar el día no laborable del ${formatoFecha(item.fecha)}?`,
    deactivateErrorMessage: 'No se pudo eliminar el día no laborable.',
  });

  return (
    <PageContainer>
      <PageHeader title="Calendario no laborable" subtitle="Soporte · Día no laborable">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo día no laborable
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando días no laborables…"
        emptyIcon={CalendarDays}
        emptyMessage="No hay días no laborables registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar día no laborable' : 'Nuevo día no laborable'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CalendarioNoLaborableForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
