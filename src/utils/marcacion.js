// Estado de un trabajador en el dia que se marca (vista "Hoy" del control de asistencia), a partir de lo que entrega
// GET /asistencia-diaria/calendario: su celda del dia, sus marcas y si tiene una entrada sin salida.
//
//   clave    por_marcar | en_turno | salio | cubierto | registrado | sin_turno
//   accion   ENTRADA | SALIDA | null   (la marca que corresponde ahora)
export function estadoDelDia(trabajador, celda) {
  const marcas = trabajador.marcas ?? [];
  const ultima = marcas[marcas.length - 1];
  const turno = celda && !celda.vacia ? (celda.horario ?? celda.turno) : null;

  if (trabajador.entrada_abierta) {
    return { clave: 'en_turno', etiqueta: `En turno desde las ${trabajador.entrada_abierta}`, accion: 'SALIDA', turno };
  }
  if (ultima?.tipo === 'SALIDA') {
    const entrada = marcas.find((m) => m.tipo === 'ENTRADA');
    return { clave: 'salio', etiqueta: `${entrada ? `Entró ${entrada.hora} · ` : ''}Salió ${ultima.hora}`, accion: 'ENTRADA', turno, detalle: celda?.estado_nombre };
  }
  if (celda?.categoria === 'cobertura') {
    return { clave: 'cubierto', etiqueta: celda.estado_nombre, accion: null, turno };
  }
  if (celda?.asistencia_id) {
    return { clave: 'registrado', etiqueta: celda.estado_nombre, accion: 'ENTRADA', turno };
  }
  if (turno) {
    return { clave: 'por_marcar', etiqueta: 'Por marcar', accion: 'ENTRADA', turno };
  }
  return { clave: 'sin_turno', etiqueta: 'Sin turno hoy', accion: 'ENTRADA', turno: null };
}

export const FILTROS_DEL_DIA = [
  { clave: 'todos', etiqueta: 'Todos' },
  { clave: 'por_marcar', etiqueta: 'Por marcar' },
  { clave: 'en_turno', etiqueta: 'En turno' },
  { clave: 'salio', etiqueta: 'Salieron' },
  { clave: 'otros', etiqueta: 'Otros' },
];

export const coincideFiltro = (filtro, clave) =>
  filtro === 'todos' || filtro === clave || (filtro === 'otros' && !['por_marcar', 'en_turno', 'salio'].includes(clave));

/** Fecha AAAA-MM-DD desplazada `dias` (o 7 dias por semana / 1 mes) segun la vista. */
export function moverFecha(fecha, vista, sentido) {
  const d = new Date(`${fecha}T12:00:00`);
  if (vista === 'mes') d.setMonth(d.getMonth() + sentido, 1);
  else d.setDate(d.getDate() + (vista === 'semana' ? 7 : 1) * sentido);
  return d.toISOString().slice(0, 10);
}

/** Hoy en el navegador como AAAA-MM-DD (solo para navegar; la hora de una marca la pone el servidor). */
export function hoyLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
