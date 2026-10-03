import { CalendarClock, FileText, Hospital, ListChecks, UserCog, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ESTADOS_SUPERVISION } from '../../utils/opciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function SupervisionInopinadaForm({ form, setForm, errors, editando }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const vinculos = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioId, etiqueta: (usuario) => usuario.nombre });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin acta adjunta',
    etiqueta: (documento) => documento.nombre,
  });

  // Solo el personal del establecimiento supervisado.
  const opcionesPersona = [
    { value: '', label: 'Supervisión general (sin persona)' },
    ...vinculos.filas
      .filter((v) => String(v.eess_id) === String(form.EessId))
      .map((v) => ({ value: v.id, label: vinculos.opciones.find((o) => String(o.value) === String(v.id))?.label ?? v.id })),
  ];

  return (
    <>
      <Select
        form={form}
        setForm={(actualizar) =>
          setForm((f) => {
            const siguiente = typeof actualizar === 'function' ? actualizar(f) : actualizar;
            // Al cambiar de establecimiento, la persona anterior ya no corresponde.
            return siguiente.EessId === f.EessId ? siguiente : { ...siguiente, VinculoLaboralId: '' };
          })
        }
        errors={errors}
        name="EessId"
        label="Establecimiento supervisado"
        icon={Hospital}
        options={establecimientos}
        required
      />
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Persona supervisada" icon={UserRound} options={opcionesPersona} />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="SupervisionInopinadaFechaHora" label="Fecha y hora" icon={CalendarClock} type="datetime-local" required />
        <Select form={form} setForm={setForm} errors={errors} name="UsuarioId" label="Supervisor" icon={UserCog} options={usuarios} required />
      </FormGrid>
      <Textarea form={form} setForm={setForm} errors={errors} name="SupervisionInopinadaResultado" label="Resultado" icon={FileText} maxLength={500} />
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="SupervisionInopinadaEstado" label="Estado" icon={ListChecks} options={ESTADOS_SUPERVISION.filter((e) => e.value !== 'ANULADO')} required />
      )}
      <Textarea
        form={form}
        setForm={setForm}
        errors={errors}
        name="SupervisionInopinadaObservacion"
        label="Observaciones del acta"
        icon={FileText}
        maxLength={1000}
        required={form.SupervisionInopinadaEstado === 'OBSERVADO'}
      />
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Acta de supervisión" icon={FileText} options={documentos} />
      <HelpText>
        Las supervisiones inopinadas verifican la asistencia y permanencia del personal (RIT, Art. 24 y 29). Si hay observaciones, el jefe
        del establecimiento envía su informe detallado en un plazo de 3 días.
      </HelpText>
    </>
  );
}
