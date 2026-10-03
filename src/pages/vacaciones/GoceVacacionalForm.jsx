import { CalendarDays, FileText, Palmtree } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { diasCalendario, formatoFecha } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

const etiquetaRol = (rol) =>
  `${rol.trabajador?.nombre_completo ?? 'Trabajador'} · ${formatoFecha(rol.fecha_programada)} – ${formatoFecha(rol.fecha_fin_programada)} (${rol.dias} días)`;

export default function GoceVacacionalForm({ form, setForm, errors }) {
  // El goce se pide sobre un descanso programado vigente.
  const roles = useOpciones('/roles-vacacionales', { params: { estado: 'PROGRAMADO' }, actual: form.RolVacacionalId, etiqueta: etiquetaRol });
  const documentos = useOpciones('/documentos-sustento', { params: {}, sinOpcion: 'Sin documento adjunto', etiqueta: (documento) => documento.nombre });

  const dias = diasCalendario(form.GoceVacacionalFechaInicio, form.GoceVacacionalFechaFin);
  const fraccionado = dias !== null && dias < 7;

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="RolVacacionalId" label="Descanso programado" icon={Palmtree} options={roles.opciones} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="GoceVacacionalFechaInicio" label="Inicio del goce" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="GoceVacacionalFechaFin" label="Fin del goce" icon={CalendarDays} type="date" required />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento de sustento" icon={FileText} options={documentos.opciones} required={fraccionado} />
      <HelpText>
        {dias ? `Son ${dias} día${dias === 1 ? '' : 's'} calendario${fraccionado ? ': un goce menor de 7 días es un fraccionamiento y se solicita por escrito, con el documento que lo sustenta. ' : '. '}` : ''}
        El goce debe caer dentro del descanso programado. No se otorga a quien esté incapacitado por enfermedad o accidente (RIT, Art. 70). Al
        aprobarlo se descuentan sus días de los disponibles del período vacacional.
      </HelpText>
    </>
  );
}
