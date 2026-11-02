import { CalendarDays, FileText, Hash, Hospital, ListChecks, Type, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Checkbox from '../../components/ui/Checkbox';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import SelectorDeDocumento from '../../components/ui/SelectorDeDocumento';

function SelectorDeVinculo(props) {
  const { opciones } = useOpciones('/vinculos-laborales', { actual: props.form[props.name], etiqueta: etiquetaVinculo });
  return <SelectBuscable {...props} icon={UserRound} options={opciones} />;
}

function SelectorDeTrabajador(props) {
  const { opciones } = useOpciones('/trabajadores', { actual: props.form[props.name], etiqueta: (t) => `${t.nombre_completo} · ${t.numero_documento}` });
  return <SelectBuscable {...props} icon={UserRound} options={opciones} />;
}

function SelectorDeEess(props) {
  const { opciones } = useOpciones('/establecimientos', { actual: props.form[props.name] });
  return <SelectBuscable {...props} icon={Hospital} options={opciones} />;
}

function SelectorDeSustento(props) {
  const { opciones } = useOpciones('/documentos-sustento', { params: {}, sinOpcion: 'Sin documento adjunto', etiqueta: (d) => d.nombre });
  return <SelectorDeDocumento {...props} icon={FileText} options={opciones} />;
}

/** Campos de un registro del RIT: cada uno con su control segun `tipo` (ver registrosRit.js). */
export default function CamposDeRegistro({ campos, form, setForm, errors }) {
  return campos.map((c) => {
    const props = { form, setForm, errors, name: c.name, label: c.label, required: c.requerido };
    switch (c.tipo) {
      case 'vinculo':
        return <SelectorDeVinculo key={c.name} {...props} />;
      case 'trabajador':
        return <SelectorDeTrabajador key={c.name} {...props} />;
      case 'eess':
        return <SelectorDeEess key={c.name} {...props} />;
      case 'opciones':
        return <Select key={c.name} {...props} icon={ListChecks} options={c.opciones} />;
      case 'documento':
        return <SelectorDeSustento key={c.name} {...props} />;
      case 'si-no':
        return <Checkbox key={c.name} form={form} setForm={setForm} errors={errors} name={c.name} label={c.label} />;
      case 'fecha':
        return <Field key={c.name} {...props} icon={CalendarDays} type="date" />;
      case 'numero':
        return <Field key={c.name} {...props} icon={Hash} type="number" />;
      default:
        return <Field key={c.name} {...props} icon={Type} />;
    }
  });
}
