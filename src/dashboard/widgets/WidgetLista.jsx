import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TarjetaDeWidget, { SinDatos } from './TarjetaDeWidget';

// Tabla corta (las primeras filas) con la cantidad total y un enlace a la pantalla completa.
export default function WidgetLista({ titulo, columnas, filas, vacio, enlace, total }) {
  const insignia = total > 0 ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{total}</span> : null;

  return (
    <TarjetaDeWidget titulo={titulo} derecha={insignia}>
      {filas.length === 0 ? (
        <SinDatos mensaje={vacio} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {columnas.map((columna) => (
                  <th key={columna} className="whitespace-nowrap px-2 pb-1.5 font-semibold">
                    {columna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filas.map((fila, i) => (
                <tr key={i}>
                  {fila.map((celda, j) => (
                    <td key={j} className={`px-2 py-1.5 ${j === 0 ? 'max-w-48 truncate font-medium text-heading' : 'text-slate-600'}`} title={String(celda)}>
                      {celda}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {enlace && filas.length > 0 && (
        <Link to={enlace} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-dark transition-colors hover:text-brand">
          Ver {total > filas.length ? `los ${total}` : 'todo'} <ArrowRight size={13} />
        </Link>
      )}
    </TarjetaDeWidget>
  );
}
