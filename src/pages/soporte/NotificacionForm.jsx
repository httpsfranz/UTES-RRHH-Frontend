import { Bell, Hash, Link2, MessageSquareText, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { conValorActual, TIPOS_NOTIFICACION } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';

export default function NotificacionForm({ form, setForm, errors }) {
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioId, etiqueta: (usuario) => usuario.nombre });

  return (
    <>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="UsuarioId" label="Destinatario" icon={UserRound} options={usuarios} required />
        <Select form={form} setForm={setForm} errors={errors} name="NotificacionTipo" label="Tipo" icon={Hash} options={conValorActual(TIPOS_NOTIFICACION, form.NotificacionTipo)} required />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="NotificacionTitulo" label="Título" icon={Bell} required maxLength={200} />
      <Textarea form={form} setForm={setForm} errors={errors} name="NotificacionMensaje" label="Mensaje" icon={MessageSquareText} required maxLength={1000} />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="NotificacionEnlace"
        label="Enlace interno (opcional)"
        icon={Link2}
        maxLength={300}
        placeholder="Ej. /solicitudes/papeletas"
      />
    </>
  );
}
