import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import Field from '../../components/ui/Field';
import HelpText from '../../components/ui/HelpText';
import { fecha, requerido } from '../../utils/validaciones';
import { finDelDescanso, formatoFecha } from '../../utils/formato';

/**
 * Mueve un descanso programado a otra fecha de inicio (mismos dias): el descanso actual queda REPROGRAMADO y nace otro.
 * `item` null = cerrado. `reprogramar(item, fecha)` hace la llamada y devuelve { ok, errores } (useAccionDeRegistro).
 */
export default function ReprogramarRolModal({ item, reprogramar, onClose }) {
  const [form, setForm] = useState({ RolVacacionalFechaProgramada: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Al abrir con otro registro el formulario vuelve a estar en blanco.
  const [itemActual, setItemActual] = useState(null);
  if ((item?.id ?? null) !== itemActual) {
    setItemActual(item?.id ?? null);
    setForm({ RolVacacionalFechaProgramada: '' });
    setErrores({});
  }

  async function enviar(event) {
    event.preventDefault();
    const error = requerido(form.RolVacacionalFechaProgramada) ?? fecha(form.RolVacacionalFechaProgramada);
    if (error) {
      setErrores({ RolVacacionalFechaProgramada: [error] });
      return;
    }
    setEnviando(true);
    const resultado = await reprogramar(item, form.RolVacacionalFechaProgramada);
    setEnviando(false);
    if (resultado.ok) onClose();
    else setErrores(resultado.errores);
  }

  const fin = item ? finDelDescanso(form.RolVacacionalFechaProgramada, item.dias) : null;

  return (
    <Modal open={Boolean(item)} onClose={onClose} title="Reprogramar descanso vacacional">
      <Form onSubmit={enviar} generalError={errores.general?.[0]}>
        {item && (
          <HelpText>
            {`Descanso actual: del ${formatoFecha(item.fecha_programada)} al ${formatoFecha(item.fecha_fin_programada)} (${item.dias} días). Queda reprogramado y se crea uno nuevo con los mismos días (RIT, Art. 71).`}
          </HelpText>
        )}
        <Field form={form} setForm={setForm} errors={errores} name="RolVacacionalFechaProgramada" label="Nuevo inicio del descanso" icon={CalendarDays} type="date" required />
        {fin && <HelpText>{`El nuevo descanso terminaría el ${formatoFecha(fin)}.`}</HelpText>}
        <FormActions onCancel={onClose} submitting={enviando} submitLabel="Reprogramar" savingLabel="Reprogramando…" />
      </Form>
    </Modal>
  );
}
