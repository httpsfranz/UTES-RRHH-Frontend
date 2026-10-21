/** Fin del record vacacional: un año de servicios desde el inicio (el dia anterior al aniversario). */
export function finDelRecord(inicio) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio ?? '')) return null;
  const d = new Date(`${inicio}T12:00:00`);
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
