import { useLocation } from 'react-router-dom';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Archive,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Clock,
  DoorOpen,
  FileCheck2,
  FilePlus2,
  FileText,
  Fingerprint,
  Gavel,
  GraduationCap,
  Hospital,
  Hourglass,
  House,
  IdCard,
  KeyRound,
  Landmark,
  Layers,
  LayoutGrid,
  LifeBuoy,
  Link2,
  ListChecks,
  Network,
  Palmtree,
  Percent,
  ReceiptText,
  Repeat,
  Scale,
  ScanFace,
  ScrollText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Stethoscope,
  Timer,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  Umbrella,
  Wallet,
} from 'lucide-react';
import { menu } from './menu';

/**
 * REGISTRO CENTRAL DE ICONOS Y COLORES POR MODULO.
 *
 * Es la unica fuente de verdad visual de "que icono y color lleva cada pantalla". Lo usan
 * PageHeader, EntityCard (cuadrado de la tarjeta), Navbar (breadcrumb) y EmptyState.
 *
 * Resolucion de icono (getModuleMeta), de mas a menos especifico:
 *   1. PATH_ICONS[ruta exacta]      icono propio de la pantalla
 *   2. icono del grupo del menu     (el mismo del sidebar: Personal -> Users, etc.)
 *   3. FALLBACK_ICON                nunca se devuelve "nada": jamas debe haber un cuadrado vacio.
 *
 * Una pantalla nueva no necesita registrar nada para verse bien: hereda el icono de su grupo.
 */
export const FALLBACK_ICON = LayoutGrid;

