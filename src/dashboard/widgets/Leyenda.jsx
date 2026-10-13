import { tonoDe } from '../tonos';

// Leyenda de series: cuadro de color + nombre.
export default function Leyenda({ series }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
      {series.map((serie) => (
        <li key={serie.nombre} className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className={`h-2.5 w-2.5 rounded-sm ${tonoDe(serie.tono).bg}`} />
          {serie.nombre}
        </li>
      ))}
    </ul>
  );
}
