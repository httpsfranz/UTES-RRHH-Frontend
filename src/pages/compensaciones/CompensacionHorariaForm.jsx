import { CalendarDays, FileText, Hourglass, ListChecks, UserCog, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function CompensacionHorariaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: tipos } = useOpciones('/tipos-compensacion', { actual: form.TipoCompensacionId });
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.CompensacionHorariaAutorizadoPor, sinOpcion: 'Aún sin autorizar', etiqueta: (usuario) => usuario.nombre });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <Select form={form} setForm={setForm} errors={errors} name="TipoCompensacionId" label="Origen de las horas" icon={ListChecks} options={tipos} required />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="CompensacionHorariaHorasGeneradas"
          label="Horas generadas"
          icon={Hourglass}
          required
          maxLength={5}
          filter="decimal"
          inputMode="decimal"
          placeholder="Ej. 2 o 1.5"
        />
        <Field form={form} setForm={setForm} errors={errors} name="CompensacionHorariaFechaLimite" label="Compensar hasta" icon={CalendarDays} type="date" />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="CompensacionHorariaAutorizadoPor" label="Jefe que autorizó" icon={UserCog} options={usuarios} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CompensacionHorariaAutorizadoPreviamente" label="El trabajo fue autorizado previamente por el jefe inmediato" />
      <Textarea form={form} setForm={setForm} errors={errors} name="CompensacionHorariaObservacion" label="Observación" icon={FileText} maxLength={500} />
      <HelpText>
        RIT, Art. 17: el trabajo fuera de la jornada es excepcional y voluntario, requiere autorización previa del jefe, es de una hora
        como mínimo y se compensa como máximo hasta el mes siguiente. Sin autorización previa no procede la compensación.
      </HelpText>
    </>
  );
}
