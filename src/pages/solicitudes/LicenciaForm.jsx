import { CalendarDays, FileText, Hash, ListChecks, UserCog, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

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
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioRegistroId, sinOpcion: 'Sin registrar', etiqueta: (usuario) => usuario.nombre });

  const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoLicenciaId));

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <Select form={form} setForm={setForm} errors={errors} name="TipoLicenciaId" label="Tipo de licencia" icon={ListChecks} options={tipos.opciones} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="LicenciaFechaInicio" label="Desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="LicenciaFechaFin" label="Hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="LicenciaNumeroResolucion" label="N.º de resolución" icon={Hash} maxLength={60} />
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento de sustento" icon={FileText} options={documentos} />
        <Select form={form} setForm={setForm} errors={errors} name="UsuarioRegistroId" label="Registrada por" icon={UserCog} options={usuarios} />
      </FormGrid>
      <Textarea form={form} setForm={setForm} errors={errors} name="LicenciaMotivo" label="Motivo" icon={FileText} maxLength={1000} />
      <HelpText>
        Los días se cuentan corridos, con sábados, domingos y feriados (RIT, Art. 55)
        {tipo?.maximo_dias ? `; esta licencia admite hasta ${tipo.maximo_dias} días` : ''}. Si la licencia es de 30 días o más, el servidor entrega cargo
        antes de usarla (Art. 56).
      </HelpText>
    </>
  );
}
