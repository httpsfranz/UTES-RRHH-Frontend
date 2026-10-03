import {
  Building2,
  Users,
  Clock,
  Fingerprint,
  Wallet,
  Settings,
  BarChart3,
  AlertTriangle,
  CalendarClock,
  Shield,
  FileText,
  LifeBuoy,
  Umbrella,
} from 'lucide-react';

// Una entrada por cada esquema de la base de datos (ver database/sql/V001__esquema_base.sql
// en UTES-RRHH-Backend). Cada "children" es una tabla de ese esquema que tiene sentido como
// pantalla propia de administracion. Las tablas puente/detalle que se gestionan DENTRO de otra
// pantalla (por ejemplo RolPermiso dentro de Rol, o HorarioDetalle dentro de Horario) no
// aparecen aqui como item de primer nivel a proposito.
export const menu = [
  {
    label: 'Organización',
    icon: Building2,
    children: [
      { label: 'Microredes', path: '/organizacion/microredes' },
      { label: 'Establecimientos de salud', path: '/organizacion/establecimientos' },
      { label: 'Tipos de establecimiento', path: '/organizacion/tipos-establecimiento' },
      { label: 'Responsables de EESS', path: '/organizacion/responsables' },
      { label: 'Tipos de responsabilidad', path: '/organizacion/tipos-responsabilidad' },
    ],
  },
  {
    label: 'Personal',
    icon: Users,
    children: [
      { label: 'Trabajadores', path: '/personal/trabajadores' },
      { label: 'Vínculos laborales', path: '/personal/vinculos-laborales' },
      { label: 'Asignación de horario', path: '/personal/asignacion-horario' },
      { label: 'Cargos', path: '/personal/cargos' },
      { label: 'Grupos ocupacionales', path: '/personal/grupos-ocupacionales' },
      { label: 'Profesiones', path: '/personal/profesiones' },
      { label: 'Colegiaturas', path: '/personal/colegiaturas' },
      { label: 'Tipos de colegiatura', path: '/personal/tipos-colegiatura' },
      { label: 'Condición laboral', path: '/personal/condicion-laboral' },
      { label: 'Régimen laboral', path: '/personal/regimen-laboral' },
      { label: 'Tipos de documento de identidad', path: '/personal/tipos-documento-identidad' },
    ],
  },
  {
    label: 'Asistencia',
    icon: Clock,
    children: [
      { label: 'Marcaciones', path: '/asistencia/marcaciones' },
      { label: 'Asistencia diaria', path: '/asistencia/asistencia-diaria' },
      { label: 'Ajustes de marcación', path: '/asistencia/ajustes' },
      { label: 'Carga manual de asistencia', path: '/asistencia/carga-manual' },
      { label: 'Justificación de faltas', path: '/asistencia/justificacion-faltas' },
      { label: 'Conceptos de justificación', path: '/asistencia/conceptos-justificacion' },
      { label: 'Estados de asistencia', path: '/asistencia/estados' },
    ],
  },
  {
    label: 'Biometría',
    icon: Fingerprint,
    children: [
      { label: 'Dispositivos de marcación', path: '/biometria/dispositivos' },
      { label: 'Métodos de marcación', path: '/biometria/metodos' },
      { label: 'Plantillas biométricas', path: '/biometria/plantillas' },
      { label: 'Autorizaciones de método', path: '/biometria/autorizaciones' },
      { label: 'Consentimientos', path: '/biometria/consentimientos' },
    ],
  },
  {
    label: 'Compensaciones',
    icon: Wallet,
    children: [
      { label: 'Compensación horaria', path: '/compensaciones/compensacion-horaria' },
      { label: 'Tipos de compensación', path: '/compensaciones/tipos-compensacion' },
      { label: 'Conceptos de descuento', path: '/compensaciones/conceptos-descuento' },
      { label: 'Liquidaciones de descuento', path: '/compensaciones/liquidaciones' },
    ],
  },
  {
    label: 'Configuración',
    icon: Settings,
    children: [
      { label: 'Turnos', path: '/configuracion/turnos' },
      { label: 'Horarios', path: '/configuracion/horarios' },
      { label: 'Tipos de jornada', path: '/configuracion/tipos-jornada' },
      { label: 'Parámetros de jornada', path: '/configuracion/parametros-jornada' },
      { label: 'Parámetros del sistema', path: '/configuracion/parametros-sistema' },
      { label: 'Tablas de tolerancia', path: '/configuracion/tablas-tolerancia' },
      { label: 'Tramos de tolerancia', path: '/configuracion/tramos-tolerancia' },
    ],
  },
  {
    label: 'Programación',
    icon: CalendarClock,
    children: [
      { label: 'Programación por período', path: '/programacion/periodos' },
      { label: 'Trabajadores programados', path: '/programacion/trabajadores' },
      { label: 'Turnos programados', path: '/programacion/turnos-programados' },
      { label: 'Cambios de turno', path: '/programacion/cambios-turno' },
      { label: 'Tipos de cambio de turno', path: '/programacion/tipos-cambio-turno' },
      { label: 'Tipos de período de programación', path: '/programacion/tipos-periodo' },
      { label: 'Carga de programación', path: '/programacion/carga' },
      { label: 'Informes de guardia comunitaria', path: '/programacion/guardia-comunitaria' },
    ],
  },
  {
    label: 'Solicitudes',
    icon: FileText,
    children: [
      { label: 'Papeletas', path: '/solicitudes/papeletas' },
      { label: 'Tipos de papeleta', path: '/solicitudes/tipos-papeleta' },
      { label: 'Motivos de papeleta', path: '/solicitudes/motivos-papeleta' },
      { label: 'Licencias', path: '/solicitudes/licencias' },
      { label: 'Tipos de licencia', path: '/solicitudes/tipos-licencia' },
      { label: 'Descansos médicos', path: '/solicitudes/descansos-medicos' },
      { label: 'Constatación domiciliaria', path: '/solicitudes/constatacion-domiciliaria' },
      { label: 'Ocurrencias de portería', path: '/solicitudes/ocurrencias-porteria' },
    ],
  },
  {
    label: 'Vacaciones',
    icon: Umbrella,
    children: [
      { label: 'Períodos vacacionales', path: '/vacaciones/periodos' },
      { label: 'Rol vacacional', path: '/vacaciones/rol' },
      { label: 'Goce vacacional', path: '/vacaciones/goce' },
    ],
  },
  {
    label: 'Disciplina',
    icon: AlertTriangle,
    children: [
      { label: 'Expedientes PAD', path: '/disciplina/expedientes-pad' },
      { label: 'Supervisiones inopinadas', path: '/disciplina/supervisiones' },
      { label: 'Tipos de falta disciplinaria', path: '/disciplina/tipos-falta' },
    ],
  },
  {
    label: 'Consolidación',
    icon: BarChart3,
    children: [
      { label: 'Períodos de asistencia', path: '/consolidacion/periodos-asistencia' },
      { label: 'Consolidado de asistencia', path: '/consolidacion/consolidado' },
    ],
  },
  {
    label: 'Seguridad',
    icon: Shield,
    children: [
      { label: 'Usuarios', path: '/seguridad/usuarios' },
      { label: 'Roles', path: '/seguridad/roles' },
      { label: 'Roles de usuario', path: '/seguridad/usuarios-roles' },
      { label: 'Ámbitos de usuario', path: '/seguridad/usuarios-ambitos' },
      { label: 'Permisos', path: '/seguridad/permisos' },
      { label: 'Sesiones de acceso', path: '/seguridad/sesiones' },
      { label: 'Auditoría', path: '/seguridad/auditoria' },
    ],
  },
  {
    label: 'Soporte',
    icon: LifeBuoy,
    children: [
      { label: 'Calendario no laborable', path: '/soporte/calendario-no-laborable' },
      { label: 'Documentos de sustento', path: '/soporte/documentos-sustento' },
      { label: 'Notificaciones', path: '/soporte/notificaciones' },
      { label: 'Logs de integración', path: '/soporte/logs-integracion' },
    ],
  },
];
