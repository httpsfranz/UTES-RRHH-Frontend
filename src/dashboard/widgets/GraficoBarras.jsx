import { useState } from 'react';
import { tonoDe } from '../tonos';
import { topeDelEje } from './escala';
import Leyenda from './Leyenda';
import TarjetaDeWidget, { SinDatos } from './TarjetaDeWidget';

const ANCHO = 640;
const ALTO = 230;
const MARGEN = { izq: 34, der: 8, arriba: 10, abajo: 24 };

// Barras horizontales en HTML: una fila por categoria. Con una sola serie la barra mide su valor respecto al maximo; con
// varias y `normalizado`, cada fila reparte el 100 % entre las series (sirve para comparar establecimientos de distinto tamano).
function Horizontales({ categorias, series, apiladas, normalizado }) {
  const totales = categorias.map((_, i) => series.reduce((s, serie) => s + serie.valores[i], 0));
  const maximo = Math.max(1, ...(apiladas ? totales : series.flatMap((s) => s.valores)));

  return (
    <ul className="space-y-2">
      {categorias.map((categoria, i) => (
        <li key={categoria} className="flex items-center gap-3 text-xs">
          <span className="w-32 shrink-0 truncate text-slate-700 sm:w-40" title={categoria}>
            {categoria}
          </span>
          <div className="flex h-3.5 flex-1 overflow-hidden rounded-full bg-line-soft" title={series.map((s) => `${s.nombre}: ${s.valores[i]}`).join(' · ')}>
            {series.map((serie) => {
              const base = apiladas && normalizado ? Math.max(totales[i], 1) : maximo;
              return <span key={serie.nombre} className={`h-full transition-all ${tonoDe(serie.tono).bg}`} style={{ width: `${(serie.valores[i] / base) * 100}%` }} />;
            })}
          </div>
          <span className="w-10 text-right font-semibold text-heading">{apiladas ? totales[i] : series[0].valores[i]}</span>
        </li>
      ))}
    </ul>
  );
}

// Barras verticales en SVG (agrupadas o apiladas) con tooltip al pasar el cursor.
function Verticales({ categorias, series, apiladas }) {
  const [indice, setIndice] = useState(null);
  const n = categorias.length;
  const totales = categorias.map((_, i) => series.reduce((s, serie) => s + serie.valores[i], 0));
  const tope = topeDelEje(Math.max(...(apiladas ? totales : series.flatMap((s) => s.valores))));
  const util = ANCHO - MARGEN.izq - MARGEN.der;
  const alturaUtil = ALTO - MARGEN.arriba - MARGEN.abajo;
  const paso = util / n;
  const grosor = Math.min(26, (paso * (apiladas ? 0.7 : 0.8)) / (apiladas ? 1 : series.length));
  const y = (valor) => MARGEN.arriba + (1 - valor / tope) * alturaUtil;
  const saltoX = Math.ceil(n / 14);

  return (
    <div className="relative" onMouseLeave={() => setIndice(null)}>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="h-auto w-full" role="img">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={MARGEN.izq} x2={ANCHO - MARGEN.der} y1={y(tope * f)} y2={y(tope * f)} className="stroke-line" strokeDasharray={f === 0 ? undefined : '3 4'} />
            <text x={MARGEN.izq - 6} y={y(tope * f) + 3} textAnchor="end" className="fill-slate-400 text-[10px]">
              {Math.round(tope * f)}
            </text>
          </g>
        ))}
        {categorias.map((categoria, i) => {
          const centro = MARGEN.izq + paso * i + paso / 2;
          let acumulado = 0;
          return (
            <g key={categoria + i} onMouseEnter={() => setIndice(i)} className={indice !== null && indice !== i ? 'opacity-50' : ''}>
              <rect x={MARGEN.izq + paso * i} y={MARGEN.arriba} width={paso} height={alturaUtil} fill="transparent" />
              {series.map((serie, k) => {
                const valor = serie.valores[i];
                const base = apiladas ? acumulado : 0;
                acumulado += valor;
                const xBarra = apiladas ? centro - grosor / 2 : centro - (series.length * grosor) / 2 + k * grosor;
                return <rect key={serie.nombre} x={xBarra} y={y(base + valor)} width={Math.max(grosor - 1, 1)} height={Math.max(y(base) - y(base + valor), 0)} rx="2" className={tonoDe(serie.tono).fill} />;
              })}
              {i % saltoX === 0 && (
                <text x={centro} y={ALTO - 6} textAnchor="middle" className="fill-slate-400 text-[10px]">
                  {categoria}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {indice !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 min-w-32 rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-[var(--shadow-pop)]"
          style={{ left: `${((MARGEN.izq + paso * indice + paso / 2) / ANCHO) * 100}%`, transform: indice > n / 2 ? 'translateX(-105%)' : 'translateX(8%)' }}
        >
          <p className="mb-1 font-semibold text-heading">{categorias[indice]}</p>
          {series.map((serie) => (
            <p key={serie.nombre} className="flex items-center justify-between gap-4 text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${tonoDe(serie.tono).bg}`} />
                {serie.nombre}
              </span>
              <b className="text-heading">{serie.valores[indice]}</b>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GraficoBarras({ titulo, subtitulo, categorias, series, horizontal = false, apiladas = false, normalizado = false }) {
  const hayDatos = categorias.length > 0 && series.some((s) => s.valores.some((v) => v > 0));

  return (
    <TarjetaDeWidget titulo={titulo} subtitulo={subtitulo}>
      {!hayDatos ? (
        <SinDatos />
      ) : (
        <>
          {horizontal ? <Horizontales categorias={categorias} series={series} apiladas={apiladas} normalizado={normalizado} /> : <Verticales categorias={categorias} series={series} apiladas={apiladas} />}
          {(series.length > 1 || apiladas) && <Leyenda series={series} />}
        </>
      )}
    </TarjetaDeWidget>
  );
}
