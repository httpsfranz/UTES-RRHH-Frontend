import { useSyncExternalStore } from 'react';

// Suscripcion a una media query (p. ej. '(max-width: 1023px)').
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
