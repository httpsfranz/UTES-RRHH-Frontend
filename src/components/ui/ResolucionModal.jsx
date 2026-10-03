import { useState } from 'react';
import { MessageSquareText, UserCheck } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Modal from '../Modal';
import Form from './Form';
import FormActions from './FormActions';
import Select from './Select';
import Textarea from './Textarea';
import HelpText from './HelpText';

/**
 * Aprobar o rechazar una solicitud. `accion` es 'aprobar' | 'rechazar' (null = cerrado); `item` es el registro.
 * Pide quien resuelve (mientras no exista el login) y el motivo, que al rechazar es obligatorio.
 * `resolver(item, accion, { UsuarioId, Motivo })` hace la llamada y devuelve { ok, errores } (useAccionDeRegistro).
 */
export default function ResolucionModal({ item, accion, titulo, ayuda, resolver, onClose }) {
  const usuarios = useOpciones('/usuarios', { etiqueta: (usuario) => `${usuario.nombre}${usuario.trabajador ? ` — ${usuario.trabajador.nombre_completo}` : ''}` });
  const [form, setForm] = useState({ UsuarioId: '', Motivo: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const rechazo = accion === 'rechazar';

  // Al abrir con otro registro/accion el formulario vuelve a estar en blanco.
  const clave = item && accion ? `${item.id}-${accion}` : null;
  const [claveActual, setClaveActual] = useState(null);
  if (clave !== claveActual) {
    setClaveActual(clave);
    setForm({ UsuarioId: '', Motivo: '' });
    setErrores({});
  }

  async function enviar(event) {
    event.preventDefault();
    const locales = {};
    if (!form.UsuarioId) locales.UsuarioId = ['Indica quién resuelve.'];
    if (rechazo && !form.Motivo.trim()) locales.Motivo = ['Indica el motivo del rechazo.'];
    if (Object.keys(locales).length) {
      setErrores(locales);
      return;
    }
    setEnviando(true);
    const resultado = await resolver(item, accion, form);
    setEnviando(false);
    if (resultado.ok) onClose();
    else setErrores(resultado.errores);
  }

  return (
    <Modal open={Boolean(item && accion)} onClose={onClose} title={titulo}>
      <Form onSubmit={enviar} generalError={errores.general?.[0]}>
        <Select
          form={form}
          setForm={setForm}
          errors={errores}
          name="UsuarioId"
          label="Quién resuelve"
          icon={UserCheck}
          options={usuarios.opciones}
          required
        />
        <Textarea
          form={form}
          setForm={setForm}
          errors={errores}
          name="Motivo"
          label={rechazo ? 'Motivo del rechazo' : 'Observación'}
          icon={MessageSquareText}
          maxLength={500}
          required={rechazo}
        />
        {ayuda && <HelpText>{ayuda}</HelpText>}
        <FormActions onCancel={onClose} submitting={enviando} submitLabel={rechazo ? 'Rechazar' : 'Aprobar'} savingLabel="Enviando…" />
      </Form>
    </Modal>
  );
}
