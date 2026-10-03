import { useState } from 'react';
import { CircleCheck, CircleX, ClipboardList, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { entero, fecha, numeroPlaza, requerido, requeridoSi, validador } from '../../utils/validaciones';
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
import PapeletaForm from './PapeletaForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  TipoPapeletaId: 'tipo_papeleta_id',
  MotivoPapeletaId: 'motivo_papeleta_id',
  DocumentoSustentoId: 'documento_sustento_id',
  UsuarioRegistroId: 'usuario_registro_id',
  PapeletaNumero: 'numero',
  PapeletaFecha: 'fecha',
  PapeletaHoraSalida: 'hora_salida',
  PapeletaHoraRetorno: 'hora_retorno',
  PapeletaEsDiaCompleto: ['es_dia_completo', false],
  PapeletaMinutosUtilizados: 'minutos_utilizados',
  PapeletaMotivo: 'motivo',
  PapeletaObservacion: 'observacion',
});

const horario = (item) => (item.es_dia_completo ? 'Día completo' : `${item.hora_salida ?? '—'} – ${item.hora_retorno ?? 'sin retorno'}`);
const pendiente = (item) => item.estado === 'PENDIENTE';
const noAnulada = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => item.tipo?.nombre ?? '—' },
  { key: 'horario', header: 'Horario', render: horario },
  { key: 'numero', header: 'N.º', render: (item) => item.numero ?? '—' },
  { key: 'estado', header: 'Resolución', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: ClipboardList,
  title: item.trabajador?.nombre_completo ?? 'Papeleta',
  meta: [`${item.tipo?.nombre ?? ''} · ${formatoFecha(item.fecha)}`, horario(item), item.motivo_papeleta?.nombre ?? item.motivo, item.numero && `Papeleta ${item.numero}`],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function PapeletaPage() {
  // Los tipos que exigen sustento y la comision (3 horas) dependen del catalogo: la validacion de usuario lo necesita.
  const tipos = useOpciones('/tipos-papeleta');
  const tipoDe = (form) => tipos.filas.find((fila) => String(fila.id) === String(form.TipoPapeletaId));
  const minutos = (hora) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5));

  const validate = validador({
    VinculoLaboralId: [requerido],
    TipoPapeletaId: [requerido],
    PapeletaNumero: [numeroPlaza],
    PapeletaFecha: [requerido, fecha],
    PapeletaHoraSalida: [requeridoSi((form) => !form.PapeletaEsDiaCompleto, 'Indica la hora de salida (o marca el permiso como de día completo).')],
    PapeletaHoraRetorno: [
      (valor, form) => (form.PapeletaHoraSalida && valor < form.PapeletaHoraSalida ? 'La hora de retorno no puede ser anterior a la de salida.' : null),
      (valor, form) =>
        tipoDe(form)?.codigo === 'COMISION' && form.PapeletaHoraSalida && minutos(valor) - minutos(form.PapeletaHoraSalida) > 180
          ? 'La papeleta de comisión de servicios vale como máximo 3 horas (RIT, Art. 14).'
          : null,
    ],
    PapeletaMinutosUtilizados: [entero({ min: 0, max: 1440 })],
  });

  const crud = useCrudResource({
    endpoint: '/papeletas',
    emptyForm,
    mapToForm,
    validate: (form) => validate(form.PapeletaEsDiaCompleto ? { ...form, PapeletaHoraSalida: '', PapeletaHoraRetorno: '' } : form),
    buildConfirmMessage: (item) => `¿Anular la papeleta de ${item.trabajador?.nombre_completo ?? ''} del ${formatoFecha(item.fecha)}?`,
    deactivateErrorMessage: 'No se pudo anular la papeleta.',
  });
  const acciones = useAccionDeRegistro('/papeletas', { alTerminar: () => crud.cargar() });
  const [resolucion, setResolucion] = useState({ item: null, accion: null });
  const cerrar = () => setResolucion({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Papeletas" subtitle="Solicitudes · Papeleta">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva papeleta
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, número o motivo…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando papeletas…"
        emptyIcon={ClipboardList}
        emptyMessage="No hay papeletas registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar papeleta' : 'Nueva papeleta'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <PapeletaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolucion.item}
        accion={resolucion.accion}
        titulo={resolucion.accion === 'rechazar' ? 'Rechazar papeleta' : 'Aprobar papeleta'}
        ayuda={resolucion.accion === 'aprobar' ? 'Quien resuelve queda registrado como quien autoriza la papeleta.' : undefined}
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={cerrar}
      />
    </PageContainer>
  );
}
