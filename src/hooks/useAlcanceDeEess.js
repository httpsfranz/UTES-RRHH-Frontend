import { useAuth } from '../auth/useAuth';

// Que establecimientos puede elegir quien consulta, segun su sesion:
//   - ambito global (administrador, RRHH de la Red)  -> { puedeElegir: true,  eessFijo: null }
//   - un solo establecimiento                          -> { puedeElegir: false, eessFijo: <id> }
//   - varios (jefe de microred)                        -> { puedeElegir: true,  eessFijo: null } y el selector solo ofrece los suyos
// El backend aplica la misma regla (App\Support\AlcanceDeEess); esto solo decide que se muestra.
export function useAlcanceDeEess() {
  const { alcance } = useAuth();
  const ids = alcance.global ? null : (alcance.eess_ids ?? []);
  const unico = ids !== null && ids.length === 1;

  return { puedeElegir: !unico, eessFijo: unico ? String(ids[0]) : null, eessPermitidos: ids };
}