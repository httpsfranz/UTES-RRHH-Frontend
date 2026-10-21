// Area que ocupa el alto restante de la pagina y se desplaza por dentro (la pagina no hace scroll).
export default function ZonaDesplazable({ children }) {
  return <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pb-2 pr-1">{children}</div>;
}
