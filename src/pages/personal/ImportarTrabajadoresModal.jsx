import { useState } from 'react';
import { CheckCircle2, Download, FileSpreadsheet, TriangleAlert } from 'lucide-react';
import { api } from '../../api/client';
import { invalidarOpciones } from '../../api/cacheDeOpciones';
import { aFormData } from '../../api/documentos';
import { mensajeDeError } from '../../api/paginado';
import Modal from '../../components/Modal';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import CampoArchivo from '../../components/ui/CampoArchivo';
import HelpText from '../../components/ui/HelpText';

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

/**
 * Alta masiva de trabajadores desde Excel en tres pasos: descargar la plantilla, subir el archivo para VALIDARLO (no
 * guarda nada) y confirmar la importación. Si hay filas con errores se muestran por fila y columna, y se puede importar
 * solo las válidas.
 *
 *   open, onClose  visibilidad
 *   onImportado    se llama al terminar (para recargar la lista)
 */
export default function ImportarTrabajadoresModal({ open, onClose, onImportado }) {
  const [form, setForm] = useState({ archivo: '' });
  const [analisis, setAnalisis] = useState(null);
  const [omitir, setOmitir] = useState(false);
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});

  function cerrar() {
    setForm({ archivo: '' });
    setAnalisis(null);
    setOmitir(false);
    setError('');
    setErrores({});
    onClose();
  }

  async function descargarPlantilla() {
    setError('');
    try {
      const { data } = await api.get('/trabajadores/plantilla', { responseType: 'blob' });
      const url = URL.createObjectURL(data);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = 'plantilla_trabajadores.xlsx';
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('No se pudo descargar la plantilla.');
    }
  }

  async function enviar(confirmar) {
    if (!form.archivo) {
      setErrores({ archivo: ['Elige el archivo de Excel.'] });
      return;
    }
    setTrabajando(true);
    setError('');
    setErrores({});
    try {
      const { data } = await api.post('/trabajadores/importar', aFormData(form, { confirmar: confirmar ? 1 : 0, omitir_errores: omitir ? 1 : 0 }), MULTIPART);
      setAnalisis(data);
      if (confirmar) {
        invalidarOpciones('/trabajadores');
        onImportado?.(data.importados);
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) setErrores(err.response.data.errors);
      else if (err.response?.status === 422 && err.response.data?.errores) setAnalisis(err.response.data);
      else setError(mensajeDeError(err) ?? 'No se pudo procesar el archivo.');
    } finally {
      setTrabajando(false);
    }
  }

  const importado = analisis && analisis.importados > 0;
  const hayErrores = analisis && analisis.errores_total > 0;

  return (
    <Modal open={open} onClose={cerrar} title="Importar trabajadores desde Excel" size="lg">
      <div className="space-y-4">
        <Alert>{error}</Alert>
        {!importado && (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line-soft bg-page/60 p-4">
              <FileSpreadsheet size={22} className="shrink-0 text-brand" />
              <p className="min-w-0 flex-1 text-sm text-slate-600">
                Descarga la plantilla, llénala con una fila por trabajador (solo datos de la persona; el vínculo laboral se registra después) y súbela.
              </p>
              <Button variant="secondary" icon={Download} onClick={descargarPlantilla}>
                Descargar plantilla
              </Button>
            </div>
            <CampoArchivo
              form={form}
              setForm={(cambio) => {
                setForm(cambio);
                setAnalisis(null);
              }}
              errors={errores}
              name="archivo"
              label="Archivo de Excel (.xlsx) o CSV"
              accept=".xlsx,.csv"
            />
            <HelpText>Primero se valida el archivo sin guardar nada. Hasta 20 000 filas y 10 MB por carga.</HelpText>
          </>
        )}

        {analisis && !importado && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Resumen etiqueta="Filas leídas" valor={analisis.total} />
              <Resumen etiqueta="Listas para importar" valor={analisis.validas} tono="text-emerald-600" />
              <Resumen etiqueta="Con errores" valor={analisis.filas_con_error} tono={analisis.filas_con_error ? 'text-rose-600' : 'text-heading'} />
            </div>
            {hayErrores && (
              <>
                <div className="max-h-56 overflow-auto rounded-2xl border border-line">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-page text-[10px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Fila</th>
                        <th className="px-3 py-2">Columna</th>
                        <th className="px-3 py-2">Problema</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-soft">
                      {analisis.errores.map((e, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5 font-semibold text-heading">{e.fila}</td>
                          <td className="px-3 py-1.5 text-slate-600">{e.campo}</td>
                          <td className="px-3 py-1.5 text-rose-600">{e.mensaje}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {analisis.errores_total > analisis.errores.length && <p className="text-xs text-muted">Se muestran los primeros {analisis.errores.length} de {analisis.errores_total} problemas.</p>}
                {analisis.validas > 0 && (
                  <label className="flex items-center gap-2 text-sm text-heading">
                    <input type="checkbox" checked={omitir} onChange={(e) => setOmitir(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
                    Importar solo las {analisis.validas} filas válidas y omitir las que tienen errores
                  </label>
                )}
              </>
            )}
            {!hayErrores && (
              <p className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={16} /> El archivo no tiene errores.
              </p>
            )}
          </div>
        )}

        {importado && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle2 size={40} className="text-emerald-500" />
            <p className="text-lg font-semibold text-heading">{analisis.importados.toLocaleString('es-PE')} trabajadores importados</p>
            {analisis.filas_con_error > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-amber-700">
                <TriangleAlert size={14} /> {analisis.filas_con_error} filas con errores no se importaron.
              </p>
            )}
          </div>
        )}

        <AccionesDeModal>
          <Button variant="secondary" onClick={cerrar}>
            {importado ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!importado && (
            <>
              <Button variant="secondary" disabled={trabajando || !form.archivo} onClick={() => enviar(false)}>
                {trabajando && !analisis ? 'Validando…' : 'Validar archivo'}
              </Button>
              <Button disabled={trabajando || !analisis || analisis.validas === 0 || (hayErrores && !omitir)} onClick={() => enviar(true)}>
                {trabajando && analisis ? 'Importando…' : `Importar ${analisis?.validas ?? ''} trabajadores`.replace('  ', ' ')}
              </Button>
            </>
          )}
        </AccionesDeModal>
      </div>
    </Modal>
  );
}

function Resumen({ etiqueta, valor, tono = 'text-heading' }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-3">
      <p className="text-xs text-muted">{etiqueta}</p>
      <p className={`text-2xl font-bold ${tono}`}>{valor.toLocaleString('es-PE')}</p>
    </div>
  );
}
