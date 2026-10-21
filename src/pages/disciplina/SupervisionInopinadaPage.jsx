import { useState } from 'react';
import { Eye, FileText, Gavel, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { abrirDocumento } from '../../api/documentos';
import { fechaHoraNoFutura, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_SUPERVISION, etiquetaDe } from '../../utils/opciones';
import { aCampoFecha, ahoraLocal, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import AvisoExito from '../../components/ui/AvisoExito';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import AccionModal from '../../components/ui/AccionModal';
import Select from '../../components/ui/Select';
import SupervisionInopinadaForm from './SupervisionInopinadaForm';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

const modelo = formModel({
  EessId: 'eess_id',
  VinculoLaboralId: 'vinculo_laboral_id',
  DocumentoSustentoId: 'documento_sustento_id',
  SupervisionInopinadaFechaHora: 'fecha_hora',
  SupervisionInopinadaResultado: 'resultado',
  SupervisionInopinadaObservacion: 'observacion',
  SupervisionInopinadaEstado: ['estado', 'REGISTRADO'],
});

// Al crear, la fecha y hora arrancan en "ahora" (se calcula al abrir el formulario).
const emptyForm = () => ({ ...modelo.emptyForm, SupervisionInopinadaFechaHora: ahoraLocal() });
const mapToForm = (item) => ({ ...modelo.mapToForm(item), SupervisionInopinadaFechaHora: aCampoFecha(item.fecha_hora) });

const validate = validador({
  EessId: [requerido],
  SupervisionInopinadaFechaHora: [
    requerido,
    (valor) => fechaHoraNoFutura(valor)?.replace('La ocurrencia no puede registrarse', 'La supervisión no puede registrarse'),
  ],
  SupervisionInopinadaObservacion: [
    requeridoSi((form) => form.SupervisionInopinadaEstado === 'OBSERVADO', 'Indica las observaciones del acta de supervisión.'),
  ],
});

const noAnulada = (item) => item.estado !== 'ANULADO';
const puedeIniciarPad = (item) => item.estado === 'OBSERVADO' && item.vinculo_laboral_id && !item.expediente_pad;

// A donde va el acta: archivada si fue conforme; con observaciones de un servidor, da inicio a un expediente PAD.
const destino = (item) => {
  if (item.expediente_pad) return `Expediente ${item.expediente_pad.numero}`;
  if (item.estado === 'OBSERVADO') return item.vinculo_laboral_id ? 'Por iniciar PAD' : 'Observada (sin servidor)';
  if (item.estado === 'CONFORME') return 'Archivada: conforme';
  return item.estado === 'ANULADO' ? '—' : 'Por evaluar';
};

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'persona', header: 'Persona supervisada', render: (item) => item.trabajador?.nombre_completo ?? 'General' },
  { key: 'acta', header: 'Acta', render: (item) => item.documento?.nombre ?? 'Sin acta adjunta' },
  { key: 'estado', header: 'Resultado', render: (item) => etiquetaDe(ESTADOS_SUPERVISION, item.estado) },
  { key: 'destino', header: 'Destino del acta', render: destino },
];

const card = (item) => ({
  icon: Eye,
  title: item.eess?.nombre ?? 'Supervisión inopinada',
  meta: [formatoFechaHora(item.fecha_hora), item.trabajador?.nombre_completo ?? 'Supervisión general', item.resultado, `Destino: ${destino(item)}`],
  footer: etiquetaDe(ESTADOS_SUPERVISION, item.estado),
});

/**
 * Supervisiones inopinadas: el acta (documento) se adjunta a la supervision. Conforme, el acta se archiva; observada
 * con un servidor identificado, se avisa a RRHH y al jefe de la microred y desde aqui se inicia su expediente PAD (el
 * acta queda como documento de inicio).
 */
export default function SupervisionInopinadaPage() {
  const crud = useCrudResource({
    endpoint: '/supervisiones-inopinadas',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la supervisión de ${item.eess?.nombre ?? ''} del ${formatoFechaHora(item.fecha_hora)}?`,
    deactivateErrorMessage: 'No se pudo anular la supervisión.',
  });
  const acciones = useAccionDeRegistro('/supervisiones-inopinadas', { alTerminar: () => crud.cargar() });
  const { opciones: tiposFalta } = useOpciones('/tipos-falta-disciplinaria');
  const [iniciando, setIniciando] = useState(null);
  const [aviso, setAviso] = useState('');

  async function iniciarPad(form) {
    const resultado = await acciones.ejecutar(iniciando, { accion: 'iniciar-pad', cuerpo: form, enModal: true });
    if (resultado.ok) setAviso(`${resultado.datos.mensaje} Lo encuentras en Disciplina > Expedientes PAD.`);
    return resultado;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Supervisiones inopinadas"
        subtitle="El acta se adjunta a la supervisión; si tiene observaciones de un servidor, da inicio a su expediente PAD."
      >
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Nueva supervisión
          </Button>
        )}
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por persona, resultado u observaciones…"
      />

      <AvisoExito onCerrar={() => setAviso('')}>{aviso}</AvisoExito>
      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando supervisiones…"
        emptyIcon={Eye}
        emptyMessage="No hay supervisiones inopinadas registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          {
            icon: FileText,
            label: 'Ver acta',
            visible: (item) => Boolean(item.documento_sustento_id),
            onClick: (item) => abrirDocumento(item.documento_sustento_id, { nombre: item.documento?.nombre }),
          },
          {
            icon: Gavel,
            label: 'Iniciar expediente PAD',
            visible: (item) => acciones.puede('iniciar-pad') && puedeIniciarPad(item),
            onClick: setIniciando,
          },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={(item) => noAnulada(item) && !item.expediente_pad}
        puedeAlternar={(item) => noAnulada(item) && !item.expediente_pad}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar supervisión' : 'Nueva supervisión inopinada'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <SupervisionInopinadaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>

      <AccionModal
        abierto={iniciando?.id ?? null}
        titulo={`Iniciar expediente PAD · ${iniciando?.trabajador?.nombre_completo ?? ''}`}
        inicial={{ TipoFaltaDisciplinariaId: '', ExpedientePadDescripcion: '' }}
        ayuda="El acta de la supervisión queda como documento de inicio del expediente y el número se genera solo."
        enviar={iniciarPad}
        onClose={() => setIniciando(null)}
        campos={(form, setForm, errors) => (
          <>
            <Select
              form={form}
              setForm={setForm}
              errors={errors}
              name="TipoFaltaDisciplinariaId"
              label="Falta imputada"
              icon={Gavel}
              options={tiposFalta}
              required
            />
            <TextoEstandar
              form={form}
              setForm={setForm}
              errors={errors}
              name="ExpedientePadDescripcion"
              opciones={TEXTOS.descripcionPad}
              label="Descripción (opcional)"
              maxLength={1500}
            />
          </>
        )}
      />
    </PageContainer>
  );
}
