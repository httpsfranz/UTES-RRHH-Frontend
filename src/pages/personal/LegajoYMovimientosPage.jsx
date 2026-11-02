import { ArrowLeftRight, BadgeCheck, FileStack, UserRoundCheck } from 'lucide-react';
import PantallaConPestanas from '../../components/ui/PantallaConPestanas';
import { paginaDeRegistro } from '../registros/paginaDeRegistro';

const PESTANAS = [
  { id: 'legajo', etiqueta: 'Legajo', icono: FileStack, pagina: paginaDeRegistro('legajo') },
  { id: 'fotochecks', etiqueta: 'Fotochecks', icono: BadgeCheck, pagina: paginaDeRegistro('fotochecks') },
  { id: 'entregas', etiqueta: 'Entrega de cargo', icono: UserRoundCheck, pagina: paginaDeRegistro('entregas') },
  { id: 'desplazamientos', etiqueta: 'Desplazamientos', icono: ArrowLeftRight, pagina: paginaDeRegistro('desplazamientos') },
];

export default function LegajoYMovimientosPage() {
  return (
    <PantallaConPestanas titulo="Legajo y movimientos" subtitulo="Documentos del servidor, fotocheck, entrega de cargo y desplazamientos." pestanas={PESTANAS} />
  );
}
