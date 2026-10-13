// Barra de controles de una pantalla (selectores, boton de exportar...): tarjeta blanca que reparte sus hijos en fila y
// los baja de linea cuando no caben. Igual aspecto que la barra de busqueda de los listados.
export default function Toolbar({ children }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">{children}</div>
  );
}

// Un control dentro de la barra con ancho propio (los selectores de Select ocupan el 100% de su contenedor).
export function ToolbarItem({ ancho = 'md', children }) {
  const anchos = { sm: 'w-28', md: 'w-44', lg: 'w-72', xl: 'w-96' };
  return <div className={`${anchos[ancho] ?? anchos.md} max-w-full`}>{children}</div>;
}
