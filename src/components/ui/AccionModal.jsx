import { useState } from 'react';
import FormModal from './FormModal';
import HelpText from './HelpText';

/**
 * Accion sobre un registro que pide unos pocos datos (iniciar un PAD, observar un consolidado, bloquear una cuenta...).
 * Guarda su propio formulario y muestra los errores que devuelva la API.
 *
 *   abierto    clave que cambia al abrir con otro registro (null = cerrado)
 *   inicial    valores iniciales del formulario
 *   enviar     (form) => Promise<{ ok, errores }>   (p. ej. useAccionDeRegistro().ejecutar)
 *   campos     (form, setForm, errors) => elementos del formulario
 */
export default function AccionModal({ abierto, titulo, inicial = {}, ayuda, enviar, onClose, campos }) {
  const [form, setForm] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [claveActual, setClaveActual] = useState(null);
  if (abierto !== claveActual) {
    setClaveActual(abierto);
    setForm(inicial);
    setErrores({});
  }

  async function alEnviar(event) {
    event.preventDefault();
    setEnviando(true);
    const resultado = await enviar(form);
    setEnviando(false);
    if (resultado.ok) onClose();
    else setErrores(resultado.errores ?? {});
  }

  return (
    <FormModal open={Boolean(abierto)} onClose={onClose} title={titulo} onSubmit={alEnviar} error={errores.general?.[0]} submitting={enviando}>
      {campos(form, setForm, errores)}
      {ayuda && <HelpText>{ayuda}</HelpText>}
    </FormModal>
  );
}
