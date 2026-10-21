import { Link } from 'react-router-dom';
import { TONES } from '../../nav/moduleIcons';
import ModuleIcon from '../../components/ui/ModuleIcon';
import { ICONOS } from '../iconos';
import { TONES_DE_ICONO, tonoDe } from '../tonos';

const formato = new Intl.NumberFormat('es-PE');

// Fila de indicadores: icono, cifra grande, etiqueta y una linea de detalle. Con `enlace`, el indicador lleva a su detalle.
function Tarjeta({ enlace, children }) {
  const clases = 'flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]';
  return enlace ? (
    <Link to={enlace} className={`${clases} transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-pop)]`}>
      {children}
    </Link>
  ) : (
    <div className={clases}>{children}</div>
  );
}

export default function WidgetKpis({ items }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Tarjeta key={item.etiqueta} enlace={item.enlace}>
          <ModuleIcon icon={ICONOS[item.icono] ?? ICONOS.check} tone={TONES[TONES_DE_ICONO[item.tono]] ?? TONES.teal} size="xl" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-600">{item.etiqueta}</p>
            <p className={`mt-1 text-3xl font-bold leading-none tracking-tight ${tonoDe(item.tono).texto}`}>
              {typeof item.valor === 'number' ? formato.format(item.valor) : item.valor}
              {item.unidad && <span className="ml-0.5 text-xl">{item.unidad}</span>}
            </p>
            {item.detalle && <p className="mt-1.5 text-xs text-muted">{item.detalle}</p>}
          </div>
        </Tarjeta>
      ))}
    </div>
  );
}
