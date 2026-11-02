import { lazy } from 'react';
import { Award, Gavel, SearchCheck } from 'lucide-react';
import PantallaConPestanas from '../../components/ui/PantallaConPestanas';
import { paginaDeRegistro } from '../registros/paginaDeRegistro';

const PESTANAS = [
  { id: 'pad', etiqueta: 'Expedientes PAD', icono: Gavel, pagina: lazy(() => import('./ExpedientePadPage')) },
  { id: 'supervisiones', etiqueta: 'Supervisiones inopinadas', icono: SearchCheck, pagina: lazy(() => import('./SupervisionInopinadaPage')) },
  { id: 'reconocimientos', etiqueta: 'Reconocimientos', icono: Award, pagina: paginaDeRegistro('reconocimientos') },
];

export default function DisciplinaPage() {
  return (
    <PantallaConPestanas
      titulo="Disciplina"
      subtitulo="Supervisiones inopinadas y procedimientos administrativos disciplinarios (Ley 30057; RIT, Art. 100 a 107)."
      pestanas={PESTANAS}
    />
  );
}
