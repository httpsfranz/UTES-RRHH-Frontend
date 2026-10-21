import { lazy } from 'react';
import {
  Activity,
  Archive,
  CalendarRange,
  CalendarX,
  Clock,
  Hourglass,
  ListChecks,
  Network,
  ScanFace,
  SlidersHorizontal,
  AlertOctagon,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  Fingerprint,
  GraduationCap,
  IdCard,
  Landmark,
  Layers,
  Percent,
  Repeat,
  Scale,
  ScrollText,
  Smartphone,
  Wallet,
} from 'lucide-react';

// Todo lo que se configura, agrupado por area. Cada tarjeta abre su pantalla completa en un modal (su Page embebida)
// desde Administracion > Configuracion; `area` decide el permiso del grupo (ver nav/acceso, puedeVerArea), `titulo` el
// nombre que se muestra y `permiso` (opcional, por tarjeta) uno propio.
export const CATALOGOS = [
  {
    area: 'Configuración',
    titulo: 'Jornada y tolerancias',
    items: [
      { id: 'turnos', titulo: 'Turnos', descripcion: 'Mañana, tarde, guardias… con su horario (RIT, Art. 16 y 20).', icono: Clock, pagina: lazy(() => import('./TurnoPage')) },
      { id: 'horarios', titulo: 'Horarios', descripcion: 'Horarios semanales fijos que se asignan a un trabajador.', icono: CalendarRange, pagina: lazy(() => import('./HorarioPage')) },
      { id: 'tipos-jornada', titulo: 'Tipos de jornada', descripcion: 'Jornada de 6 u 8 horas y sus reglas.', icono: Briefcase, pagina: lazy(() => import('./TipoJornadaPage')) },
      { id: 'parametros-jornada', titulo: 'Parámetros de jornada', descripcion: 'Horas por régimen y condición laboral.', icono: Hourglass, pagina: lazy(() => import('./ParametroJornadaPage')) },
      { id: 'parametros', titulo: 'Parámetros del sistema', descripcion: 'Plazos, límites y valores globales.', icono: SlidersHorizontal, pagina: lazy(() => import('./ParametroSistemaPage')) },
      { id: 'tablas-tolerancia', titulo: 'Tablas de tolerancia', descripcion: 'Escala de tardanza del RIT (Art. 22).', icono: ListChecks, pagina: lazy(() => import('./TablaToleranciaPage')) },
      { id: 'tramos-tolerancia', titulo: 'Tramos de tolerancia', descripcion: 'Minutos de cada tramo y cuánto descuentan.', icono: Percent, pagina: lazy(() => import('./TramoToleranciaPage')) },
    ],
  },
  {
    area: 'Personal',
    items: [
      { id: 'cargos', titulo: 'Cargos', descripcion: 'Cargos del personal y si son de jefatura.', icono: Briefcase, pagina: lazy(() => import('../personal/CargoPage')) },
      { id: 'grupos', titulo: 'Grupos ocupacionales', descripcion: 'Profesional, técnico, auxiliar… (agrupan los cargos).', icono: Layers, pagina: lazy(() => import('../personal/GrupoOcupacionalPage')) },
      { id: 'profesiones', titulo: 'Profesiones', descripcion: 'También se crean desde el trabajador con la opción "Otro".', icono: GraduationCap, pagina: lazy(() => import('../personal/ProfesionPage')) },
      { id: 'colegios', titulo: 'Colegios profesionales', descripcion: 'Tipos de colegiatura por profesión (CMP, CEP…).', icono: Award, pagina: lazy(() => import('../personal/ColegiaturaTipoPage')) },
      { id: 'condiciones', titulo: 'Condición laboral', descripcion: 'Nombrado, CAS, SERUMS, destacado… y si exige AIRHSP.', icono: ClipboardCheck, pagina: lazy(() => import('../personal/CondicionLaboralPage')) },
      { id: 'regimenes', titulo: 'Régimen laboral', descripcion: 'D. Leg. 276, 1057 (CAS), 728…', icono: Scale, pagina: lazy(() => import('../personal/RegimenLaboralPage')) },
      { id: 'documentos', titulo: 'Documentos de identidad', descripcion: 'La Red usa solo DNI; los demás quedan deshabilitados.', icono: IdCard, pagina: lazy(() => import('../personal/TipoDocumentoIdentidadPage')) },
    ],
  },
  {
    area: 'Organización',
    items: [
      { id: 'tipos-eess', titulo: 'Tipos de establecimiento', descripcion: 'Centro de salud, puesto de salud, CSMC, sede…', icono: Landmark, pagina: lazy(() => import('../organizacion/TipoEstablecimientoPage')) },
      { id: 'tipos-resp', titulo: 'Tipos de responsabilidad', descripcion: 'Jefe de EESS, responsable de control de asistencia…', icono: BadgeCheck, pagina: lazy(() => import('../organizacion/TipoResponsabilidadPage')) },
    ],
  },
  {
    area: 'Asistencia',
    items: [
      { id: 'estados', titulo: 'Estados de asistencia', descripcion: 'Asistió, tardanza, falta… y si descuentan (los calcula el sistema).', icono: Activity, pagina: lazy(() => import('../asistencia/EstadoAsistenciaPage')) },
      { id: 'conceptos', titulo: 'Conceptos de justificación', descripcion: 'Motivos válidos para justificar una falta.', icono: ScrollText, pagina: lazy(() => import('../asistencia/ConceptoJustificacionPage')) },
    ],
  },
  {
    area: 'Programación',
    items: [
      { id: 'tipos-cambio', titulo: 'Tipos de cambio de turno', descripcion: 'Permuta, reemplazo, reprogramación…', icono: Repeat, pagina: lazy(() => import('../programacion/TipoCambioTurnoPage')) },
      { id: 'tipos-periodo', titulo: 'Tipos de período', descripcion: 'Mensual o quincenal (RIT, Art. 16).', icono: CalendarDays, pagina: lazy(() => import('../programacion/TipoPeriodoProgramacionPage')) },
    ],
  },
  {
    area: 'Solicitudes',
    items: [
      { id: 'tipos-papeleta', titulo: 'Tipos de papeleta', descripcion: 'Comisión de servicio, permiso particular… y si descuentan.', icono: ClipboardList, pagina: lazy(() => import('../solicitudes/TipoPapeletaPage')) },
      { id: 'motivos-papeleta', titulo: 'Motivos de papeleta', descripcion: 'Motivos de salida dentro de cada tipo.', icono: ScrollText, pagina: lazy(() => import('../solicitudes/MotivoPapeletaPage')) },
      { id: 'tipos-licencia', titulo: 'Tipos de licencia', descripcion: 'Con o sin goce, días máximos y base legal (RIT, Art. 55).', icono: FileCheck2, pagina: lazy(() => import('../solicitudes/TipoLicenciaPage')) },
    ],
  },
  {
    area: 'Compensaciones',
    items: [
      { id: 'tipos-compensacion', titulo: 'Tipos de compensación', descripcion: 'Horas extra, guardia, día no laborable…', icono: Wallet, pagina: lazy(() => import('../compensaciones/TipoCompensacionPage')) },
      { id: 'conceptos-descuento', titulo: 'Conceptos de descuento', descripcion: 'Tardanza, inasistencia… usados en la liquidación.', icono: Percent, pagina: lazy(() => import('../compensaciones/ConceptoDescuentoPage')) },
    ],
  },
  {
    area: 'Disciplina',
    items: [
      { id: 'tipos-falta', titulo: 'Tipos de falta disciplinaria', descripcion: 'Leve, grave o muy grave, con su base legal.', icono: AlertOctagon, pagina: lazy(() => import('../disciplina/TipoFaltaDisciplinariaPage')) },
    ],
  },
  {
    area: 'Biometría',
    items: [
      { id: 'biometria', titulo: 'Administración biométrica', descripcion: 'Quién marca con rostro, quién está autorizado a marca manual y sus consentimientos.', icono: ScanFace, pagina: lazy(() => import('../biometria/BiometriaPage')) },
      { id: 'dispositivos', titulo: 'Dispositivos de marcación', descripcion: 'Relojes faciales por establecimiento (la marca manual no usa dispositivo).', icono: Smartphone, pagina: lazy(() => import('../biometria/DispositivoMarcacionPage')) },
      { id: 'metodos', titulo: 'Métodos de marcación', descripcion: 'Reconocimiento facial y registro manual (RIT, Art. 21).', icono: Fingerprint, pagina: lazy(() => import('../biometria/MetodoMarcacionPage')) },
    ],
  },
  {
    area: 'Soporte',
    items: [
      { id: 'calendario', titulo: 'Calendario no laborable', descripcion: 'Feriados y días no laborables de la Red o de una microred.', icono: CalendarX, pagina: lazy(() => import('../soporte/CalendarioNoLaborablePage')) },
      { id: 'documentos', titulo: 'Documentos de sustento', descripcion: 'Archivos adjuntos a solicitudes y designaciones.', icono: Archive, permiso: 'SOLICITUDES_VER', pagina: lazy(() => import('../soporte/DocumentoSustentoPage')) },
      { id: 'logs', titulo: 'Logs de integración', descripcion: 'Intercambios con RENIEC y los relojes biométricos.', icono: Network, permiso: 'SEGURIDAD_AUDITORIA', pagina: lazy(() => import('../soporte/LogIntegracionPage')) },
    ],
  },
];
