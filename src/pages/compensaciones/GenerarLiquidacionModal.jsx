import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useOpciones } from '../../hooks/useOpciones';
import { MESES, etiquetaDe } from '../../utils/opciones';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import SelectBuscable from '../../components/ui/SelectBuscable';
import HelpText from '../../components/ui/HelpText';

const liquidable = (consolidado) =>
  ['CONFORME', 'CERRADO'].includes(consolidado.estado) && (Number(consolidado.dias_falta) > 0 || Number(consolidado.minutos_tardanza) > 0);

const etiqueta = (consolidado) =>
  `${consolidado.trabajador?.nombre_completo ?? 'Trabajador'} · ${consolidado.periodo ? `${etiquetaDe(MESES, String(consolidado.periodo.mes))} ${consolidado.periodo.anio}` : ''} · ${consolidado.dias_falta} falta(s), ${consolidado.minutos_tardanza} min de tardanza`;

/**
 * Genera la liquidacion de descuentos de un consolidado (POST /liquidaciones-descuento). `abierto` controla el modal;
 * al generarla avisa a la pantalla (`onGenerada`) y se cierra. Solo ofrece consolidados conformes o cerrados que tengan
 * faltas o tardanzas; si ya tienen liquidacion vigente, el backend lo informa.
 */
export default function GenerarLiquidacionModal({ abierto, onClose, onGenerada }) {
  const consolidados = useOpciones('/consolidados-asistencia', { params: {}, etiqueta });
  const opciones = consolidados.filas.filter(liquidable).map((consolidado) => ({ value: consolidado.id, label: etiqueta(consolidado) }));
  const [form, setForm] = useState({ ConsolidadoAsistenciaId: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  async function generar(event) {
    event.preventDefault();
    if (!form.ConsolidadoAsistenciaId) {
      setErrores({ ConsolidadoAsistenciaId: ['Elige el consolidado.'] });
      return;
    }
    setEnviando(true);
    setErrores({});
    try {
      await api.post('/liquidaciones-descuento', form);
      onGenerada?.();
      cerrar();
    } catch (err) {
      setErrores(err.response?.status === 422 ? (err.response.data.errors ?? { general: [err.response.data.message] }) : { general: [mensajeDeError(err) ?? 'No se pudo generar la liquidación.'] });
    } finally {
      setEnviando(false);
    }
  }

  function cerrar() {
    setForm({ ConsolidadoAsistenciaId: '' });
    setErrores({});
    onClose();
  }

  return (
    <Modal open={abierto} onClose={cerrar} title="Generar liquidación de descuentos">
      <Form onSubmit={generar} generalError={errores.general?.[0]}>
        <SelectBuscable form={form} setForm={setForm} errors={errores} name="ConsolidadoAsistenciaId" label="Consolidado de asistencia" icon={BarChart3} options={opciones} required />
        <HelpText>
          Solo se liquida un consolidado conforme o cerrado con faltas o tardanzas. La liquidación nace con una línea por los días de falta y otra por las horas
          de tardanza (RIT, Art. 25), con el importe en cero: se completa con el dato de la planilla.
        </HelpText>
        <FormActions onCancel={cerrar} submitting={enviando} submitLabel="Generar" savingLabel="Generando…" />
      </Form>
    </Modal>
  );
}
