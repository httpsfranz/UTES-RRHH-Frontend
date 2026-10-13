import { useState } from 'react';
import { tonoDe } from '../tonos';
import TarjetaDeWidget, { SinDatos } from './TarjetaDeWidget';

const RADIO = 38;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

// Dona con el total al centro y leyenda con cantidades y porcentajes. Al pasar el cursor por un segmento (o su fila de la
// leyenda) se resalta y el centro muestra su valor.
export default function GraficoDona({ titulo, subtitulo, segmentos }) {
  const [activo, setActivo] = useState(null);
  const total = segmentos.reduce((suma, s) => suma + s.valor, 0);

  // Cada arco empieza donde termina el anterior.
  const arcos = segmentos.map((segmento, indice) => {
    const largo = total === 0 ? 0 : (segmento.valor / total) * CIRCUNFERENCIA;
    const previos = segmentos.slice(0, indice).reduce((suma, s) => suma + s.valor, 0);
    return { ...segmento, indice, largo, inicio: total === 0 ? 0 : (previos / total) * CIRCUNFERENCIA };
  });
  const elegido = activo === null ? null : segmentos[activo];

  return (
    <TarjetaDeWidget titulo={titulo} subtitulo={subtitulo}>
      {total === 0 ? (
        <SinDatos />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-40 w-40 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={titulo}>
              <circle cx="50" cy="50" r={RADIO} fill="none" strokeWidth="14" className="stroke-line-soft" />
              {arcos.map((arco) => (
                <circle
                  key={arco.etiqueta}
                  cx="50"
                  cy="50"
                  r={RADIO}
                  fill="none"
                  strokeWidth={activo === arco.indice ? 17 : 14}
                  strokeDasharray={`${Math.max(arco.largo - (arcos.length > 1 ? 0.8 : 0), 0)} ${CIRCUNFERENCIA}`}
                  strokeDashoffset={-arco.inicio}
                  className={`${tonoDe(arco.tono).stroke} cursor-pointer transition-all duration-200 ${activo !== null && activo !== arco.indice ? 'opacity-40' : ''}`}
                  onMouseEnter={() => setActivo(arco.indice)}
                  onMouseLeave={() => setActivo(null)}
                />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold leading-none text-heading">{(elegido?.valor ?? total).toLocaleString('es-PE')}</span>
              <span className="mt-1 max-w-24 truncate text-[11px] text-muted">{elegido?.etiqueta ?? 'Total'}</span>
            </div>
          </div>
          <ul className="w-full min-w-0 flex-1 space-y-1.5">
            {segmentos.map((segmento, indice) => (
              <li
                key={segmento.etiqueta}
                onMouseEnter={() => setActivo(indice)}
                onMouseLeave={() => setActivo(null)}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors ${activo === indice ? 'bg-page' : ''}`}
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tonoDe(segmento.tono).bg}`} />
                <span className="min-w-0 flex-1 truncate text-slate-700">{segmento.etiqueta}</span>
                <span className="font-semibold text-heading">{segmento.valor.toLocaleString('es-PE')}</span>
                <span className="w-10 text-right text-muted">{((segmento.valor / total) * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </TarjetaDeWidget>
  );
}
