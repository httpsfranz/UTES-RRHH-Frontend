import { CalendarClock, Clock, FileCheck2, Settings, Users } from 'lucide-react';

// Menu por TAREA, no por tabla: cada entrada es algo que el usuario hace (marcar, aprobar, programar, cerrar el mes...).
// Las pantallas de una misma tarea van como pestanas de una sola entrada (Registrar solicitudes, Cambios y ausencias,
// Consolidado y descuentos, Disciplina) y todo lo que se configura vive en Administracion > Configuracion (un modal por
// tarjeta). `oculto`: tiene ruta pero no entrada (se abre desde la campana o el menu de usuario). `buscar`: lo que hay
// dentro (pestanas, tarjetas) para que "Buscar en el sistema" lo encuentre.
// Las rutas anteriores siguen funcionando: routes.jsx las redirige a su entrada nueva (RUTAS_ANTERIORES).
export const menu = [
  {
    label: 'Día a día',
    icon: Clock,
    children: [
      { label: 'Control de asistencia', path: '/asistencia/asistencia-diaria', buscar: 'marcar entrada salida calendario historial de marcaciones' },
      { label: 'Bandeja de solicitudes', path: '/solicitudes/bandeja', buscar: 'aprobar rechazar pendientes mis solicitudes' },
      { label: 'Registrar solicitudes', path: '/solicitudes/registro', buscar: 'papeletas justificación de faltas ajustes de marcación licencias descansos médicos constatación domiciliaria' },
      { label: 'Ocurrencias de portería', path: '/solicitudes/ocurrencias-porteria' },
    ],
  },
  {
    label: 'Programación',
    icon: CalendarClock,
    children: [
      { label: 'Programación del mes', path: '/programacion/mensual', buscar: 'turnos programados grilla publicar' },
      { label: 'Cambios y ausencias', path: '/programacion/gestion', buscar: 'cambios de turno guardias comunitarias calendario de ausencias programaciones registradas' },
    ],
  },
  {
    label: 'Personal',
    icon: Users,
    children: [
      { label: 'Trabajadores', path: '/personal/trabajadores', buscar: 'personal vínculos laborales horarios asignados ficha' },
      { label: 'Vacaciones', path: '/vacaciones/gestion', buscar: 'vacaciones del personal récord rol vacacional goce' },
    ],
  },
  {
    label: 'Fin de mes',
    icon: FileCheck2,
    children: [
      { label: 'Cierre del mes', path: '/consolidacion/cierre', buscar: 'cerrar período conformidad' },
      { label: 'Consolidado y descuentos', path: '/consolidacion/gestion', buscar: 'consolidado liquidaciones compensación horaria horas detectadas períodos de asistencia' },
      { label: 'Disciplina', path: '/disciplina/gestion', buscar: 'expedientes pad supervisiones inopinadas' },
    ],
  },
  {
    label: 'Administración',
    icon: Settings,
    children: [
      { label: 'Organización', path: '/organizacion/red', buscar: 'microredes establecimientos responsables' },
      { label: 'Configuración', path: '/configuracion/panel', buscar: 'catálogos turnos horarios tolerancias parámetros biometría calendario no laborable feriados documentos logs cargos' },
      { label: 'Seguridad', path: '/seguridad/panel', buscar: 'usuarios roles permisos sesiones auditoría' },
      { label: 'Notificaciones', path: '/soporte/notificaciones', oculto: true },
    ],
  },
];