// Colores pastel por grupo del menu. Clases completas (no concatenadas) para que Tailwind las detecte.
export const TONES = {
  blue: { box: 'bg-blue-50 text-blue-600', bar: 'bg-blue-500', ring: 'ring-blue-100', solid: 'bg-blue-600 text-white', text: 'text-blue-600' },
  teal: { box: 'bg-teal-50 text-teal-600', bar: 'bg-teal-500', ring: 'ring-teal-100', solid: 'bg-teal-600 text-white', text: 'text-teal-600' },
  green: { box: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500', ring: 'ring-emerald-100', solid: 'bg-emerald-600 text-white', text: 'text-emerald-600' },
  purple: { box: 'bg-violet-50 text-violet-600', bar: 'bg-violet-500', ring: 'ring-violet-100', solid: 'bg-violet-600 text-white', text: 'text-violet-600' },
  orange: { box: 'bg-orange-50 text-orange-600', bar: 'bg-orange-500', ring: 'ring-orange-100', solid: 'bg-orange-600 text-white', text: 'text-orange-600' },
  red: { box: 'bg-rose-50 text-rose-600', bar: 'bg-rose-500', ring: 'ring-rose-100', solid: 'bg-rose-600 text-white', text: 'text-rose-600' },
  cyan: { box: 'bg-cyan-50 text-cyan-600', bar: 'bg-cyan-500', ring: 'ring-cyan-100', solid: 'bg-cyan-600 text-white', text: 'text-cyan-600' },
  indigo: { box: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-500', ring: 'ring-indigo-100', solid: 'bg-indigo-600 text-white', text: 'text-indigo-600' },
  amber: { box: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500', ring: 'ring-amber-100', solid: 'bg-amber-600 text-white', text: 'text-amber-600' },
  slate: { box: 'bg-slate-100 text-slate-600', bar: 'bg-slate-500', ring: 'ring-slate-200', solid: 'bg-slate-600 text-white', text: 'text-slate-600' },
};

const GROUP_TONE = {
  Organización: 'blue',
  Personal: 'teal',
  Asistencia: 'green',
  Biometría: 'purple',
  Compensaciones: 'orange',
  Configuración: 'slate',
  Programación: 'cyan',
  Solicitudes: 'indigo',
  Vacaciones: 'amber',
  Disciplina: 'red',
  Consolidación: 'blue',
  Seguridad: 'indigo',
  Soporte: 'cyan',
};

const PATH_ICONS = {
  // Organización
  '/organizacion/microredes': Network,
  '/organizacion/establecimientos': Hospital,
  '/organizacion/tipos-establecimiento': Landmark,
  '/organizacion/responsables': UserCog,
  '/organizacion/tipos-responsabilidad': BadgeCheck,
  // Personal
  '/personal/trabajadores': Users,
  '/personal/vinculos-laborales': Link2,
  '/personal/asignacion-horario': CalendarClock,
  '/personal/cargos': Briefcase,
  '/personal/grupos-ocupacionales': Layers,
  '/personal/profesiones': GraduationCap,
  '/personal/colegiaturas': Award,
  '/personal/tipos-colegiatura': Stethoscope,
  '/personal/condicion-laboral': ClipboardCheck,
  '/personal/regimen-laboral': Scale,
  '/personal/tipos-documento-identidad': IdCard,
  // Asistencia
  '/asistencia/marcaciones': Fingerprint,
  '/asistencia/asistencia-diaria': CalendarCheck,
  '/asistencia/ajustes': SlidersHorizontal,
  '/asistencia/carga-manual': FilePlus2,
  '/asistencia/justificacion-faltas': FileCheck2,
  '/asistencia/conceptos-justificacion': ScrollText,
  '/asistencia/estados': Activity,
  // Biometría
  '/biometria/dispositivos': Smartphone,
  '/biometria/metodos': Fingerprint,
  '/biometria/plantillas': ScanFace,
  '/biometria/autorizaciones': UserCheck,
  '/biometria/consentimientos': FileCheck2,
  // Compensaciones
  '/compensaciones/compensacion-horaria': Timer,
  '/compensaciones/tipos-compensacion': Wallet,
  '/compensaciones/conceptos-descuento': Percent,
  '/compensaciones/liquidaciones': ReceiptText,
  // Configuración
  '/configuracion/turnos': Clock,
  '/configuracion/horarios': CalendarRange,
  '/configuracion/tipos-jornada': Briefcase,
  '/configuracion/parametros-jornada': Hourglass,
  '/configuracion/parametros-sistema': SlidersHorizontal,
  '/configuracion/tablas-tolerancia': ListChecks,
  '/configuracion/tramos-tolerancia': Percent,
  // Programación
  '/programacion/periodos': CalendarRange,
  '/programacion/trabajadores': Users,
  '/programacion/turnos-programados': CalendarClock,
  '/programacion/cambios-turno': Repeat,
  '/programacion/tipos-cambio-turno': Repeat,
  '/programacion/tipos-periodo': CalendarDays,
  '/programacion/carga': FilePlus2,
  '/programacion/guardia-comunitaria': ClipboardList,
  // Solicitudes
  '/solicitudes/papeletas': FileText,
  '/solicitudes/tipos-papeleta': ClipboardList,
  '/solicitudes/motivos-papeleta': ScrollText,
  '/solicitudes/licencias': FileCheck2,
  '/solicitudes/tipos-licencia': BadgeCheck,
  '/solicitudes/descansos-medicos': Stethoscope,
  '/solicitudes/constatacion-domiciliaria': House,
  '/solicitudes/ocurrencias-porteria': DoorOpen,
  // Vacaciones
  '/vacaciones/periodos': CalendarRange,
  '/vacaciones/rol': ClipboardList,
  '/vacaciones/goce': Palmtree,
  // Disciplina
  '/disciplina/expedientes-pad': Gavel,
  '/disciplina/supervisiones': ClipboardCheck,
  '/disciplina/tipos-falta': AlertOctagon,
  // Consolidación
  '/consolidacion/periodos-asistencia': CalendarCheck,
  '/consolidacion/consolidado': BarChart3,
  // Seguridad
  '/seguridad/usuarios': UserRound,
  '/seguridad/roles': ShieldCheck,
  '/seguridad/permisos': KeyRound,
  '/seguridad/sesiones': Clock,
  '/seguridad/auditoria': ScrollText,
  // Soporte
  '/soporte/calendario-no-laborable': CalendarDays,
  '/soporte/documentos-sustento': Archive,
  '/soporte/notificaciones': Bell,
  '/soporte/logs-integracion': Network,
};

// Iconos de grupo por si algun grupo del menu no trae `icon` (defensa; hoy todos lo traen).
const GROUP_FALLBACK_ICONS = {
  Compensaciones: CircleDollarSign,
  Configuración: Settings,
  Soporte: LifeBuoy,
  Disciplina: AlertTriangle,
  Vacaciones: Umbrella,
  Organización: Building2,
  Programación: CalendarClock,
};

const HOME_META = {
  groupLabel: null,
  label: 'Inicio',
  icon: House,
  tone: TONES.teal,
  known: true,
};

/** Metadatos visuales de una ruta: { groupLabel, label, icon, tone, known }. Siempre devuelve un icono. */
export function getModuleMeta(pathname) {
  if (pathname === '/' || pathname === '') return HOME_META;

  const group = menu.find((g) => g.children.some((c) => c.path === pathname));
  const item = group?.children.find((c) => c.path === pathname);

  const tone = TONES[GROUP_TONE[group?.label]] ?? TONES.teal;
  const icon =
    PATH_ICONS[pathname] ?? group?.icon ?? GROUP_FALLBACK_ICONS[group?.label] ?? FALLBACK_ICON;

  return {
    groupLabel: group?.label ?? null,
    label: item?.label ?? null,
    icon,
    tone,
    known: Boolean(group),
  };
}

/** Igual que getModuleMeta pero para la ruta actual (usar dentro del Router). */
export function useModuleMeta() {
  const { pathname } = useLocation();
  return getModuleMeta(pathname);
}
