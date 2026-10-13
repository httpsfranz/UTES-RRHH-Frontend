import { useState } from 'react';
import { CalendarDays, Hospital } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useOpciones } from '../../hooks/useOpciones';
import { fechaIso } from '../../utils/formato';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import FormGrid from '../../components/ui/FormGrid';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import HelpText from '../../components/ui/HelpText';

const MAXIMO_DIAS = 62;

const rangoInicial = () => {
  const hoy = new Date();
  return { FechaInicio: fechaIso(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), FechaFin: fechaIso(hoy) };
};

const resumenDe = (r) =>
  `Listo: ${r.evaluados} días evaluados — ${r.creados} creados, ${r.actualizados} actualizados, ${r.sin_cambios} sin cambios, ${r.pendientes} pendientes (turno en curso), ` +
  `${r.omitidos_manuales} manuales respetados, ${r.omitidos_periodo_cerrado} en períodos cerrados.`;

const estadosDe = (r) =>
  Object.entries(r.por_estado ?? {})
    .map(([codigo, cantidad]) => `${codigo}: ${cantidad}`)
    .join(' · ');

/**
 * Calcula la asistencia diaria desde las marcaciones y la programación (POST /asistencia-diaria/calcular).
 * `abierto` controla el modal; al terminar muestra el resumen y avisa a la pantalla para recargar el listado.
 */
export default function CalcularAsistenciaModal({ abierto, onClose, onCalculado }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { sinOpcion: 'Todos los establecimientos' });
  const [form, setForm] = useState({ ...rangoInicial(), EessId: '', SobrescribirManuales: false });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resumen, setResumen] = useState(null);

  async function calcular(event) {
    event.preventDefault();
    setEnviando(true);
    setErrores({});
    setResumen(null);
    try {
      const { data } = await api.post('/asistencia-diaria/calcular', { ...form, EessId: form.EessId || null });
      setResumen(data);
      onCalculado?.();
    } catch (err) {
      setErrores(err.response?.status === 422 ? (err.response.data.errors ?? { general: [err.response.data.message] }) : { general: [mensajeDeError(err) ?? 'No se pudo calcular la asistencia.'] });
    } finally {
      setEnviando(false);
    }
  }

  function cerrar() {
    setResumen(null);
    setErrores({});
    onClose();
  }

  return (
    <Modal open={abierto} onClose={cerrar} title="Calcular asistencia diaria">
      <Form onSubmit={calcular} generalError={errores.general?.[0]}>
        <FormGrid>
          <Field form={form} setForm={setForm} errors={errores} name="FechaInicio" label="Desde" icon={CalendarDays} type="date" required />
          <Field form={form} setForm={setForm} errors={errores} name="FechaFin" label="Hasta" icon={CalendarDays} type="date" required />
        </FormGrid>
        <Select form={form} setForm={setForm} errors={errores} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} />
        <Checkbox form={form} setForm={setForm} errors={errores} name="SobrescribirManuales" label="Sobrescribir también las filas digitadas a mano" />
        <HelpText>
          {`Convierte las marcaciones y las solicitudes aprobadas en la asistencia del día, contra el turno programado o el horario asignado: escala de tardanza del Art. 22, omisión de marcación, guardia no realizada (2 días), feriados y papeletas. Máximo ${MAXIMO_DIAS} días. No toca períodos cerrados ni lo que ya corregiste a mano, y se puede repetir las veces que haga falta.`}
        </HelpText>
        {resumen && <HelpText>{`${resumenDe(resumen)} ${estadosDe(resumen)}`}</HelpText>}
        <FormActions onCancel={cerrar} submitting={enviando} submitLabel="Calcular" savingLabel="Calculando…" />
      </Form>
    </Modal>
  );
}
