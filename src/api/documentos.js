import { api } from './client';

/** Sube un archivo como documento de sustento (POST multipart) y devuelve el documento creado. */
export async function subirDocumento(archivo) {
  const cuerpo = new FormData();
  cuerpo.append('archivo', archivo);
  const { data } = await api.post('/documentos-sustento', cuerpo, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.data;
}

/**
 * Abre el archivo de un documento en otra pestaña (o lo descarga). El navegador no puede mandar el token en un enlace
 * directo, por eso se pide como blob y se abre desde memoria.
 */
export async function abrirDocumento(id, { descargar = false, nombre = 'documento' } = {}) {
  const { data } = await api.get(`/documentos-sustento/${id}/archivo`, { responseType: 'blob' });
  const url = URL.createObjectURL(data);
  if (descargar) {
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  } else {
    window.open(url, '_blank', 'noopener');
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Convierte un formulario con archivos en FormData (los valores vacios no se envian). */
export function aFormData(form, extra = {}) {
  const cuerpo = new FormData();
  Object.entries({ ...form, ...extra }).forEach(([clave, valor]) => {
    if (valor === null || valor === undefined || valor === '') return;
    cuerpo.append(clave, typeof valor === 'boolean' ? (valor ? '1' : '0') : valor);
  });
  return cuerpo;
}

export const tieneArchivo = (form) => Object.values(form).some((valor) => typeof File !== 'undefined' && valor instanceof File);
