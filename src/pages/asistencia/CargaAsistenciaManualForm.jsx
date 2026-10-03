import { FileSpreadsheet, FileText, Hash, Hospital, ListChecks, UserCog } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ESTADOS_CARGA } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function CargaAsistenciaManualForm({ form, setForm, errors, editando }) {
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioId, etiqueta: (usuario) => usuario.nombre });
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId, sinOpcion: 'Toda la Red' });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  return (
    <>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="UsuarioId" label="Cargado por" icon={UserCog} options={usuarios} required />
        <Select form={form} setForm={setForm} errors={errors} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="CargaAsistenciaManualNombreArchivo" label="Nombre del archivo" icon={FileSpreadsheet} maxLength={255} placeholder="Ej. parte-diario-0930.xlsx" />
        <Field form={form} setForm={setForm} errors={errors} name="CargaAsistenciaManualRegistros" label="Registros cargados" icon={Hash} maxLength={7} filter="digitos" />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Parte diario escaneado" icon={FileText} options={documentos} />
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="CargaAsistenciaManualEstado" label="Estado" icon={ListChecks} options={ESTADOS_CARGA} required />
      )}
      <Textarea form={form} setForm={setForm} errors={errors} name="CargaAsistenciaManualObservacion" label="Observación" icon={FileText} maxLength={1000} />
      <HelpText>
        El parte diario es el registro de asistencia de los establecimientos sin reloj biométrico (RIT, Art. 21). Una carga se marca
        procesada indicando cuántos registros se cargaron; si está observada, explica por qué. Al anularla se invalidan sus marcaciones.
      </HelpText>
    </>
  );
}
