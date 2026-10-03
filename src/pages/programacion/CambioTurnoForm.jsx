import { ArrowLeftRight, CalendarClock, Clock, FileText, ListChecks, UserCog, UserRound, UsersRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ahoraLocal, etiquetaVinculo, formatoFecha } from '../../utils/formato';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import HelpText from '../../components/ui/HelpText';

const etiquetaTurno = (item) =>
  `${formatoFecha(item.fecha)} · ${item.turno?.codigo ?? ''} ${item.hora_entrada ?? item.turno?.hora_entrada ?? ''}–${item.hora_salida ?? item.turno?.hora_salida ?? ''} · ${item.trabajador?.nombre_completo ?? ''}`;

const cambiable = (item) => ['PROGRAMADO', 'REPROGRAMADO'].includes(item.estado);

export default function CambioTurnoForm({ form, setForm, errors }) {
  const tipos = useOpciones('/tipos-cambio-turno', { actual: form.TipoCambioTurnoId });
  // Solo se cambian turnos de una programacion publicada y que aun no empezaron (con 48 horas de anticipacion, RIT Art. 20).
  const turnos = useOpciones('/turnos-programados', {
    params: { periodo_estado: 'PUBLICADA', desde: ahoraLocal().slice(0, 10) },
    actual: form.TurnoProgramadoId,
    etiqueta: etiquetaTurno,
  });
  const vinculos = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralReemplazanteId, etiqueta: etiquetaVinculo });
  const catalogo = useOpciones('/turnos', { actual: form.TurnoIdNuevo, etiqueta: (turno) => `${turno.nombre} (${turno.hora_entrada} – ${turno.hora_salida})` });
  const documentos = useOpciones('/documentos-sustento', { params: {}, sinOpcion: 'Sin documento adjunto', etiqueta: (documento) => documento.nombre });
  const usuarios = useOpciones('/usuarios', { actual: form.UsuarioRegistroId, etiqueta: (usuario) => usuario.nombre });

  const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoCambioTurnoId));
  const codigo = tipo?.codigo;
  const turno = turnos.filas.find((fila) => String(fila.id) === String(form.TurnoProgramadoId));
  const llevaReemplazante = Boolean(tipo?.requiere_reemplazante);
  const sinReemplazante = Boolean(tipo) && !llevaReemplazante;

  const opcionesTurno = turnos.filas.filter((fila) => cambiable(fila) || String(fila.id) === String(form.TurnoProgramadoId)).map((fila) => ({ value: fila.id, label: etiquetaTurno(fila) }));

  const solicitantes = vinculos.opciones.filter((opcion) => String(opcion.value) === String(form.VinculoLaboralSolicitanteId));

  // Quien reemplaza: otra persona del establecimiento de la programacion.
  const reemplazantes = vinculos.filas
    .filter((vinculo) => turno && vinculo.eess_id === turno.vinculo?.eess_id && vinculo.trabajador_id !== turno.trabajador?.id)
    .map((vinculo) => ({ value: vinculo.id, label: etiquetaVinculo(vinculo) }));

  // En la permuta se recibe a cambio un turno del otro trabajador, de la misma programacion.
  const deLaContraparte = turnos.filas
    .filter(
      (fila) =>
        cambiable(fila) &&
        String(fila.vinculo?.id) === String(form.VinculoLaboralReemplazanteId) &&
        fila.programacion_trabajador?.programacion_periodo_id === turno?.programacion_trabajador?.programacion_periodo_id,
    )
    .map((fila) => ({ value: fila.id, label: etiquetaTurno(fila) }));

  // El tipo y el turno elegidos mandan sobre el resto: el solicitante es a quien se programo el turno y lo que el tipo no
  // lleva (reemplazante, turno de la contraparte, turno nuevo) se limpia, porque el backend lo rechaza.
  const elegir = (actualizar) =>
    setForm((anterior) => {
      const nuevo = typeof actualizar === 'function' ? actualizar(anterior) : actualizar;
      const tipoElegido = tipos.filas.find((fila) => String(fila.id) === String(nuevo.TipoCambioTurnoId));
      const cambioElTurno = nuevo.TurnoProgramadoId !== anterior.TurnoProgramadoId;
      const cambioElReemplazante = nuevo.VinculoLaboralReemplazanteId !== anterior.VinculoLaboralReemplazanteId;
      return {
        ...nuevo,
        VinculoLaboralSolicitanteId: cambioElTurno
          ? (turnos.filas.find((fila) => String(fila.id) === String(nuevo.TurnoProgramadoId))?.vinculo?.id ?? '')
          : nuevo.VinculoLaboralSolicitanteId,
        VinculoLaboralReemplazanteId: tipoElegido?.requiere_reemplazante && !cambioElTurno ? nuevo.VinculoLaboralReemplazanteId : '',
        TurnoProgramadoContraparteId: tipoElegido?.codigo === 'PERMUTA' && !cambioElTurno && !cambioElReemplazante ? nuevo.TurnoProgramadoContraparteId : '',
        TurnoIdNuevo: tipoElegido?.codigo === 'REPROGRAMACION' ? nuevo.TurnoIdNuevo : '',
      };
    });

  return (
    <>
      <Select form={form} setForm={elegir} errors={errors} name="TipoCambioTurnoId" label="Tipo de cambio" icon={ListChecks} options={tipos.opciones} required />
      <SelectBuscable form={form} setForm={elegir} errors={errors} name="TurnoProgramadoId" label="Turno que se cambia" icon={Clock} options={opcionesTurno} required />
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="VinculoLaboralSolicitanteId"
        label="Solicitante (a quien se programó el turno)"
        icon={UserRound}
        options={solicitantes}
        disabled
        placeholder="Se completa al elegir el turno"
      />
      {turno?.es_guardia && <HelpText>Es una guardia: cuenta como dos cambios de turno del mes (RIT, Art. 20).</HelpText>}
      {llevaReemplazante && (
        <SelectBuscable
          form={form}
          setForm={elegir}
          errors={errors}
          name="VinculoLaboralReemplazanteId"
          label={codigo === 'PERMUTA' ? 'Permuta con' : 'Reemplazante'}
          icon={UsersRound}
          options={reemplazantes}
          required
        />
      )}
      {codigo === 'PERMUTA' && (
        <SelectBuscable form={form} setForm={elegir} errors={errors} name="TurnoProgramadoContraparteId" label="Turno que recibe a cambio" icon={ArrowLeftRight} options={deLaContraparte} required />
      )}
      {codigo === 'REPROGRAMACION' && (
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoIdNuevo"
          label="Turno nuevo"
          icon={CalendarClock}
          options={catalogo.opciones.filter((opcion) => String(opcion.value) !== String(turno?.turno?.id))}
          required
        />
      )}
      <Textarea form={form} setForm={setForm} errors={errors} name="CambioTurnoMotivo" label="Motivo" icon={FileText} maxLength={1000} required={sinReemplazante} />
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento que sustenta o autoriza" icon={FileText} options={documentos.opciones} required={sinReemplazante} />
      <Select form={form} setForm={setForm} errors={errors} name="UsuarioRegistroId" label="Quién registra" icon={UserCog} options={usuarios.opciones} required />
      <Textarea form={form} setForm={setForm} errors={errors} name="CambioTurnoObservacion" label="Observación" icon={FileText} maxLength={1000} />
      <HelpText>
        RIT, Art. 16 y 20: es la única forma de modificar una programación ya publicada. Se pide con 48 horas de anticipación (con menos,
        solo de manera excepcional y con el documento que lo sustenta); cada servidor acepta hasta 4 cambios al mes y una guardia cuenta como
        dos; el cambio se materializa con un reemplazante, y sin él solo procede justificado y con la autorización escrita del jefe. Una
        guardia solo se cambia entre servidores del mismo cargo y régimen (D.L. 276 o SERUMS).
      </HelpText>
    </>
  );
}
