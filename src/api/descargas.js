import { api } from './client';

/**
 * Descarga un archivo que genera la API (Excel, PDF) con el nombre que indica el servidor. Si la API responde con error,
 * el cuerpo llega como blob: se lee su mensaje para mostrarlo.
 */
export async function descargarArchivo(ruta, params = {}, nombreRespaldo = 'archivo') {
  try {
    const { data, headers } = await api.get(ruta, { params, responseType: 'blob' });
    const nombre = /filename="?([^";]+)"?/.exec(headers['content-disposition'] ?? '')?.[1] ?? nombreRespaldo;
    const url = URL.createObjectURL(data);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
    return null;
  } catch (err) {
    const mensaje = await err.response?.data
      ?.text?.()
      .then((texto) => JSON.parse(texto)?.message)
      .catch(() => null);
    return mensaje ?? 'No se pudo generar el archivo.';
  }
}
