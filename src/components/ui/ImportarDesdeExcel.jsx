import { useState } from 'react';
import { CheckCircle2, Download, FileSpreadsheet, TriangleAlert } from 'lucide-react';
import { api } from '../../api/client';
import { descargarArchivo } from '../../api/descargas';
import { aFormData } from '../../api/documentos';
import { mensajeDeError } from '../../api/paginado';
import Modal from '../Modal';
import AccionesDeModal from './AccionesDeModal';
import Alert from './Alert';
import Button from './Button';
import CampoArchivo from './CampoArchivo';
import HelpText from './HelpText';

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };
const TONOS = { exito: 'text-emerald-600', error: 'text-rose-600' };

/**
 * Carga desde Excel en tres pasos, igual en todas las pantallas que la usan: descargar la plantilla, subir el archivo para
 * VALIDARLO (la API ensaya la carga y no guarda nada) y confirmar. Los problemas se muestran por fila y columna, y se puede
 * importar solo lo válido. La API responde { errores: [{fila, campo, mensaje}], errores_total, ... } y, al confirmar, 201.
 *
 *   titulo, instrucciones         textos del modal
 *   plantilla                     { ruta, params, nombre } de la descarga
 *   envio                         { ruta, datos }: datos fijos que acompañan al archivo (establecimiento, mes...)
 *   campos(form, setForm, errors) campos extra del formulario (p. ej. el documento de sustento), opcional
 *   resumen(analisis)             tarjetas [{ etiqueta, valor, tono: 'exito'|'error' }]
 *   validos(analisis)             cuánto se importaría (0 deshabilita "Importar")
 *   textoImportar(n)              texto del botón, textoOmitir(n) el de la casilla de omitir errores
 *   exito(resultado)              { titulo, detalle } tras importar
 *   ayuda, bloqueo                nota bajo el archivo; si hay `bloqueo` (texto), no se puede cargar
 *   pie                           contenido al final (p. ej. las cargas anteriores), opcional
 *   onImportado(resultado)        al terminar (para recargar la pantalla)
 */
export default function ImportarDesdeExcel({
  open,
  onClose,
  titulo,
  instrucciones,
  plantilla,
  envio,
  campos,
  resumen,
  validos,
  textoImportar,
  textoOmitir,
  exito,
  ayuda,
  bloqueo,
  pie,
  onImportado,
}) {
  const [form, setForm] = useState({ archivo: '' });
  const [analisis, setAnalisis] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [omitir, setOmitir] = useState(false);
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});

  function cerrar() {
    setForm({ archivo: '' });
    setAnalisis(null);
    setResultado(null);
    setOmitir(false);
    setError('');
    setErrores({});
    onClose();
  }

  function cambiar(cambio) {
    setForm(cambio);
    setAnalisis(null);
  }

  async function descargarPlantilla() {
    setError('');
    const problema = await descargarArchivo(plantilla.ruta, plantilla.params, plantilla.nombre);
    if (problema) setError(problema);
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
      const { data } = await api.post(envio.ruta, aFormData(form, { ...envio.datos, confirmar: confirmar ? 1 : 0, omitir_errores: omitir ? 1 : 0 }), MULTIPART);
      if (confirmar) {
        setResultado(data);
        onImportado?.(data);
      } else {
        setAnalisis(data);
      }
    } catch (err) {
      const cuerpo = err.response?.data;
      if (err.response?.status === 422 && cuerpo?.errors) setErrores(cuerpo.errors);
      else if (err.response?.status === 422 && cuerpo?.errores) {
        setAnalisis(cuerpo);
        if (!cuerpo.errores_total) setError(cuerpo.message);
      } else setError(mensajeDeError(err) ?? 'No se pudo procesar el archivo.');
    } finally {
      setTrabajando(false);
    }
  }

  const hayErrores = analisis && analisis.errores_total > 0;
  const cantidad = analisis ? validos(analisis) : 0;
  const final = resultado ? exito(resultado) : null;

  return (
    <Modal open={open} onClose={cerrar} title={titulo} size="lg">
      <div className="space-y-4">
        <Alert>{error}</Alert>
        {bloqueo && !resultado && <Alert>{bloqueo}</Alert>}
        {!resultado && !bloqueo && (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line-soft bg-page/60 p-4">
              <FileSpreadsheet size={22} className="shrink-0 text-brand" />
              <p className="min-w-0 flex-1 text-sm text-slate-600">{instrucciones}</p>
              <Button variant="secondary" icon={Download} onClick={descargarPlantilla}>
                Descargar plantilla
              </Button>
            </div>
            <CampoArchivo form={form} setForm={cambiar} errors={errores} name="archivo" label="Archivo de Excel (.xlsx) o CSV" accept=".xlsx,.csv" />
            {campos?.(form, cambiar, errores)}
            <HelpText>{ayuda ?? 'Primero se valida el archivo sin guardar nada.'}</HelpText>
          </>
        )}

        {analisis && !resultado && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {resumen(analisis).map((tarjeta) => (
                <div key={tarjeta.etiqueta} className="rounded-2xl border border-line bg-surface px-4 py-3">
                  <p className="text-xs text-muted">{tarjeta.etiqueta}</p>
                  <p className={`text-2xl font-bold ${TONOS[tarjeta.tono] ?? 'text-heading'}`}>{Number(tarjeta.valor ?? 0).toLocaleString('es-PE')}</p>
                </div>
              ))}
            </div>
            {hayErrores ? (
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
                {analisis.errores_total > analisis.errores.length && (
                  <p className="text-xs text-muted">
                    Se muestran los primeros {analisis.errores.length} de {analisis.errores_total} problemas.
                  </p>
                )}
                {cantidad > 0 && (
                  <label className="flex items-center gap-2 text-sm text-heading">
                    <input type="checkbox" checked={omitir} onChange={(e) => setOmitir(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
                    {textoOmitir(cantidad)}
                  </label>
                )}
              </>
            ) : (
              <p className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={16} /> {cantidad > 0 ? 'El archivo no tiene errores.' : 'El archivo no tiene errores, pero tampoco nada nuevo que cargar.'}
              </p>
            )}
          </div>
        )}

        {final && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle2 size={40} className="text-emerald-500" />
            <p className="text-lg font-semibold text-heading">{final.titulo}</p>
            {final.detalle && <p className="text-sm text-slate-600">{final.detalle}</p>}
            {resultado.errores_total > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-amber-700">
                <TriangleAlert size={14} /> {resultado.errores_total === 1 ? '1 problema no se cargó.' : `${resultado.errores_total} problemas no se cargaron.`}
              </p>
            )}
          </div>
        )}

        {pie}

        <AccionesDeModal>
          <Button variant="secondary" onClick={cerrar}>
            {resultado ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!resultado && !bloqueo && (
            <>
              <Button variant="secondary" disabled={trabajando || !form.archivo} onClick={() => enviar(false)}>
                {trabajando && !analisis ? 'Validando…' : 'Validar archivo'}
              </Button>
              <Button disabled={trabajando || !analisis || cantidad === 0 || (hayErrores && !omitir)} onClick={() => enviar(true)}>
                {trabajando && analisis ? 'Importando…' : textoImportar(cantidad)}
              </Button>
            </>
          )}
        </AccionesDeModal>
      </div>
    </Modal>
  );
}
