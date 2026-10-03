import { CalendarDays, FileText, Hash, Hospital, ListChecks, UserCog } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ESTADOS_CARGA_PROGRAMACION, MESES } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function CargaProgramacionForm({ form, setForm, errors, editando }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const tipos = useOpciones('/tipos-periodo-programacion', { actual: form.TipoPeriodoProgramacionId, sinOpcion: 'Sin especificar' });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    etiqueta: (documento) => documento.nombre,
  });
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioRegistroId, etiqueta: (usuario) => usuario.nombre });
  const programaciones = useOpciones('/programaciones-periodo', {
    params: {},
    actual: form.ProgramacionPeriodoId,
    sinOpcion: 'Sin enlazar',
    etiqueta: (p) => `${p.eess?.nombre ?? ''} · ${p.codigo ?? `${p.mes ?? ''}/${p.anio}`} (${p.estado})`,
  });

  const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoPeriodoProgramacionId))?.codigo;
  // Solo las programaciones del mismo establecimiento, mes y año (la API exige esa coherencia).
  const opcionesProgramacion = [
    { value: '', label: 'Sin enlazar' },
    ...programaciones.filas
      .filter((p) => String(p.eess_id) === String(form.EessId) && p.estado !== 'ANULADA' && String(p.anio) === String(form.CargaProgramacionAnio) && (p.mes === null || String(p.mes) === String(form.CargaProgramacionMes)))
      .map((p) => ({ value: p.id, label: programaciones.opciones.find((o) => String(o.value) === String(p.id))?.label ?? p.id })),
  ];

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="EessId" label="Establecimiento que remite" icon={Hospital} options={establecimientos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="CargaProgramacionAnio" label="Año" icon={CalendarDays} maxLength={4} filter="digitos" required />
        <Select form={form} setForm={setForm} errors={errors} name="CargaProgramacionMes" label="Mes" icon={CalendarDays} options={MESES} required />
      </FormGrid>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="TipoPeriodoProgramacionId" label="Tipo de período" icon={ListChecks} options={tipos.opciones} />
        {tipo === 'QUINCENAL' && (
          <Select
            form={form}
            setForm={setForm}
            errors={errors}
            name="CargaProgramacionNumero"
            label="Quincena"
            icon={Hash}
            options={[{ value: '1', label: '1' }, { value: '2', label: '2' }]}
            required
          />
        )}
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento escaneado" icon={FileText} options={documentos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="CargaProgramacionFechaDocumento" label="Fecha del documento" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="CargaProgramacionDocumentoNumero" label="N.º de oficio o memorando" icon={Hash} maxLength={60} />
      </FormGrid>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="UsuarioRegistroId" label="Cargado por" icon={UserCog} options={usuarios} required />
        <Field form={form} setForm={setForm} errors={errors} name="CargaProgramacionCodigo" label="Código (automático)" icon={Hash} maxLength={50} filter="codigo" placeholder="PROG-AAAA-MM-NNN" />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoId" label="Programación estructurada (opcional)" icon={CalendarDays} options={opcionesProgramacion} />
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="CargaProgramacionEstado" label="Estado" icon={ListChecks} options={ESTADOS_CARGA_PROGRAMACION} required />
      )}
      <Field form={form} setForm={setForm} errors={errors} name="CargaProgramacionMotivo" label="Motivo" icon={FileText} maxLength={500} />
      <Textarea form={form} setForm={setForm} errors={errors} name="CargaProgramacionObservacion" label="Observación" icon={FileText} maxLength={1000} required={form.CargaProgramacionEstado === 'OBSERVADO'} />
      <HelpText>
        Deja constancia de que el establecimiento remitió su programación oficial (hasta el día 05, 10, 15 o 20 de cada mes según el destino,
        RIT Art. 16). No representa turnos individuales: el archivo escaneado se registra en Documentos de sustento.
      </HelpText>
    </>
  );
}
