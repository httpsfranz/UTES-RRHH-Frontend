import { CalendarDays, FileText, Hash, IdCard, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function ColegiaturaForm({ form, setForm, errors }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { actual: form.TrabajadorId, etiqueta: etiquetaTrabajador });
  const { opciones: colegios } = useOpciones('/tipos-colegiatura', { actual: form.ColegiaturaTipoId });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin constancia adjunta',
    etiqueta: (documento) => documento.nombre,
  });

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
        <Select form={form} setForm={setForm} errors={errors} name="ColegiaturaTipoId" label="Colegio profesional" icon={IdCard} options={colegios} required />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ColegiaturaNumero"
          label="Número de colegiatura"
          icon={Hash}
          required
          maxLength={30}
          filter="alfanumerico"
        />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaFechaColegiatura" label="Fecha de colegiatura" icon={CalendarDays} type="date" />
        <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaFechaHabilitacion" label="Habilitado desde" icon={CalendarDays} type="date" />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaFechaVencimiento" label="La habilitación vence el" icon={CalendarDays} type="date" />
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Constancia de habilitación" icon={FileText} options={documentos} />
      <Textarea form={form} setForm={setForm} errors={errors} name="ColegiaturaObservacion" label="Observación" icon={FileText} maxLength={500} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="ColegiaturaEsHabilitado" label="Habilitado por su colegio profesional" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="ColegiaturaEsPrincipal" label="Es la colegiatura principal del trabajador" />
      <HelpText>
        El trabajador debe mantener colegiatura y habilitación vigentes (RIT, obligación 37). El colegio debe corresponder a su profesión.
      </HelpText>
    </>
  );
}
