import { useState } from 'react';
import { TONOS_ASISTENCIA } from './tonosAsistencia';

// Leyenda compacta del calendario de asistencia: una ficha de color por abreviatura y turno. Al pulsar una ficha se
// muestra solo su significado ("TAR = Tardanza"); al pulsarla otra vez, o pulsar otra, cambia o se oculta. Sale de la
// misma respuesta del backend que el calendario y el PDF (calendario.leyenda).
export default function LeyendaAsistencia({ leyenda }) {
  const [activa, setActiva] = useState(null);

  const fichas = [
    ...leyenda.estados.map((estado) => ({
      clave: `estado-${estado.codigo}`,
      texto: estado.abreviatura,
      estilo: `${TONOS_ASISTENCIA[estado.categoria]?.celda ?? ''} border-line`,
      explicacion: `${estado.abreviatura} = ${estado.nombre}`,
    })),
    ...leyenda.turnos.map((turno) => ({
      clave: `turno-${turno.codigo}`,
      texto: turno.codigo,
      estilo: 'bg-surface text-muted border-dashed border-slate-300',
      explicacion: `${turno.codigo} = ${turno.nombre} (${turno.entrada}–${turno.salida}).${leyenda.turnos_sin_color === false ? '' : ' Sin color: turno programado que aún no tiene registro de asistencia.'}`,
    })),
  ];
  const elegida = fichas.find((ficha) => ficha.clave === activa);

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Leyenda: pulsa una abreviatura para ver su significado">
        {fichas.map((ficha) => (
          <button
            key={ficha.clave}
            type="button"
            onClick={() => setActiva((actual) => (actual === ficha.clave ? null : ficha.clave))}
            aria-pressed={activa === ficha.clave}
            title={ficha.explicacion}
            className={`min-w-8 rounded-md border px-1.5 py-0.5 text-[11px] font-bold leading-4 transition-shadow hover:shadow-sm ${ficha.estilo} ${
              activa === ficha.clave ? 'ring-2 ring-brand ring-offset-1' : ''
            }`}
          >
            {ficha.texto}
          </button>
        ))}
      </div>
      <p className="min-w-0 text-xs text-muted" aria-live="polite">
        {elegida ? <strong className="font-semibold text-heading">{elegida.explicacion}</strong> : 'Pulsa una abreviatura para ver su significado.'}
      </p>
    </div>
  );
}
