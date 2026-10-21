import { CalendarDays, FileText, ListChecks, MapPin, Stethoscope, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo, formatoFecha } from '../../utils/formato';
import { ESTADOS_CONSTATACION } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectorDeDocumento from '../../components/ui/SelectorDeDocumento';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

export default function ConstatacionDomiciliariaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const descansos = useOpciones('/descansos-medicos', {
    params: {},
    actual: form.DescansoMedicoId,
    etiqueta: (d) =>
      `${d.trabajador?.nombre_completo ?? ''} · ${d.numero_citt ?? 'sin CITT'} (${formatoFecha(d.fecha_inicio)} – ${formatoFecha(d.fecha_fin)})`,
  });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  // Solo los descansos del trabajador elegido que siguen vigentes (ni rechazados ni anulados).
  const opcionesDescanso = [
    { value: '', label: 'No verifica un descanso médico' },
    ...descansos.filas
      .filter((d) => String(d.vinculo_laboral_id) === String(form.VinculoLaboralId) && !['RECHAZADO', 'ANULADO'].includes(d.estado))
      .map((d) => ({ value: d.id, label: descansos.opciones.find((o) => String(o.value) === String(d.id))?.label ?? d.id })),
  ];
  const resuelta = form.ConstatacionDomiciliariaEstado === 'CONFORME' || form.ConstatacionDomiciliariaEstado === 'NO_CONFORME';

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
      />
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="DescansoMedicoId"
        label="Descanso médico que se verifica"
        icon={Stethoscope}
        options={opcionesDescanso}
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConstatacionDomiciliariaFecha"
          label="Fecha de la visita"
          icon={CalendarDays}
          type="date"
          required
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ConstatacionDomiciliariaDireccion"
        label="Dirección visitada"
        icon={MapPin}
        maxLength={300}
      />
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="ConstatacionDomiciliariaEstado"
        label="Resultado de la visita"
        icon={ListChecks}
        options={ESTADOS_CONSTATACION}
        required
      />
      <TextoEstandar
        form={form}
        setForm={setForm}
        errors={errors}
        name="ConstatacionDomiciliariaResultado"
        opciones={TEXTOS.resultadoConstatacion}
        label="Detalle del resultado"
        maxLength={500}
        required={resuelta}
      />
      <SelectorDeDocumento
        form={form}
        setForm={setForm}
        errors={errors}
        name="DocumentoSustentoId"
        label="Acta de la visita"
        icon={FileText}
        options={documentos}
      />
      <HelpText>
        La constatación verifica el estado de salud de quien está con descanso médico y se hace dentro de sus fechas. Al resolverla como conforme o no
        conforme, queda como constancia y ya no se modifica.
      </HelpText>
    </>
  );
}
