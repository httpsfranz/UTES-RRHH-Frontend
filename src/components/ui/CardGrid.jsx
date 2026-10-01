// Medidas de la vista de tarjetas: EntityList las usa para calcular cuantas caben en pantalla
// (columnas = auto-fill de ANCHO_TARJETA, filas = ALTO_TARJETA, separadas por GAP_TARJETAS).
export const ANCHO_TARJETA = 270;
export const ALTO_TARJETA = 176;
export const GAP_TARJETAS = 16;

export default function CardGrid({ children }) {
  return (
    <div
      className="grid"
      style={{
        gap: GAP_TARJETAS,
        gridTemplateColumns: `repeat(auto-fill, minmax(${ANCHO_TARJETA}px, 1fr))`,
        gridAutoRows: ALTO_TARJETA,
      }}
    >
      {children}
    </div>
  );
}
