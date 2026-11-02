import { lazy } from 'react';
import { Clock, ClipboardList, FileCheck, FileClock, HandHeart, HeartPulse, House, PenLine, PhoneCall } from 'lucide-react';
import PantallaConPestanas from '../../components/ui/PantallaConPestanas';
import { paginaDeRegistro } from '../registros/paginaDeRegistro';

// Todo lo que el jefe o RRHH registra a partir de un papel del trabajador, en una sola entrada del menu.
const PESTANAS = [
  { id: 'papeletas', etiqueta: 'Papeletas', icono: ClipboardList, permiso: 'SOLICITUDES_VER', pagina: lazy(() => import('./PapeletaPage')) },
  { id: 'justificaciones', etiqueta: 'Justificación de faltas', icono: FileCheck, permiso: 'ASISTENCIA_VER', pagina: lazy(() => import('../asistencia/JustificacionFaltaPage')) },
  { id: 'ajustes', etiqueta: 'Ajustes de marcación', icono: PenLine, permiso: 'ASISTENCIA_VER', pagina: lazy(() => import('../asistencia/AjusteMarcacionPage')) },
  { id: 'licencias', etiqueta: 'Licencias', icono: FileClock, permiso: 'SOLICITUDES_VER', pagina: lazy(() => import('./LicenciaPage')) },
  { id: 'descansos', etiqueta: 'Descansos médicos', icono: HeartPulse, permiso: 'SOLICITUDES_VER', pagina: lazy(() => import('./DescansoMedicoPage')) },
  { id: 'constataciones', etiqueta: 'Constatación domiciliaria', icono: House, permiso: 'SOLICITUDES_VER', pagina: lazy(() => import('./ConstatacionDomiciliariaPage')) },
  { id: 'avisos', etiqueta: 'Avisos de ausencia', icono: PhoneCall, permiso: 'ASISTENCIA_VER', pagina: paginaDeRegistro('avisos') },
  { id: 'ingresos', etiqueta: 'Ingreso autorizado', icono: Clock, permiso: 'ASISTENCIA_VER', pagina: paginaDeRegistro('ingresos') },
  { id: 'facilidades', etiqueta: 'Facilidad horaria', icono: HandHeart, permiso: 'ASISTENCIA_VER', pagina: paginaDeRegistro('facilidades') },
];

export default function RegistroDeSolicitudesPage() {
  return (
    <PantallaConPestanas
      titulo="Registrar solicitudes"
      subtitulo="Papeletas, justificaciones, ajustes, licencias y descansos que entrega el trabajador en papel. Se aprueban en la bandeja."
      pestanas={PESTANAS}
    />
  );
}
