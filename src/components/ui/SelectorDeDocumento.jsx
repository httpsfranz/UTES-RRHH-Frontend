import { useRef, useState } from 'react';
import { Eye, Upload } from 'lucide-react';
import { abrirDocumento, subirDocumento } from '../../api/documentos';
import { invalidarOpciones } from '../../api/cacheDeOpciones';
import { mensajeDeError } from '../../api/paginado';
import Select from './Select';

/**
 * Documento de sustento de una solicitud o expediente: se elige uno ya registrado o se sube uno nuevo desde el mismo
 * formulario (queda seleccionado). Misma interfaz que Select (form/setForm/errors/name/label/icon/options).
 */
export default function SelectorDeDocumento({ options, ...props }) {
  const entrada = useRef(null);
  const [subidos, setSubidos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const { form, setForm, name } = props;
  const elegido = form[name];

  async function subir(archivo) {
    if (!archivo) return;
    setSubiendo(true);
    setError('');
    try {
      const documento = await subirDocumento(archivo);
      invalidarOpciones('/documentos-sustento');
      setSubidos((previos) => [...previos, { value: String(documento.id), label: documento.nombre }]);
      setForm((f) => ({ ...f, [name]: String(documento.id) }));
    } catch (err) {
      setError(err.response?.data?.errors?.archivo?.[0] ?? mensajeDeError(err) ?? 'No se pudo subir el archivo.');
    } finally {
      setSubiendo(false);
      if (entrada.current) entrada.current.value = '';
    }
  }

  return (
    <div>
      <Select {...props} options={[...options, ...subidos.filter((s) => !options.some((o) => String(o.value) === s.value))]} />
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <button type="button" disabled={subiendo} onClick={() => entrada.current?.click()} className="inline-flex items-center gap-1 font-medium text-brand-dark transition-colors hover:text-brand disabled:opacity-60">
          <Upload size={13} /> {subiendo ? 'Subiendo…' : 'Subir un archivo nuevo'}
        </button>
        {elegido && (
          <button type="button" onClick={() => abrirDocumento(elegido).catch(() => setError('No se pudo abrir el documento.'))} className="inline-flex items-center gap-1 font-medium text-slate-600 transition-colors hover:text-heading">
            <Eye size={13} /> Ver documento
          </button>
        )}
        {error && <span className="text-rose-600">{error}</span>}
      </div>
      <input ref={entrada} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" className="hidden" onChange={(e) => subir(e.target.files?.[0])} />
    </div>
  );
}
