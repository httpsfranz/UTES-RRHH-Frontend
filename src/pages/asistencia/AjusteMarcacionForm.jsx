import { CalendarClock, FileText, MessageSquareText, UserCog } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { TIPOS_MARCACION, etiquetaDe } from '../../utils/opciones';
import { formatoFechaHora } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import HelpText from '../../components/ui/HelpText';

const etiquetaMarcacion = (marcacion) =>
  `${formatoFechaHora(marcacion.fecha_hora)} · ${etiquetaDe(TIPOS_MARCACION, marcacion.tipo)} · ${marcacion.trabajador?.nombre_completo ?? ''}`;

// Hace 60 dias en formato AAAA-MM-DD: las marcaciones mas antiguas casi siempre ya estan en un periodo cerrado.
const haceDosMeses = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - 60);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
};

export default function AjusteMarcacionForm({ form, setForm, errors }) {
  const marcaciones = useOpciones('/marcaciones', { params: { valida: 1, desde: haceDosMeses() }, actual: form.MarcacionId, etiqueta: etiquetaMarcacion });
  const documentos = useOpciones('/documentos-sustento', { params: {}, sinOpcion: 'Sin documento adjunto', etiqueta: (documento) => documento.nombre });
  const usuarios = useOpciones('/usuarios', { actual: form.UsuarioId, etiqueta: (usuario) => usuario.nombre });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="MarcacionId" label="Marcación a ajustar" icon={CalendarClock} options={marcaciones.opciones} required />
      <Field form={form} setForm={setForm} errors={errors} name="AjusteMarcacionFechaHoraNueva" label="Fecha y hora correctas" icon={CalendarClock} type="datetime-local" />
      <HelpText>Si la dejas vacía, al aprobar el ajuste la marcación queda invalidada (por ejemplo, una lectura duplicada).</HelpText>
      <Textarea form={form} setForm={setForm} errors={errors} name="AjusteMarcacionMotivo" label="Motivo del ajuste" icon={MessageSquareText} maxLength={1000} required />
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento de sustento" icon={FileText} options={documentos.opciones} />
      <Select form={form} setForm={setForm} errors={errors} name="UsuarioId" label="Quién solicita" icon={UserCog} options={usuarios.opciones} required />
      <HelpText>
        Un período de asistencia cerrado es inmutable: no admite ajustes. Al aprobarse, el ajuste corrige la marcación y avisa a quien lo
        solicitó; un ajuste aprobado ya no se anula, se corrige con otra solicitud.
      </HelpText>
    </>
  );
}
