import { useState } from 'react';
import { CalendarCheck, Hospital } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useOpciones } from '../../hooks/useOpciones';
import { MESES } from '../../utils/opciones';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import Select from '../../components/ui/Select';
import HelpText from '../../components/ui/HelpText';
import Alert from '../../components/ui/Alert';

/**
 * Genera los consolidados de un periodo a partir de la asistencia diaria (POST /consolidados-asistencia/generar).
 * `abierto` controla el modal; al terminar muestra el resumen (generados, actualizados, omitidos) y avisa a la pantalla.
 */
export default function GenerarConsolidadoModal({ abierto, onClose, onGenerado }) {
  // Solo los periodos que aun admiten consolidados (ABIERTO o EN_PROCESO).
  const todos = useOpciones('/periodos-asistencia', { params: {} });
  const periodos = todos.filas
    .filter((p) => p.estado !== 'CERRADO')
    .map((p) => ({ value: p.id, label: `${MESES.find((m) => m.value === String(p.mes))?.label ?? p.mes} ${p.anio} (${p.estado})` }));
  const { opciones: establecimientos } = useOpciones('/establecimientos', { sinOpcion: 'Todos los establecimientos' });
  const [form, setForm] = useState({ PeriodoAsistenciaId: '', EessId: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resumen, setResumen] = useState(null);

  async function generar(event) {
    event.preventDefault();
    if (!form.PeriodoAsistenciaId) {
      setErrores({ PeriodoAsistenciaId: ['Elige el período.'] });
      return;
    }
    setEnviando(true);
    setErrores({});
    try {
      const { data } = await api.post('/consolidados-asistencia/generar', form);
      setResumen(data);
      onGenerado?.();
    } catch (err) {
      setErrores(err.response?.status === 422 ? (err.response.data.errors ?? { general: [err.response.data.message] }) : { general: [mensajeDeError(err) ?? 'No se pudo generar el consolidado.'] });
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
    <Modal open={abierto} onClose={cerrar} title="Generar consolidado de asistencia">
      <Form onSubmit={generar} generalError={errores.general?.[0]}>
        <Select form={form} setForm={setForm} errors={errores} name="PeriodoAsistenciaId" label="Período de asistencia" icon={CalendarCheck} options={periodos} required />
        <Select form={form} setForm={setForm} errors={errores} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} />
        <HelpText>
          Calcula días trabajados, faltas, tardanzas y sobretiempo desde la asistencia diaria. Los consolidados conformes o cerrados no se
          tocan; los demás se actualizan. Solo períodos abiertos o en proceso.
        </HelpText>
        {resumen && (
          <Alert variant="text">
            {`Listo: ${resumen.generados} generados, ${resumen.actualizados} actualizados, ${resumen.omitidos} omitidos (conformes).`}
          </Alert>
        )}
        <FormActions onCancel={cerrar} submitting={enviando} submitLabel="Generar" savingLabel="Generando…" />
      </Form>
    </Modal>
  );
}
