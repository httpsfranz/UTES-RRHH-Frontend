import { CalendarDays, Shield, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function UsuarioRolForm({ form, setForm, errors }) {
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioId, etiqueta: (usuario) => `${usuario.nombre}${usuario.trabajador ? ` — ${usuario.trabajador.nombre_completo}` : ''}` });
  const { opciones: roles } = useOpciones('/roles', { actual: form.RolId });

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="UsuarioId" label="Usuario" icon={UserRound} options={usuarios} required />
      <Select form={form} setForm={setForm} errors={errors} name="RolId" label="Rol" icon={Shield} options={roles} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="UsuarioRolFechaInicio" label="Desde" icon={CalendarDays} type="date" />
        <Field form={form} setForm={setForm} errors={errors} name="UsuarioRolFechaFin" label="Hasta" icon={CalendarDays} type="date" />
      </FormGrid>
      <HelpText>
        Si no indicas la fecha de inicio, rige desde hoy. Un usuario tiene cada rol una sola vez: para devolverle un rol que tuvo, reactiva
        o edita la asignación existente.
      </HelpText>
    </>
  );
}
