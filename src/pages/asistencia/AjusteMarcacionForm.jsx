import { CalendarClock, FileText } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { TIPOS_MARCACION, etiquetaDe } from '../../utils/opciones';
import { formatoFechaHora } from '../../utils/formato';
import Field from '../../components/ui/Field';
import SelectorDeDocumento from '../../components/ui/SelectorDeDocumento';
import SelectBuscable from '../../components/ui/SelectBuscable';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

const etiquetaMarcacion = (marcacion) =>
  `${formatoFechaHora(marcacion.fecha_hora)} · ${etiquetaDe(TIPOS_MARCACION, marcacion.tipo)} · ${marcacion.trabajador?.nombre_completo ?? ''}`;

// Hace 60 dias en formato AAAA-MM-DD: las marcaciones mas antiguas casi siempre ya estan en un periodo cerrado.
const haceDosMeses = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - 60);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
};

// `filtro` ({ vinculo_laboral_id, desde, hasta }) limita las marcas ofrecidas: el control de asistencia abre el ajuste
// desde la celda de un dia y solo muestra las marcas de ese trabajador ese dia.
export default function AjusteMarcacionForm({ form, setForm, errors, filtro }) {
  const marcaciones = useOpciones('/marcaciones', {
    params: { valida: 1, desde: haceDosMeses(), ...filtro },
    actual: form.MarcacionId,
    etiqueta: etiquetaMarcacion,
  });
  const documentos = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  return (
    <>
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="MarcacionId"
        label="Marcación a ajustar"
        icon={CalendarClock}
        options={marcaciones.opciones}
        required
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="AjusteMarcacionFechaHoraNueva"
        label="Fecha y hora correctas"
        icon={CalendarClock}
        type="datetime-local"
      />
      <HelpText>Si la dejas vacía, al aprobar el ajuste la marcación queda invalidada (por ejemplo, una lectura duplicada).</HelpText>
      <TextoEstandar
        form={form}
        setForm={setForm}
        errors={errors}
        name="AjusteMarcacionMotivo"
        opciones={TEXTOS.ajusteMarcacion}
        label="Motivo del ajuste"
        maxLength={1000}
        required
      />
      <SelectorDeDocumento
        form={form}
        setForm={setForm}
        errors={errors}
        name="DocumentoSustentoId"
        label="Documento de sustento"
        icon={FileText}
        options={documentos.opciones}
      />
      <HelpText>
        Un período de asistencia cerrado es inmutable: no admite ajustes. Al aprobarse, el ajuste corrige la marcación y avisa a quien lo solicitó; un
        ajuste aprobado ya no se anula, se corrige con otra solicitud.
      </HelpText>
    </>
  );
}
