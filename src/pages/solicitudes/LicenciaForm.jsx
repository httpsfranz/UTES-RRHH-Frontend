import { CalendarDays, FileText, Hash, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import NumeroAutomatico from '../../components/ui/NumeroAutomatico';
import Select from '../../components/ui/Select';
import SelectorDeDocumento from '../../components/ui/SelectorDeDocumento';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

// Topes mayores por caso especial (RIT, Art. 34, 35 y 37).
const CASOS_ESPECIALES = {
  MATERNIDAD: [
    { value: '', label: 'Sin caso especial (98 días)' },
    { value: 'PARTO_MULTIPLE', label: 'Parto múltiple (128 días)' },
    { value: 'NINO_CON_DISCAPACIDAD', label: 'Niño con discapacidad (128 días)' },
  ],
  PATERNIDAD: [
    { value: '', label: 'Parto natural o cesárea (10 días)' },
    { value: 'PREMATURO', label: 'Nacimiento prematuro (20 días)' },
    { value: 'PARTO_MULTIPLE', label: 'Parto múltiple (20 días)' },
    { value: 'ENFERMEDAD_CONGENITA', label: 'Enfermedad congénita terminal o discapacidad severa (30 días)' },
    { value: 'COMPLICACION_MADRE', label: 'Complicación grave de la madre (30 días)' },
  ],
  FALLECIMIENTO: [
    { value: '', label: 'En el lugar de trabajo' },
    { value: 'OTRO_LUGAR', label: 'En otro lugar (3 días más)' },
  ],
};

export default function LicenciaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const tipos = useOpciones('/tipos-licencia', {
    actual: form.TipoLicenciaId,
    etiqueta: (tipo) => `${tipo.nombre}${tipo.maximo_dias ? ` (máx. ${tipo.maximo_dias} días)` : ''}${tipo.activo === false ? ' (inactivo)' : ''}`,
  });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoLicenciaId));
  const casos = tipo ? CASOS_ESPECIALES[tipo.codigo] : null;

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
        name="TipoLicenciaId"
        label="Tipo de licencia"
        icon={ListChecks}
        options={tipos.opciones}
        required
      />
      {casos && <Select form={form} setForm={setForm} errors={errors} name="LicenciaCasoEspecial" label="Caso" icon={ListChecks} options={casos} />}
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="LicenciaFechaInicio" label="Desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="LicenciaFechaFin" label="Hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <NumeroAutomatico name="LicenciaNumeroResolucion" label="N.º de resolución" icon={Hash} valor={form.LicenciaNumeroResolucion} />
      <FormGrid>
        <SelectorDeDocumento
          form={form}
          setForm={setForm}
          errors={errors}
          name="DocumentoSustentoId"
          label="Documento de sustento"
          icon={FileText}
          options={documentos}
        />
      </FormGrid>
      <TextoEstandar
        form={form}
        setForm={setForm}
        errors={errors}
        name="LicenciaMotivo"
        opciones={TEXTOS.motivoLicencia}
        label="Motivo"
        maxLength={1000}
      />
      <HelpText>
        Los días se cuentan corridos, con sábados, domingos y feriados (RIT, Art. 55)
        {tipo?.maximo_dias ? `; esta licencia admite hasta ${tipo.maximo_dias} días` : ''}. Si la licencia es de 30 días o más, el servidor entrega
        cargo antes de usarla (Art. 56).
      </HelpText>
    </>
  );
}
