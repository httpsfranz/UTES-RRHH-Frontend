import axios from 'axios';

const CLAVE_TOKEN = 'utes.token';

// El token de sesion se guarda en este navegador (puede no estar disponible: entonces la sesion dura lo que la pestana).
let tokenEnMemoria = null;

export function leerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN) ?? tokenEnMemoria;
  } catch {
    return tokenEnMemoria;
  }
}

export function guardarToken(token) {
  tokenEnMemoria = token;
  try {
    if (token) localStorage.setItem(CLAVE_TOKEN, token);
    else localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    // sin almacenamiento: la sesion queda solo en memoria
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el backend dice que la sesion ya no vale (token vencido o cerrado en otro lado), se avisa para volver al login.
// El login mismo responde 401 con "usuario o contrasena incorrectos": ese no cierra nada.
export const EVENTO_SESION_VENCIDA = 'utes:sesion-vencida';

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.includes('auth/login') && leerToken()) {
      guardarToken(null);
      window.dispatchEvent(new Event(EVENTO_SESION_VENCIDA));
    }
    return Promise.reject(error);
  },
);
