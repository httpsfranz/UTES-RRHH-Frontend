import { api } from './client';

/** Sube un archivo como documento de sustento (POST multipart) y devuelve el documento creado. */
export async function subirDocumento(archivo) {
  const cuerpo = new FormData();
  cuerpo.append('archivo', archivo);
  const { data } = await api.post('/documentos-sustento', cuerpo, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.data;
}

/** Evento con el que cualquier pantalla abre el visor de documentos (components/ui/VisorDeDocumento, montado en el layout). */
export const EVENTO_VER_DOCUMENTO = 'utes:ver-documento';

// Tipo por extension, para un archivo guardado sin tipo (application/octet-stream): sin el, el navegador lo descarga.
const TIPOS = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', txt: 'text/plain' };

/**
 * Archivo de un documento como blob. El navegador no puede mandar el token en un enlace directo, por eso se pide con la
 * sesion y se muestra desde memoria.
 */
export async function traerDocumento(id, nombre = '') {
  const { data } = await api.get(`/documentos-sustento/${id}/archivo`, { responseType: 'blob' });
  const tipo = TIPOS[nombre.split('.').pop()?.toLowerCase()];
  return tipo && (!data.type || data.type === 'application/octet-stream') ? new Blob([data], { type: tipo }) : data;
}

/** Guarda en el equipo un archivo ya cargado en memoria (URL de blob). */
export function guardarArchivo(url, nombre) {
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
}

/** Muestra un documento en el visor del sistema, sin descargarlo. */
export function verDocumento(id, nombre) {
  window.dispatchEvent(new CustomEvent(EVENTO_VER_DOCUMENTO, { detail: { id, nombre } }));
}

/** Muestra el archivo de un documento en el visor del sistema o, con `descargar`, lo descarga. */
export async function abrirDocumento(id, { descargar = false, nombre = 'documento' } = {}) {
  if (!descargar) {
    verDocumento(id, nombre);
    return;
  }
  const url = URL.createObjectURL(await traerDocumento(id, nombre));
  guardarArchivo(url, nombre);
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
