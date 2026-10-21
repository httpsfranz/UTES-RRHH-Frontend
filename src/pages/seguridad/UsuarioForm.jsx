import { AtSign, KeyRound, Mail, ToggleRight, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

// Estado de la cuenta desde el mismo formulario: activa, desactivada o bloqueada (bloquear o desactivar cierra sus sesiones).
const ESTADOS_CUENTA = [
  { value: 'ACTIVO', label: 'Activa' },
  { value: 'INACTIVO', label: 'Desactivada' },
  { value: 'BLOQUEADO', label: 'Bloqueada' },
];

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
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="UsuarioEstadoCuenta"
          label="Estado de la cuenta"
          icon={ToggleRight}
          options={ESTADOS_CUENTA}
          required
        />
        {form.UsuarioEstadoCuenta === 'BLOQUEADO' && (
          <TextoEstandar
            form={form}
            setForm={setForm}
            errors={errors}
            name="UsuarioMotivoBloqueo"
            opciones={TEXTOS.motivoBloqueo}
            label="Motivo del bloqueo"
            required
            maxLength={200}
          />
        )}
      </FormGrid>
      <HelpText>
        {editando ? 'Deja las contraseñas vacías para conservar la actual. ' : ''}
        Mínimo 8 caracteres, con letras y números. Cada trabajador tiene una sola cuenta. Al primer ingreso (o si le cambias la clave) el usuario debe
        cambiarla.
      </HelpText>
    </>
  );
}
