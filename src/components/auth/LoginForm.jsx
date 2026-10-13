import { useState } from 'react';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Field from '../ui/Field';

// Formulario de acceso: usuario (nombre o correo) y contrasena. `onSubmit(usuario, password)` devuelve el mensaje de
// error o null si el acceso fue correcto.
export default function LoginForm({ onSubmit }) {
  const [form, setForm] = useState({ usuario: '', password: '' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [verClave, setVerClave] = useState(false);

  async function enviar(event) {
    event.preventDefault();
    const faltan = {};
    if (!form.usuario.trim()) faltan.usuario = ['Ingresa tu usuario.'];
    if (!form.password) faltan.password = ['Ingresa tu contraseña.'];
    setErrores(faltan);
    setMensaje('');
    if (Object.keys(faltan).length > 0) return;

    setEnviando(true);
    const error = await onSubmit(form.usuario.trim(), form.password);
    if (error) {
      setMensaje(error);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      <Alert>{mensaje}</Alert>
      <Field form={form} setForm={setForm} errors={errores} name="usuario" label="Usuario o correo" icon={User} autoComplete="username" maxLength={150} />
      <div className="relative">
        <Field form={form} setForm={setForm} errors={errores} name="password" label="Contraseña" icon={Lock} type={verClave ? 'text' : 'password'} autoComplete="current-password" maxLength={200} />
        <button
          type="button"
          onClick={() => setVerClave((v) => !v)}
          aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-3 top-[34px] rounded-lg p-1 text-muted transition-colors hover:text-heading"
        >
          {verClave ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Button type="submit" icon={LogIn} disabled={enviando} className="w-full py-3">
        {enviando ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  );
}
