import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useAuth } from '../../auth/useAuth';
import FormModal from '../ui/FormModal';
import Field from '../ui/Field';
import HelpText from '../ui/HelpText';

const VACIO = { PasswordActual: '', PasswordNueva: '', PasswordConfirmacion: '' };

// Cambio de la propia contrasena. `obligatorio`: primer ingreso o clave restablecida por el administrador; no se puede
// cerrar sin cambiarla (solo cerrar sesion).
export default function CambiarClaveModal({ abierto, obligatorio = false, onClose }) {
  const { actualizarPerfil, cerrarSesion } = useAuth();
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  async function guardar(event) {
    event.preventDefault();
    setEnviando(true);
    setErrores({});
    try {
      const { data } = await api.post('/auth/cambiar-password', form);
      actualizarPerfil(data);
      setForm(VACIO);
      onClose?.();
    } catch (err) {
      setErrores(err.response?.status === 422 ? (err.response.data.errors ?? {}) : { general: [mensajeDeError(err) ?? 'No se pudo cambiar la contraseña.'] });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <FormModal open={abierto} onClose={obligatorio ? cerrarSesion : onClose} title={obligatorio ? 'Cambia tu contraseña para continuar' : 'Cambiar mi contraseña'} onSubmit={guardar} error={errores.general?.[0]} submitting={enviando}>
      {obligatorio && <HelpText>Es tu primer ingreso o tu contraseña fue restablecida: elige una nueva que solo tú conozcas.</HelpText>}
      <Field form={form} setForm={setForm} errors={errores} name="PasswordActual" label="Contraseña actual" icon={KeyRound} type="password" required maxLength={200} autoComplete="current-password" />
      <Field form={form} setForm={setForm} errors={errores} name="PasswordNueva" label="Nueva contraseña" icon={KeyRound} type="password" required maxLength={72} autoComplete="new-password" />
      <Field form={form} setForm={setForm} errors={errores} name="PasswordConfirmacion" label="Confirmar nueva contraseña" icon={KeyRound} type="password" required maxLength={72} autoComplete="new-password" />
      <HelpText>Mínimo 8 caracteres, con letras y números, distinta de la actual.</HelpText>
    </FormModal>
  );
}
