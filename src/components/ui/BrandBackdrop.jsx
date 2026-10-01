// Fondo institucional decorativo de la esquina superior derecha. Todo el efecto vive en CSS
// (.brand-backdrop en index.css); aqui solo se montan las capas. No recibe clics ni lectores de pantalla.
export default function BrandBackdrop() {
  return (
    <div className="brand-backdrop" aria-hidden="true">
      <div className="brand-backdrop__img" />
      <span className="brand-backdrop__ring" style={{ top: '-90px', right: '70px', width: 280, height: 280 }} />
      <span className="brand-backdrop__ring" style={{ top: '120px', right: '-70px', width: 220, height: 220 }} />
      <span className="brand-backdrop__ring" style={{ top: '40px', right: '300px', width: 90, height: 90 }} />
    </div>
  );
}
