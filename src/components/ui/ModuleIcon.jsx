import { FALLBACK_ICON, TONES } from '../../nav/moduleIcons';

const SIZES = {
  sm: { box: 'h-9 w-9 rounded-xl', icon: 18 },
  md: { box: 'h-10 w-10 rounded-xl', icon: 20 },
  lg: { box: 'h-12 w-12 rounded-2xl', icon: 24 },
  xl: { box: 'h-12 w-12 rounded-2xl', icon: 24 },
};

// Cuadrado redondeado con icono, siempre con contenido: si no llega `icon` (ni `children`)
// usa FALLBACK_ICON. Es la unica pieza que dibuja el "icono de modulo" en tarjetas y cabeceras.
export default function ModuleIcon({ icon, tone = TONES.teal, size = 'md', solid = false, children, className = '' }) {
  const Icon = icon ?? FALLBACK_ICON;
  const medidas = SIZES[size] ?? SIZES.md;

  return (
    <div
      className={`flex shrink-0 items-center justify-center text-sm font-semibold ${medidas.box} ${solid ? `${tone.solid} shadow-sm` : tone.box} ${className}`}
      aria-hidden="true"
    >
      {children ?? <Icon size={medidas.icon} strokeWidth={1.9} />}
    </div>
  );
}
