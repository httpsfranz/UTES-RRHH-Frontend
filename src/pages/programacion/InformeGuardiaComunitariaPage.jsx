import { useState } from 'react';
import { CircleCheck, CircleX, ClipboardList, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { fecha, noFutura, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_SOLICITUD, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResolucionModal from '../../components/ui/ResolucionModal';
import InformeGuardiaComunitariaForm from './InformeGuardiaComunitariaForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  DocumentoSustentoId: 'documento_sustento_id',
  InformeGuardiaComunitariaFecha: 'fecha',
  InformeGuardiaComunitariaHoraInicio: 'hora_inicio',
  InformeGuardiaComunitariaHoraFin: 'hora_fin',
  InformeGuardiaComunitariaDescripcion: 'descripcion',
});

const minutos = (hora) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5));
const horario = (item) => (item.hora_inicio ? `${item.hora_inicio} – ${item.hora_fin ?? '—'}` : 'Sin horas');
const pendiente = (item) => item.estado === 'PENDIENTE';
const noAnulada = (item) => item.estado !== 'ANULADO';

const validate = validador({
  VinculoLaboralId: [requerido],
  InformeGuardiaComunitariaFecha: [requerido, fecha, noFutura('El informe no puede ser de una fecha futura.')],
  InformeGuardiaComunitariaHoraFin: [
    (valor, form) => {
      if (!form.InformeGuardiaComunitariaHoraInicio) return null;
      const duracion = minutos(valor) - minutos(form.InformeGuardiaComunitariaHoraInicio);
      if (duracion <= 0) return 'La hora de fin debe ser posterior a la de inicio.';
      return duracion > 720 ? 'La guardia comunitaria dura como máximo 12 horas (RIT, Art. 20).' : null;
    },
  ],
  InformeGuardiaComunitariaDescripcion: [requerido],
});

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'horario', header: 'Horario', render: horario },
  { key: 'descripcion', header: 'Actividades' },
  { key: 'estado', header: 'Resolución', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: ClipboardList,
  title: item.trabajador?.nombre_completo ?? 'Informe de guardia comunitaria',
  meta: [formatoFecha(item.fecha), horario(item), item.descripcion],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function InformeGuardiaComunitariaPage() {
  const crud = useCrudResource({
    endpoint: '/informes-guardia-comunitaria',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular el informe de ${item.trabajador?.nombre_completo ?? ''} del ${formatoFecha(item.fecha)}?`,
    deactivateErrorMessage: 'No se pudo anular el informe.',
  });
  const acciones = useAccionDeRegistro('/informes-guardia-comunitaria', { alTerminar: () => crud.cargar() });
  const [resolucion, setResolucion] = useState({ item: null, accion: null });
  const cerrar = () => setResolucion({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Informes de guardia comunitaria" subtitle="Programación · Informe de guardia comunitaria">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo informe
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o actividades…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando informes…"
        emptyIcon={ClipboardList}
        emptyMessage="No hay informes de guardia comunitaria registrados todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulado', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar informe' : 'Nuevo informe de guardia comunitaria'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <InformeGuardiaComunitariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolucion.item}
        accion={resolucion.accion}
        titulo={resolucion.accion === 'rechazar' ? 'Rechazar informe' : 'Aprobar informe'}
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={cerrar}
      />
    </PageContainer>
  );
}
