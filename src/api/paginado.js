import { api } from './client';

const POR_PAGINA = 100; // maximo que acepta el backend (clamp 1-100)
const MAX_PAGINAS = 50; // tope de seguridad: 5000 registros

/**
 * Trae TODAS las paginas de un listado paginado de Laravel ({ data, meta }).
 * Los catalogos son cortos, pero el backend pagina de 15 en 15 por defecto: sin esto la
 * pantalla mostraria solo los primeros 15 registros sin avisar.
 *
 * La primera pagina dice cuantas hay (meta.last_page); las demas se piden a la vez, no una tras otra.
 */
async function traerTodoSinCompartir(endpoint, params) {
  const pedir = (pagina) => api.get(endpoint, { params: { ...params, por_pagina: POR_PAGINA, page: pagina } }).then(({ data }) => data);

  const primera = await pedir(1);
  const ultima = Math.min(primera.meta?.last_page ?? 1, MAX_PAGINAS);
  if (ultima <= 1) return primera.data ?? [];

  const restantes = await Promise.all(Array.from({ length: ultima - 1 }, (_, i) => pedir(i + 2)));
  return [primera, ...restantes].flatMap((pagina) => pagina.data ?? []);
}

// Dos pantallas (o el doble montaje de React en desarrollo) que piden la misma lista a la vez comparten una sola consulta.
// Solo se comparte mientras esta en curso: despues de guardar, la siguiente consulta siempre va al servidor.
const enVuelo = new Map();

export function traerTodo(endpoint, params = {}) {
  const clave = `${endpoint}?${JSON.stringify(params)}`;
  if (enVuelo.has(clave)) return enVuelo.get(clave);
  const promesa = traerTodoSinCompartir(endpoint, params).finally(() => enVuelo.delete(clave));
  enVuelo.set(clave, promesa);
  return promesa;
}

/**
 * Trae solo las primeras `limite` filas de un listado (auditoria, marcaciones: pueden ser miles), pidiendo a la vez las
 * paginas que hagan falta. Devuelve { filas, total }: `total` es cuantas hay en realidad, para avisar si no se ven todas.
 */
export async function traerHasta(endpoint, params, limite) {
  const porPagina = Math.min(limite, POR_PAGINA);
  const pedir = (pagina) => api.get(endpoint, { params: { ...params, por_pagina: porPagina, page: pagina } }).then(({ data }) => data);
  const primera = await pedir(1);
  const paginas = Math.min(primera.meta?.last_page ?? 1, Math.ceil(limite / porPagina));
  const restantes = paginas > 1 ? await Promise.all(Array.from({ length: paginas - 1 }, (_, i) => pedir(i + 2))) : [];
  const filas = [primera, ...restantes].flatMap((pagina) => pagina.data ?? []);
  return { filas, total: primera.meta?.total ?? filas.length };
}

/** Mensaje de error de una respuesta HTTP de la API (o null si no hubo respuesta: sin conexion). */
export function mensajeDeError(err) {
  return err?.response?.data?.message ?? null;
}
