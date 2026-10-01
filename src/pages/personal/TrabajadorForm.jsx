import { CalendarDays, GraduationCap, IdCard, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { SEXOS } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';

// El formato del numero depende del tipo de documento (mismas reglas que App\Rules\DocumentoIdentidad):
// DNI = 8 digitos; CE y PTP = solo digitos (hasta 12); pasaporte y otros = letras y numeros.
function reglasDelDocumento(tipo) {
  const codigo = String(tipo?.codigo ?? '').toUpperCase();
  if (codigo === 'DNI') return { filter: 'digitos', maxLength: 8, placeholder: '8 dígitos' };
  if (codigo === 'CE' || codigo === 'PTP') return { filter: 'digitos', maxLength: Math.max(9, tipo.longitud ?? 12), placeholder: 'Solo dígitos (9 a 12)' };
  return { filter: 'alfanumerico', maxLength: Math.max(6, tipo?.longitud ?? 20), placeholder: 'Letras y números' };
}

export default function TrabajadorForm({ form, setForm, errors }) {
  const tipos = useOpciones('/tipos-documento-identidad', { actual: form.TipoDocumentoIdentidadId });
  const { opciones: opcionesProfesion } = useOpciones('/profesiones', { actual: form.ProfesionId, sinOpcion: 'Sin profesión registrada' });

  const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoDocumentoIdentidadId));
  const documento = reglasDelDocumento(tipo);

  return (
    <>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoDocumentoIdentidadId"
          label="Tipo de documento"
          icon={IdCard}
          options={tipos.opciones}
          required
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TrabajadorNumeroDocumento"
          label="Número de documento"
          icon={IdCard}
          required
          maxLength={documento.maxLength}
          filter={documento.filter}
          placeholder={documento.placeholder}
        />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TrabajadorNombres" label="Nombres" icon={User} required maxLength={100} />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorApellidoPaterno" label="Apellido paterno" icon={Users} required maxLength={100} />
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorApellidoMaterno" label="Apellido materno" icon={Users} maxLength={100} />
      </FormGrid>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TrabajadorSexo"
          label="Sexo"
          icon={User}
          options={[{ value: '', label: 'No especificado' }, ...SEXOS]}
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TrabajadorFechaNacimiento"
          label="Fecha de nacimiento"
          icon={CalendarDays}
          type="date"
        />
      </FormGrid>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="ProfesionId"
        label="Profesión"
        icon={GraduationCap}
        options={opcionesProfesion}
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TrabajadorCorreo"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          maxLength={200}
          placeholder="nombre@dominio.pe"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TrabajadorTelefono"
          label="Teléfono"
          icon={Phone}
          maxLength={9}
          filter="digitos"
          inputMode="tel"
          placeholder="9 dígitos, Ej. 987654321"
        />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TrabajadorDireccion" label="Dirección" icon={MapPin} maxLength={300} />
    </>
  );
}
