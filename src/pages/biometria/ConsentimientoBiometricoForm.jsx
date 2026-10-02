import { FileText, Hash, ShieldQuestion, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import { DECISIONES_CONSENTIMIENTO } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function ConsentimientoBiometricoForm({ form, setForm, errors }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { etiqueta: etiquetaTrabajador });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin formato firmado adjunto',
    etiqueta: (documento) => documento.nombre,
  });

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
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="ConsentimientoBiometricoAceptado"
        label="Decisión del trabajador"
        icon={ShieldQuestion}
        options={DECISIONES_CONSENTIMIENTO}
        required
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConsentimientoBiometricoVersion"
          label="Versión del formato"
          icon={Hash}
          maxLength={30}
          placeholder="Ej. v1.0"
        />
        <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Formato firmado" icon={FileText} options={documentos} />
      </FormGrid>
      <HelpText>
        Cada decisión queda en el historial y no se edita ni se elimina: el último evento es el consentimiento vigente. Al revocarlo se
        desactivan las plantillas biométricas del trabajador.
      </HelpText>
    </>
  );
}
