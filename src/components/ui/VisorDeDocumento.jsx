import { useEffect, useState } from 'react';
import { Download, ExternalLink, FileWarning } from 'lucide-react';
import { EVENTO_VER_DOCUMENTO, guardarArchivo, traerDocumento } from '../../api/documentos';
import Modal from '../Modal';
import AccionesDeModal from './AccionesDeModal';
import Alert from './Alert';
import Button from './Button';
import LoadingState from './LoadingState';

/** El navegador muestra por sí mismo PDF, imágenes y texto; Word y Excel no (se ofrecen para descargar). */
function formaDeVer(tipo) {
  if (tipo === 'application/pdf' || tipo.startsWith('text/')) return 'marco';
  if (tipo.startsWith('image/')) return 'imagen';
  return null;
}

/**
 * Visor de documentos de sustento dentro del sistema: se monta una vez en el layout y se abre con verDocumento() (api/
 * documentos), desde cualquier pantalla, sin descargar el archivo. El archivo se pide con la sesión (como blob) y se
 * muestra en un modal; también se puede descargar o abrir en otra pestaña.
 */
export default function VisorDeDocumento() {
  const [pedido, setPedido] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const abrir = (evento) => {
      setArchivo(null);
      setError('');
      setPedido(evento.detail);
    };
    window.addEventListener(EVENTO_VER_DOCUMENTO, abrir);
    return () => window.removeEventListener(EVENTO_VER_DOCUMENTO, abrir);
  }, []);

  useEffect(() => {
    if (!pedido) return undefined;
    let vigente = true;
    let url = null;
    traerDocumento(pedido.id, pedido.nombre)
      .then((blob) => {
        if (!vigente) return;
        url = URL.createObjectURL(blob);
        setArchivo({ url, tipo: blob.type });
      })
      .catch(() => vigente && setError('No se pudo abrir el documento: puede que ya no tenga archivo o que no tengas acceso.'));
    return () => {
      vigente = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [pedido]);

  const nombre = pedido?.nombre ?? 'Documento';
  const forma = archivo ? formaDeVer(archivo.tipo) : null;

  return (
    <Modal open={Boolean(pedido)} onClose={() => setPedido(null)} title={nombre} size="xl">
      <div className="space-y-4">
        <Alert>{error}</Alert>
        {!archivo && !error && <LoadingState message="Abriendo el documento…" />}
        {forma === 'marco' && <iframe src={archivo.url} title={nombre} className="h-[70vh] w-full rounded-2xl border border-line bg-white" />}
        {forma === 'imagen' && (
          <div className="flex max-h-[70vh] justify-center overflow-auto rounded-2xl border border-line bg-page p-2">
            <img src={archivo.url} alt={nombre} className="max-w-full object-contain" />
          </div>
        )}
        {archivo && !forma && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <FileWarning size={36} className="text-amber-500" />
            <p className="font-semibold text-heading">Este tipo de archivo no se puede mostrar en el navegador</p>
            <p className="text-sm text-slate-600">Los documentos de Word o Excel se revisan descargándolos.</p>
          </div>
        )}
        <AccionesDeModal>
          {archivo && forma && (
            <Button variant="secondary" icon={ExternalLink} onClick={() => window.open(archivo.url, '_blank')}>
              Abrir en otra pestaña
            </Button>
          )}
          {archivo && (
            <Button variant={forma ? 'secondary' : 'primary'} icon={Download} onClick={() => guardarArchivo(archivo.url, nombre)}>
              Descargar
            </Button>
          )}
          <Button variant="secondary" onClick={() => setPedido(null)}>
            Cerrar
          </Button>
        </AccionesDeModal>
      </div>
    </Modal>
  );
}
