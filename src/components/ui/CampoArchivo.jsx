import { useRef } from 'react';
import { FileUp, X } from 'lucide-react';
import FieldShell from './FieldShell';
import { formatoBytes } from '../../utils/formato';

/**
 * Campo de subida de un archivo: un solo control (hacer clic o soltar el archivo). Guarda el `File` elegido en el
 * formulario; el nombre, el tipo, el tamaño y el hash los obtiene el servidor del propio archivo.
 *
 *   accept  tipos admitidos (atributo accept del input)
 *   actual  nombre del archivo ya guardado (al editar), se muestra mientras no se elija otro
 */
export default function CampoArchivo({ form, setForm, errors = {}, name, label, required, accept, actual }) {
  const entrada = useRef(null);
  const archivo = form[name] instanceof File ? form[name] : null;
  const error = errors[name]?.[0];

  const elegir = (nuevo) => setForm((f) => ({ ...f, [name]: nuevo ?? '' }));

  return (
    <FieldShell name={name} label={label} required={required} error={error}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          elegir(e.dataTransfer.files?.[0]);
        }}
        className={`flex items-center gap-3 rounded-xl border border-dashed bg-page/60 px-4 py-3 transition-colors hover:border-brand hover:bg-brand-soft/40 ${error ? 'border-rose-400' : 'border-line'}`}
      >
        <FileUp size={20} className="shrink-0 text-brand" />
        <button type="button" onClick={() => entrada.current?.click()} className="min-w-0 flex-1 text-left" id={name}>
          <span className="block truncate text-sm font-medium text-heading">{archivo ? archivo.name : actual ? `Archivo actual: ${actual}` : 'Haz clic o arrastra el archivo aquí'}</span>
          <span className="block text-xs text-muted">{archivo ? formatoBytes(archivo.size) : actual ? 'Elige otro para reemplazarlo' : 'PDF, imagen, Word o Excel'}</span>
        </button>
        {archivo && (
          <button type="button" onClick={() => elegir(null)} aria-label="Quitar archivo" className="rounded-lg p-1 text-muted transition-colors hover:text-rose-600">
            <X size={16} />
          </button>
        )}
        <input ref={entrada} type="file" accept={accept} className="hidden" onChange={(e) => elegir(e.target.files?.[0])} />
      </div>
    </FieldShell>
  );
}
