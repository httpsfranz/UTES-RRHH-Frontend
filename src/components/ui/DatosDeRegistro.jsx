// Pares etiqueta / valor de un registro (detalle dentro de un modal). items: [{ label, value }]; los valores vacios se omiten.
export default function DatosDeRegistro({ items }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      {items
        .filter(({ value }) => value !== null && value !== undefined && value !== '')
        .map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium text-heading">{value}</dd>
          </div>
        ))}
    </dl>
  );
}
