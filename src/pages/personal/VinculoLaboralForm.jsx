import { Briefcase, CalendarDays, Hash, Hospital, Landmark, Scale, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

// `sinTrabajador`: el trabajador ya esta decidido (asistente de alta, ficha del trabajador) y no se pregunta.
export default function VinculoLaboralForm({ form, setForm, errors, sinTrabajador }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { actual: form.TrabajadorId, etiqueta: etiquetaTrabajador });
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const { opciones: regimenes } = useOpciones('/regimenes-laborales', { actual: form.RegimenLaboralId });
  const condiciones = useOpciones('/condiciones-laborales', { actual: form.CondicionLaboralId });
  const { opciones: cargos } = useOpciones('/cargos', { actual: form.CargoId });

  const condicion = condiciones.filas.find((fila) => String(fila.id) === String(form.CondicionLaboralId));
  const conCese = Boolean(form.VinculoLaboralFechaFin) || Boolean(form.VinculoLaboralMotivoCese);

  return (
    <>
      {!sinTrabajador && (
        <SelectBuscable form={form} setForm={setForm} errors={errors} name="TrabajadorId" label="Trabajador" icon={UserRound} options={trabajadores} required />
      )}
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="EessId"
          label="Establecimiento"
          icon={Hospital}
          options={establecimientos}
          required
        />
        <Select form={form} setForm={setForm} errors={errors} name="CargoId" label="Cargo" icon={Briefcase} options={cargos} required />
      </FormGrid>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="RegimenLaboralId"
          label="Régimen laboral"
          icon={Scale}
          options={regimenes}
          required
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="CondicionLaboralId"
          label="Condición laboral"
          icon={Landmark}
          options={condiciones.opciones}
          required
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="VinculoLaboralCodigoAirhsp"
          label="Código AIRHSP"
          icon={Hash}
          required={Boolean(condicion?.requiere_airhsp)}
          maxLength={20}
          filter="alfanumerico"
          placeholder={condicion?.requiere_airhsp ? 'Obligatorio para esta condición' : 'Opcional'}
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="VinculoLaboralFechaInicio"
          label="Fecha de inicio"
          icon={CalendarDays}
          type="date"
          required
        />
        <Field form={form} setForm={setForm} errors={errors} name="VinculoLaboralFechaFin" label="Fecha de fin" icon={CalendarDays} type="date" />
      </FormGrid>
      {conCese && (
        <TextoEstandar
          form={form}
          setForm={setForm}
          errors={errors}
          name="VinculoLaboralMotivoCese"
          opciones={TEXTOS.motivoCese}
          label="Motivo de cese"
          maxLength={300}
        />
      )}
      <HelpText>
        Deja la fecha de fin vacía mientras el vínculo siga vigente. Un trabajador no puede tener dos vínculos activos con fechas superpuestas (RIT,
        Art. 86), salvo el personal médico, que puede tener un segundo vínculo autorizado.
      </HelpText>
    </>
  );
}
