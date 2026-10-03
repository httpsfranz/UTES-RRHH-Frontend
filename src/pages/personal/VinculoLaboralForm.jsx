import { Briefcase, CalendarDays, FileText, Hash, Hospital, Landmark, Scale, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function VinculoLaboralForm({ form, setForm, errors }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { actual: form.TrabajadorId, etiqueta: etiquetaTrabajador });
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const { opciones: regimenes } = useOpciones('/regimenes-laborales', { actual: form.RegimenLaboralId });
  const condiciones = useOpciones('/condiciones-laborales', { actual: form.CondicionLaboralId });
  const { opciones: cargos } = useOpciones('/cargos', { actual: form.CargoId });

  const condicion = condiciones.filas.find((fila) => String(fila.id) === String(form.CondicionLaboralId));
  const conCese = Boolean(form.VinculoLaboralFechaFin) || Boolean(form.VinculoLaboralMotivoCese);

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
        <Select form={form} setForm={setForm} errors={errors} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} required />
        <Select form={form} setForm={setForm} errors={errors} name="CargoId" label="Cargo" icon={Briefcase} options={cargos} required />
      </FormGrid>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="RegimenLaboralId" label="Régimen laboral" icon={Scale} options={regimenes} required />
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
        <Field form={form} setForm={setForm} errors={errors} name="VinculoLaboralNumeroPlaza" label="Número de plaza" icon={Hash} maxLength={30} />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="VinculoLaboralCodigo"
        label="Código interno"
        icon={Hash}
        maxLength={50}
        filter="codigo"
        placeholder="Opcional. Ej. VL-0100"
      />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="VinculoLaboralFechaInicio" label="Fecha de inicio" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="VinculoLaboralFechaFin" label="Fecha de fin" icon={CalendarDays} type="date" />
      </FormGrid>
      {conCese && (
        <Field form={form} setForm={setForm} errors={errors} name="VinculoLaboralMotivoCese" label="Motivo de cese" icon={FileText} maxLength={300} />
      )}
      <HelpText>
        Deja la fecha de fin vacía mientras el vínculo siga vigente. Un trabajador no puede tener dos vínculos activos con fechas
        superpuestas (RIT, Art. 86), salvo el personal médico, que puede tener un segundo vínculo autorizado.
      </HelpText>
    </>
  );
}
