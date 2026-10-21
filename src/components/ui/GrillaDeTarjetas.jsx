// Grilla simple de tarjetas de alto libre (a diferencia de CardGrid, que fija el alto para paginar).
export default function GrillaDeTarjetas({ children, ancho = 240 }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${ancho}px, 100%), 1fr))` }}>
      {children}
    </div>
  );
}
