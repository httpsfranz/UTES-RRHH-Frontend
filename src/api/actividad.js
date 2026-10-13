// Cuenta lo que esta cargando (peticiones al backend y pantallas que se descargan bajo demanda) para que la barra de
// progreso sepa cuando mostrarse. No guarda datos: solo un contador y quienes lo escuchan.
let pendientes = 0;
const oyentes = new Set();

const avisar = () => oyentes.forEach((oyente) => oyente());

export function empezarActividad() {
  pendientes += 1;
  avisar();
}

export function terminarActividad() {
  pendientes = Math.max(0, pendientes - 1);
  avisar();
}

export function suscribirActividad(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export const hayActividad = () => pendientes > 0;
