// Llamadas a la API de UTES-RRHH.
//  - Como dispositivo (marcar): cabeceras X-Dispositivo y X-Clave-Dispositivo, sin sesion de usuario.
//  - Como usuario de RRHH (registrar un rostro): login normal de UTES y token Bearer, solo mientras dura el registro.

export class ErrorDeApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

async function pedir(url, { metodo = 'GET', cabeceras = {}, cuerpo } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: { Accept: 'application/json', ...(cuerpo ? { 'Content-Type': 'application/json' } : {}), ...cabeceras },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorDeApi('Sin conexión con UTES. Revisa la red o la dirección de la API.', 0);
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const primero = datos.errors ? Object.values(datos.errors)[0]?.[0] : null;
    throw new ErrorDeApi(primero ?? datos.message ?? `Error ${respuesta.status}`, respuesta.status);
  }
  return datos;
}

export function comoDispositivo(config) {
  const cabeceras = { 'X-Dispositivo': config.dispositivo, 'X-Clave-Dispositivo': config.clave };
  return {
    estado: () => pedir(`${config.api}/marcador-facial/estado`, { cabeceras }),
    marcar: (descriptor) => pedir(`${config.api}/marcador-facial/marcar`, { metodo: 'POST', cabeceras, cuerpo: { descriptor } }),
  };
}

export async function iniciarSesion(api, usuario, password) {
  const { token, usuario: perfil } = await pedir(`${api}/auth/login`, { metodo: 'POST', cuerpo: { usuario, password } });
  const cabeceras = { Authorization: `Bearer ${token}` };
  return {
    nombre: perfil?.trabajador?.nombre_completo ?? perfil?.nombre ?? usuario,
    buscarTrabajador: (texto) => pedir(`${api}/trabajadores?estado=1&por_pagina=10&buscar=${encodeURIComponent(texto)}`, { cabeceras }).then((r) => r.data),
    consentimiento: (trabajadorId) =>
      pedir(`${api}/consentimientos-biometricos?vigente=1&trabajador_id=${trabajadorId}`, { cabeceras }).then((r) => r.data[0] ?? null),
    rostrosRegistrados: (trabajadorId) =>
      pedir(`${api}/plantillas-biometricas?tipo=ROSTRO&estado=1&trabajador_id=${trabajadorId}`, { cabeceras }).then((r) => r.data),
    guardarRostro: (trabajadorId, referencia) =>
      pedir(`${api}/plantillas-biometricas`, {
        metodo: 'POST',
        cabeceras,
        cuerpo: { TrabajadorId: trabajadorId, PlantillaBiometricaTipo: 'ROSTRO', PlantillaBiometricaReferencia: referencia },
      }),
    cerrar: () => pedir(`${api}/auth/logout`, { metodo: 'POST', cabeceras }).catch(() => null),
  };
}
