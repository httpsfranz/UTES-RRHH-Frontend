import { CalendarDays, GraduationCap, IdCard, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import { useConsultaDni } from '../../hooks/useConsultaDni';
import { useOpciones } from '../../hooks/useOpciones';
import { SEXOS } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import Alert from '../../components/ui/Alert';
import EditorDeColegiaturas from '../../components/ui/EditorDeColegiaturas';
import { OTRO } from '../../utils/colegiaturas';

const MENSAJES_DNI = {
  consultando: 'Consultando el DNI…',
  encontrado: 'Nombres y apellidos completados desde RENIEC. Revísalos antes de guardar.',
  no_encontrado: 'No se encontró ese DNI: escribe los datos manualmente.',
  no_disponible: 'La consulta automática no está disponible: escribe los datos manualmente.',
};

/**
 * Un solo formulario para el trabajador: DNI (la Red identifica a su personal solo con DNI), datos personales,
 * profesion (con "Otro" se escribe una nueva, que queda en el catalogo) y sus colegiaturas.
 */
export default function TrabajadorForm({ form, setForm, errors, editando = false }) {
  // "Otra" no es un id: no se consulta como registro actual.
  const { opciones: opcionesProfesion } = useOpciones('/profesiones', { actual: form.ProfesionId === OTRO ? undefined : form.ProfesionId, sinOpcion: 'Sin profesión registrada' });
  const { opciones: opcionesColegio } = useOpciones('/tipos-colegiatura');
  const otraProfesion = form.ProfesionId === OTRO;

  // Al crear, nombres y apellidos se autocompletan con el DNI; si el servicio falla, todo se escribe a mano.
  const consulta = useConsultaDni({
    activo: !editando,
    dni: form.TrabajadorNumeroDocumento ?? '',
    alEncontrar: (datos) => setForm((f) => ({ ...f, TrabajadorNombres: datos.nombres, TrabajadorApellidoPaterno: datos.apellido_paterno, TrabajadorApellidoMaterno: datos.apellido_materno })),
  });

  return (
    <>
      <Field form={form} setForm={setForm} errors={errors} name="TrabajadorNumeroDocumento" label="DNI" icon={IdCard} required maxLength={8} filter="digitos" placeholder="8 dígitos" />
      {consulta.yaRegistrado && <Alert variant="text">Ya existe un trabajador con este DNI.</Alert>}
      {MENSAJES_DNI[consulta.estado] && <HelpText>{MENSAJES_DNI[consulta.estado]}</HelpText>}
      <Field form={form} setForm={setForm} errors={errors} name="TrabajadorNombres" label="Nombres" icon={User} required maxLength={100} />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorApellidoPaterno" label="Apellido paterno" icon={Users} required maxLength={100} />
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorApellidoMaterno" label="Apellido materno" icon={Users} maxLength={100} />
      </FormGrid>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="TrabajadorSexo" label="Sexo" icon={User} options={[{ value: '', label: 'No especificado' }, ...SEXOS]} />
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorFechaNacimiento" label="Fecha de nacimiento" icon={CalendarDays} type="date" />
      </FormGrid>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="ProfesionId"
          label="Profesión"
          icon={GraduationCap}
          options={[...opcionesProfesion, { value: OTRO, label: 'Otra (escribir)…' }]}
        />
        {otraProfesion && <Field form={form} setForm={setForm} errors={errors} name="ProfesionNueva" label="Nombre de la profesión" icon={GraduationCap} required maxLength={150} placeholder="Ej. Tecnólogo médico en radiología" />}
      </FormGrid>
      {otraProfesion && <HelpText>La profesión se agrega al catálogo al guardar y queda disponible para los demás trabajadores.</HelpText>}
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorCorreo" label="Correo electrónico" icon={Mail} type="email" maxLength={200} placeholder="nombre@dominio.pe" />
        <Field form={form} setForm={setForm} errors={errors} name="TrabajadorTelefono" label="Teléfono" icon={Phone} maxLength={9} filter="digitos" inputMode="tel" placeholder="9 dígitos, Ej. 987654321" />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TrabajadorDireccion" label="Dirección" icon={MapPin} maxLength={300} />
      <EditorDeColegiaturas filas={form.Colegiaturas} onChange={(Colegiaturas) => setForm((f) => ({ ...f, Colegiaturas }))} opciones={opcionesColegio} errores={errors} />
    </>
  );
}
