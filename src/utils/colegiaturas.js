// Opcion "Otro" de los selects de profesion y colegio: lo escrito se crea en el catalogo al guardar el trabajador.
export const OTRO = '__otro__';

/** Lo que se envia al backend: "Otro" se manda como ColegiaturaTipoNuevo (el colegio se crea al guardar). */
export function colegiaturasParaEnviar(filas = []) {
  return filas.map((f) => ({
    ...(f.ColegiaturaId ? { ColegiaturaId: f.ColegiaturaId } : {}),
    ...(f.ColegiaturaTipoId === OTRO ? { ColegiaturaTipoNuevo: f.ColegiaturaTipoNuevo } : { ColegiaturaTipoId: f.ColegiaturaTipoId }),
    ColegiaturaNumero: f.ColegiaturaNumero,
    ColegiaturaFechaColegiatura: f.ColegiaturaFechaColegiatura || null,
    ColegiaturaFechaVencimiento: f.ColegiaturaFechaVencimiento || null,
    ColegiaturaEsPrincipal: Boolean(f.ColegiaturaEsPrincipal),
  }));
}

/** Colegiaturas de la respuesta de la API -> filas del editor. */
export function colegiaturasDelTrabajador(item) {
  return (item.colegiaturas ?? []).map((c) => ({
    ColegiaturaId: c.id,
    ColegiaturaTipoId: c.tipo_id,
    ColegiaturaTipoNuevo: '',
    ColegiaturaNumero: c.numero,
    ColegiaturaFechaColegiatura: c.fecha_colegiatura ?? '',
    ColegiaturaFechaVencimiento: c.fecha_vencimiento ?? '',
    ColegiaturaEsPrincipal: c.es_principal,
  }));
}
