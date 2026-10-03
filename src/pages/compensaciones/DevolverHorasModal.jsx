import { useState } from 'react';
import { Hourglass } from 'lucide-react';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import Field from '../../components/ui/Field';
import HelpText from '../../components/ui/HelpText';

/**
 * Registra horas devueltas de una compensacion aprobada. `item` null = cerrado.
 * `devolver(item, horas)` hace la llamada y devuelve { ok, errores } (useAccionDeRegistro).
 */
export default function DevolverHorasModal({ item, devolver, onClose }) {
  const [form, setForm] = useState({ Horas: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Al abrir con otro registro el formulario vuelve a estar en blanco.
  const [itemActual, setItemActual] = useState(null);
  if ((item?.id ?? null) !== itemActual) {
    setItemActual(item?.id ?? null);
    setForm({ Horas: '' });
    setErrores({});
  }

  async function enviar(event) {
    event.preventDefault();
    if (!/^\d+(\.\d{1,2})?$/.test(form.Horas) || Number(form.Horas) <= 0) {
      setErrores({ Horas: ['Indica las horas devueltas (mayor que cero, hasta 2 decimales).'] });
      return;
    }
    setEnviando(true);
    const resultado = await devolver(item, form.Horas);
    setEnviando(false);
    if (resultado.ok) onClose();
    else setErrores(resultado.errores);
  }

  return (
    <Modal open={Boolean(item)} onClose={onClose} title="Devolver horas">
      <Form onSubmit={enviar} generalError={errores.general?.[0]}>
        {item && (
          <HelpText>
            {`Generadas: ${item.horas_generadas} h · devueltas: ${item.horas_devueltas} h · pendientes: ${item.horas_pendientes} h. Al completar las horas generadas, la compensación queda consumida.`}
          </HelpText>
        )}
        <Field form={form} setForm={setForm} errors={errores} name="Horas" label="Horas que devuelve" icon={Hourglass} required maxLength={5} filter="decimal" inputMode="decimal" />
        <FormActions onCancel={onClose} submitting={enviando} submitLabel="Registrar" savingLabel="Registrando…" />
      </Form>
    </Modal>
  );
}
