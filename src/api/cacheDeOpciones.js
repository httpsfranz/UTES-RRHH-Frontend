import { traerTodo } from './paginado';

// Cache de corta vida para las listas de apoyo de los formularios (profesiones, establecimientos, trabajadores...).
// La primera peticion se comparte (tambien entre pantallas que la piden a la vez) y se reutiliza unos segundos. Modificar
// un registro del mismo recurso, o cerrar la sesion, la descarta.
const VIGENCIA_MS = 60_000;
const cache = new Map();

const clave = (endpoint, params) => `${endpoint}?${JSON.stringify(params)}`;

export function traerTodoConCache(endpoint, params = {}) {
  const k = clave(endpoint, params);
  const guardada = cache.get(k);
  if (guardada && guardada.hasta > Date.now()) return guardada.promesa;

  const promesa = traerTodo(endpoint, params);
  cache.set(k, { promesa, hasta: Date.now() + VIGENCIA_MS });
  // Si falla, no se guarda el fallo: el siguiente intento vuelve a pedirla.
  promesa.catch(() => cache.delete(k));
  return promesa;
}

/** Descarta las listas guardadas de un recurso (se llama despues de crear, editar o eliminar en ese recurso). */
export function invalidarOpciones(endpoint) {
  for (const k of cache.keys()) {
    if (k.startsWith(`${endpoint}?`)) cache.delete(k);
  }
}

export function limpiarCacheDeOpciones() {
  cache.clear();
}
