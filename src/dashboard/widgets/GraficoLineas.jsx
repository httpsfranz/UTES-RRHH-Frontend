import { useRef, useState } from 'react';
import { tonoDe } from '../tonos';
import { topeDelEje } from './escala';
import Leyenda from './Leyenda';
import SelectorDeAgrupacion from './SelectorDeAgrupacion';
import TarjetaDeWidget, { SinDatos } from './TarjetaDeWidget';

const ANCHO = 640;
const ALTO = 230;
const MARGEN = { izq: 34, der: 12, arriba: 12, abajo: 24 };

// Lineas con area suave: una serie por indicador, ejes con marcas y una guia con el valor de cada serie al pasar el cursor.
export default function GraficoLineas({ titulo, subtitulo, categorias, titulos, series, agrupaciones, agrupacion, alAgrupar }) {
  const contenedor = useRef(null);
  const [indice, setIndice] = useState(null);
  const n = categorias.length;
  const maximo = Math.max(0, ...series.flatMap((s) => s.valores));

  if (n === 0 || maximo === 0) {
    return (
      <TarjetaDeWidget titulo={titulo} subtitulo={subtitulo} derecha={<SelectorDeAgrupacion opciones={agrupaciones} actual={agrupacion} alElegir={alAgrupar} />}>
        <SinDatos />
      </TarjetaDeWidget>
    );
  }

  const tope = topeDelEje(maximo);
  const x = (i) => MARGEN.izq + (n === 1 ? (ANCHO - MARGEN.izq - MARGEN.der) / 2 : (i * (ANCHO - MARGEN.izq - MARGEN.der)) / (n - 1));
  const y = (valor) => MARGEN.arriba + (1 - valor / tope) * (ALTO - MARGEN.arriba - MARGEN.abajo);
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(tope * f));
  const saltoX = Math.ceil(n / 12);

  const trazo = (valores) => valores.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = (valores) => `${trazo(valores)} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  function mover(evento) {
    const caja = contenedor.current.getBoundingClientRect();
    const relativo = ((evento.clientX - caja.left) / caja.width) * ANCHO;
    const i = Math.round(((relativo - MARGEN.izq) / (ANCHO - MARGEN.izq - MARGEN.der)) * (n - 1));
    setIndice(Math.max(0, Math.min(n - 1, i)));
  }

  return (
    <TarjetaDeWidget titulo={titulo} subtitulo={subtitulo} derecha={<SelectorDeAgrupacion opciones={agrupaciones} actual={agrupacion} alElegir={alAgrupar} />}>
      <div ref={contenedor} className="relative" onMouseMove={mover} onMouseLeave={() => setIndice(null)}>
        <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="h-auto w-full" role="img" aria-label={titulo}>
          {marcas.map((marca) => (
            <g key={marca}>
              <line x1={MARGEN.izq} x2={ANCHO - MARGEN.der} y1={y(marca)} y2={y(marca)} className="stroke-line" strokeDasharray={marca === 0 ? undefined : '3 4'} />
              <text x={MARGEN.izq - 6} y={y(marca) + 3} textAnchor="end" className="fill-slate-400 text-[10px]">
                {marca}
              </text>
            </g>
          ))}
          {categorias.map((categoria, i) =>
            i % saltoX === 0 ? (
              <text key={categoria + i} x={x(i)} y={ALTO - 6} textAnchor="middle" className="fill-slate-400 text-[10px]">
                {categoria}
              </text>
            ) : null,
          )}
          {series.map((serie) => (
            <g key={serie.nombre}>
              <path d={area(serie.valores)} className={`${tonoDe(serie.tono).fill} opacity-10`} />
              <path d={trazo(serie.valores)} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className={tonoDe(serie.tono).stroke} />
            </g>
          ))}
          {indice !== null && (
            <g>
              <line x1={x(indice)} x2={x(indice)} y1={MARGEN.arriba} y2={ALTO - MARGEN.abajo} className="stroke-slate-300" />
              {series.map((serie) => (
                <circle key={serie.nombre} cx={x(indice)} cy={y(serie.valores[indice])} r="4" strokeWidth="2" className={`${tonoDe(serie.tono).fill} stroke-white`} />
              ))}
            </g>
          )}
        </svg>
        {indice !== null && (
          <div
            className="pointer-events-none absolute top-1 z-10 min-w-36 rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-[var(--shadow-pop)]"
            style={{ left: `${(x(indice) / ANCHO) * 100}%`, transform: indice > n / 2 ? 'translateX(-105%)' : 'translateX(8%)' }}
          >
            <p className="mb-1 font-semibold text-heading">{titulos?.[indice] ?? categorias[indice]}</p>
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
      <Leyenda series={series} />
    </TarjetaDeWidget>
  );
}
