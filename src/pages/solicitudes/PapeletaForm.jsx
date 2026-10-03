import { CalendarDays, Clock, FileText, Hash, ListChecks, Tag, UserCog, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function PapeletaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: tipos } = useOpciones('/tipos-papeleta', { actual: form.TipoPapeletaId });
  const motivos = useOpciones('/motivos-papeleta', { actual: form.MotivoPapeletaId });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioRegistroId, sinOpcion: 'Sin registrar', etiqueta: (usuario) => usuario.nombre });

  // Solo los motivos del tipo elegido (la base exige que el motivo pertenezca al tipo).
  const opcionesMotivo = [
    { value: '', label: 'Sin motivo específico' },
    ...motivos.filas.filter((m) => String(m.tipo_papeleta_id) === String(form.TipoPapeletaId)).map((m) => ({ value: m.id, label: m.nombre })),
  ];
  const diaCompleto = Boolean(form.PapeletaEsDiaCompleto);

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <FormGrid>
        <Select
          form={form}
          setForm={(actualizar) =>
            setForm((f) => {
              const siguiente = typeof actualizar === 'function' ? actualizar(f) : actualizar;
              // Al cambiar de tipo, el motivo anterior ya no corresponde.
              return siguiente.TipoPapeletaId === f.TipoPapeletaId ? siguiente : { ...siguiente, MotivoPapeletaId: '' };
            })
          }
          errors={errors}
          name="TipoPapeletaId"
          label="Tipo de papeleta"
          icon={ListChecks}
          options={tipos}
          required
        />
        <Select form={form} setForm={setForm} errors={errors} name="MotivoPapeletaId" label="Motivo" icon={Tag} options={opcionesMotivo} />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="PapeletaFecha" label="Fecha" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="PapeletaNumero" label="N.º de papeleta" icon={Hash} maxLength={50} placeholder="Ej. PS-0129" />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="PapeletaEsDiaCompleto" label="Permiso de día completo" />
      {!diaCompleto && (
        <FormGrid>
          <Field form={form} setForm={setForm} errors={errors} name="PapeletaHoraSalida" label="Hora de salida" icon={Clock} type="time" required />
          <Field form={form} setForm={setForm} errors={errors} name="PapeletaHoraRetorno" label="Hora de retorno" icon={Clock} type="time" />
        </FormGrid>
      )}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PapeletaMinutosUtilizados"
        label="Minutos realmente utilizados"
        icon={Clock}
        maxLength={4}
        filter="digitos"
        placeholder="Automático (retorno − salida)"
      />
      <Textarea form={form} setForm={setForm} errors={errors} name="PapeletaMotivo" label="Detalle del motivo" icon={FileText} maxLength={1000} />
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento de sustento" icon={FileText} options={documentos} />
        <Select form={form} setForm={setForm} errors={errors} name="UsuarioRegistroId" label="Registrada por" icon={UserCog} options={usuarios} />
      </FormGrid>
      <HelpText>
        La papeleta nace pendiente y la autoriza el jefe desde el listado. La papeleta de comisión de servicios vale como máximo 3 horas
        (RIT, Art. 14). Los tipos que exigen sustento no se aprueban sin el documento.
      </HelpText>
    </>
  );
}
