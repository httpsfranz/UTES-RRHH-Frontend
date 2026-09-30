import { api } from './client';

const POR_PAGINA = 100; // maximo que acepta el backend (clamp 1-100)
const MAX_PAGINAS = 50; // tope de seguridad: 5000 registros

/**
 * Trae TODAS las paginas de un listado paginado de Laravel ({ data, meta }).
 * Los catalogos son cortos, pero el backend pagina de 15 en 15 por defecto: sin esto la
 * pantalla mostraria solo los primeros 15 registros sin avisar.
 */
export async function traerTodo(endpoint, params = {}) {
  const filas = [];
  let pagina = 1;
  let hayMas = true;

  while (hayMas && pagina <= MAX_PAGINAS) {
    const { data } = await api.get(endpoint, { params: { ...params, por_pagina: POR_PAGINA, page: pagina } });
    filas.push(...(data.data ?? []));
    hayMas = pagina < (data.meta?.last_page ?? 1);
    pagina += 1;
  }

  return filas;
}

/** Mensaje de error de una respuesta HTTP de la API (o null si no hubo respuesta: sin conexion). */
export function mensajeDeError(err) {
  return err?.response?.data?.message ?? null;
}
