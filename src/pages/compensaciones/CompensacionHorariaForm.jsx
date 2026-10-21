import { CalendarDays, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo, fechaIso, formatoFecha } from '../../utils/formato';
import Field from '../../components/ui/Field';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Checkbox from '../../components/ui/Checkbox';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

/** Ultimo dia del mes siguiente al trabajo: hasta cuando se puede compensar (RIT, Art. 17). */
const limite = (fecha) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '')) return null;
  const [anio, mes] = fecha.split('-').map(Number);
  return fechaIso(new Date(anio, mes + 1, 0));
};

/**
 * Autorizacion PREVIA del trabajo fuera de la jornada (RIT, Art. 17): el jefe indica quien y que dia. No se escriben
 * horas: salen de la marca de salida cuando el dia ocurre. Tampoco el "compensar hasta": es el fin del mes siguiente.
 */
export default function CompensacionHorariaForm({ form, setForm, errors, editando }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const pasado = form.CompensacionHorariaFechaTrabajo && form.CompensacionHorariaFechaTrabajo < fechaIso(new Date());
  const hasta = limite(form.CompensacionHorariaFechaTrabajo);

  return (
    <>
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="VinculoLaboralId"
        label="Trabajador (vínculo)"
        icon={UserRound}
        options={vinculos}
        required
        disabled={editando}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="CompensacionHorariaFechaTrabajo"
        label="Día del trabajo fuera de jornada"
        icon={CalendarDays}
        type="date"
        required
      />
      {pasado && !editando && (
        <Checkbox
          form={form}
          setForm={setForm}
          errors={errors}
          name="CompensacionHorariaAutorizadoPreviamente"
          label="El trabajo se autorizó antes, por correo o documento (RIT, Art. 17)"
        />
      )}
      <TextoEstandar
        form={form}
        setForm={setForm}
        errors={errors}
        name="CompensacionHorariaObservacion"
        opciones={TEXTOS.motivoTrabajoAdicional}
        label="Motivo del trabajo adicional"
        maxLength={500}
      />
      <HelpText>
        Las horas se calculan solas con la marca de salida frente al fin de su turno (o todo el día si no tenía turno), y solo cuentan desde una hora
        (Art. 17).{hasta ? ` Se podrán compensar hasta el ${formatoFecha(hasta)}.` : ''} Después, el responsable las valida.
      </HelpText>
    </>
  );
}
