import { Check } from 'lucide-react';

// Cabecera de un asistente: los pasos numerados, con los ya hechos marcados y el actual resaltado.
//   pasos   ['Datos personales', 'Vínculo laboral', ...]
//   actual  indice del paso en curso (pasos.length = todo listo)
export default function IndicadorDePasos({ pasos, actual }) {
  return (
    <ol className="mb-5 flex flex-wrap items-center gap-2">
      {pasos.map((paso, i) => {
        const hecho = i < actual;
        const enCurso = i === actual;
        return (
          <li key={paso} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                hecho ? 'bg-brand text-white' : enCurso ? 'bg-brand-soft text-brand-dark ring-2 ring-brand' : 'bg-page text-muted'
              }`}
            >
              {hecho ? <Check size={13} /> : i + 1}
            </span>
            <span className={`text-xs font-medium ${enCurso ? 'text-heading' : 'text-muted'}`}>{paso}</span>
            {i < pasos.length - 1 && <span className="mx-1 h-px w-6 bg-line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
