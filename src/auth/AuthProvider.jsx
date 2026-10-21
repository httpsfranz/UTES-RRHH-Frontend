import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, EVENTO_SESION_VENCIDA, guardarToken, leerToken } from '../api/client';
import { mensajeDeError } from '../api/paginado';
import { limpiarCacheDeOpciones } from '../api/cacheDeOpciones';
import { AuthContext } from './authContext';

// La verificacion del token en curso se comparte: el doble montaje de React en desarrollo no la repite.
let verificacion = null;
const verificarSesion = () => {
  verificacion ??= api.get('/auth/me').finally(() => {
    verificacion = null;
  });
  return verificacion;
};

const SIN_SESION = { usuario: null, roles: [], permisos: [], alcance: { global: false, propio: false, eess_ids: [] } };

/**
 * Sesion del usuario: quien es, sus roles, permisos y alcance (los entrega GET /auth/me; el backend aplica las mismas
 * reglas, esto solo decide que se muestra). `cargando` es true mientras se valida el token guardado al abrir la pagina.
 */
export default function AuthProvider({ children }) {
  const [perfil, setPerfil] = useState(SIN_SESION);
  const [cargando, setCargando] = useState(() => Boolean(leerToken()));

  const cerrarLocal = useCallback(() => {
    guardarToken(null);
    limpiarCacheDeOpciones();
    setPerfil(SIN_SESION);
  }, []);

  useEffect(() => {
    let vigente = true;
    if (leerToken()) {
      verificarSesion()
        .then(({ data }) => vigente && setPerfil(data))
        .catch(() => vigente && cerrarLocal())
        .finally(() => vigente && setCargando(false));
    }
    const alVencer = () => {
      limpiarCacheDeOpciones();
      setPerfil(SIN_SESION);
    };
    window.addEventListener(EVENTO_SESION_VENCIDA, alVencer);
    return () => {
      vigente = false;
      window.removeEventListener(EVENTO_SESION_VENCIDA, alVencer);
    };
  }, [cerrarLocal]);

  const iniciarSesion = useCallback(async (usuario, password) => {
    try {
      const { data } = await api.post('/auth/login', { usuario, password });
      guardarToken(data.token);
      limpiarCacheDeOpciones();
      setPerfil(data);
      return null;
    } catch (err) {
      if (!err.response) return 'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.';
      if (err.response.status === 429) return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
      return mensajeDeError(err) ?? 'No se pudo iniciar sesión.';
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // aunque el servidor no responda, la sesion local se cierra igual
    }
    cerrarLocal();
  }, [cerrarLocal]);

  // Tras cambiar la contrasena el backend devuelve el perfil actualizado (sin la obligacion de cambiarla).
  const actualizarPerfil = useCallback((datos) => setPerfil((actual) => ({ ...actual, ...datos })), []);

  const valor = useMemo(() => {
    const permisos = new Set(perfil.permisos);
    return {
      ...perfil,
      autenticado: perfil.usuario !== null,
      cargando,
      tiene: (permiso) => permisos.has(permiso),
      iniciarSesion,
      cerrarSesion,
      actualizarPerfil,
    };
  }, [perfil, cargando, iniciarSesion, cerrarSesion, actualizarPerfil]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
