import { AtSign, KeyRound, Mail, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import Field from '../../components/ui/Field';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function UsuarioForm({ form, setForm, errors, editando }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { actual: form.TrabajadorId, etiqueta: etiquetaTrabajador });

  return (
    <>
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="TrabajadorId"
        label="Trabajador"
        icon={UserRound}
        options={trabajadores}
        required
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="UsuarioNombre"
          label="Usuario"
          icon={AtSign}
          required
          maxLength={100}
          filter="usuario"
          placeholder="Ej. mquispe"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="UsuarioCorreo"
          label="Correo de la cuenta"
          icon={Mail}
          type="email"
          maxLength={200}
          placeholder="nombre@dominio.pe"
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="UsuarioPassword"
          label={editando ? 'Nueva contraseña' : 'Contraseña'}
          icon={KeyRound}
          type="password"
          required={!editando}
          maxLength={72}
          autoComplete="new-password"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="UsuarioPasswordConfirmacion"
          label="Confirmar contraseña"
          icon={KeyRound}
          type="password"
          required={!editando}
          maxLength={72}
          autoComplete="new-password"
        />
      </FormGrid>
      <HelpText>
        {editando
          ? 'Deja las contraseñas vacías para conservar la actual. '
          : ''}
        Mínimo 8 caracteres, con letras y números. Cada trabajador tiene una sola cuenta.
      </HelpText>
    </>
  );
}
