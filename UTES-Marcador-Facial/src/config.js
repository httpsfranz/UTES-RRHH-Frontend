// Configuracion del kiosco, guardada en este navegador: a que API se conecta y con que dispositivo de UTES se identifica.
// La clave se obtiene en el servidor con `php artisan biometria:clave-dispositivo CODIGO`.
const CLAVE = 'marcador-facial.config';

export function leerConfig() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
    if (guardada?.api && guardada?.dispositivo && guardada?.clave) return guardada;
  } catch {
    // configuracion ilegible: se vuelve a pedir
  }
  return null;
}

export function guardarConfig({ api, dispositivo, clave }) {
  const config = { api: api.trim().replace(/\/+$/, ''), dispositivo: dispositivo.trim().toUpperCase(), clave: clave.trim() };
  localStorage.setItem(CLAVE, JSON.stringify(config));
  return config;
}

export function borrarConfig() {
  localStorage.removeItem(CLAVE);
}

export const API_POR_DEFECTO = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
