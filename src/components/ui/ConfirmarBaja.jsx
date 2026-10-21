import { useCallback, useRef, useState } from 'react';
import Modal from '../Modal';
import Form from './Form';
import FormActions from './FormActions';
import HelpText from './HelpText';
import TextoEstandar from './TextoEstandar';
import { BajaContext } from './bajaContext';
import { opcionesDeBaja } from '../../utils/textosEstandar';

/**
 * Modal unico para desactivar cualquier registro: un dato no se da de baja "porque si", se elige el motivo (opciones
 * comunes y las propias del recurso, y "Otro" para escribirlo). El motivo viaja con la baja y queda en la auditoria.
 * Provee usePedirBaja() a todo lo que esta dentro (MainLayout).
 */
export default function ConfirmarBaja({ children }) {
  const [pedido, setPedido] = useState(null); // { mensaje, endpoint, ayuda }
  const [form, setForm] = useState({ MotivoBaja: '' });
  const [errores, setErrores] = useState({});
  const resolver = useRef(null);

  const pedir = useCallback(
    (datos) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setForm({ MotivoBaja: '' });
        setErrores({});
        setPedido(datos);
      }),
    []
  );

  function terminar(motivo) {
    resolver.current?.(motivo);
    resolver.current = null;
    setPedido(null);
  }

  function enviar(event) {
    event.preventDefault();
    const motivo = form.MotivoBaja.trim();
    if (motivo.length < 5) {
      setErrores({ MotivoBaja: [motivo ? 'Detalla un poco más el motivo (mínimo 5 caracteres).' : 'Elige el motivo de la desactivación.'] });
      return;
    }
    terminar(motivo);
  }

  return (
    <BajaContext.Provider value={pedir}>
      {children}
      <Modal open={Boolean(pedido)} onClose={() => terminar(null)} title="Desactivar registro">
        {pedido && (
          <Form onSubmit={enviar}>
            <HelpText>{pedido.mensaje}</HelpText>
            <TextoEstandar
              form={form}
              setForm={setForm}
              errors={errores}
              name="MotivoBaja"
              label="Motivo de la desactivación"
              opciones={opcionesDeBaja(pedido.endpoint)}
              variante="radios"
              maxLength={300}
              required
            />
            <HelpText>{pedido.ayuda ?? 'El registro no se borra: deja de ofrecerse en los formularios y puede reactivarse. El motivo queda en la auditoría.'}</HelpText>
            <FormActions onCancel={() => terminar(null)} submitLabel="Desactivar" />
          </Form>
        )}
      </Modal>
    </BajaContext.Provider>
  );
}
