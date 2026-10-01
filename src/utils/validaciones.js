// Validacion de usuario (rapida, sin ir al servidor). La validacion DEFINITIVA es la del
// backend (Form Request): estas reglas espejan las suyas para avisar antes de enviar, no
// las reemplazan. Si una regla cambia en Laravel, cambia tambien aqui.
//
// Una regla es (valor, form) => mensaje | null. Todas, salvo `requerido`, se omiten si el
// campo esta vacio: "opcional" significa que vacio es valido, no que no se valide lo escrito.

const esVacio = (valor) => valor === undefined || valor === null || String(valor).trim() === '';

export const requerido = (valor) => (esVacio(valor) ? 'Este campo es obligatorio.' : null);

export const codigo = (valor) =>
  /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(valor)
    ? null
    : 'Solo letras, números, guion (-), guion bajo (_), punto y dos puntos, sin espacios.';

// Telefono peruano: exactamente 9 digitos (sin espacios, guiones ni +51).
export const telefonoPeruano = (valor) =>
  /^\d{9}$/.test(valor) ? null : 'El teléfono debe tener exactamente 9 dígitos numéricos.';

// Ubigeo INEI: 6 digitos.
export const ubigeo = (valor) =>
  /^\d{6}$/.test(valor) ? null : 'El ubigeo debe tener exactamente 6 dígitos numéricos.';

// Nombres y apellidos: letras (con tildes y enie), espacios, punto, apostrofe y guion; nunca digitos ni simbolos.
export const nombrePersona = (valor) =>
  /^\p{L}[\p{L} .'-]*$/u.test(valor) ? null : 'Solo letras, espacios, punto, apóstrofe y guion.';

export const dni = (valor) =>
  /^\d{8}$/.test(valor) ? null : 'El DNI debe tener exactamente 8 dígitos numéricos.';

export const correo = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor) ? null : 'Ingresa un correo electrónico válido.';

export const ip = (valor) => {
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(valor);
  if (v4) return v4.slice(1).every((octeto) => Number(octeto) <= 255) ? null : 'Dirección IP inválida.';
  return /^[0-9a-fA-F:]+$/.test(valor) && valor.includes(':') ? null : 'Dirección IP inválida.';
};

export const entero =
  ({ min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) =>
  (valor) => {
    if (!/^-?\d+$/.test(String(valor))) return 'Debe ser un número entero.';
    const numero = Number(valor);
    return numero >= min && numero <= max ? null : `Debe estar entre ${min} y ${max}.`;
  };

// Fecha ISO (AAAA-MM-DD) que exista de verdad: rechaza 2026-02-31.
export const fecha = (valor) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!m) return 'Ingresa una fecha válida.';
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getFullYear() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3])
    ? null
    : 'Ingresa una fecha válida.';
};

// La fecha de este campo no puede ser anterior a la de otro campo del mismo form.
export const noAnteriorA = (otroCampo, mensaje) => (valor, form) =>
  !esVacio(form[otroCampo]) && valor < form[otroCampo] ? mensaje : null;

export const unoDe = (opciones, mensaje = 'Selecciona una opción válida.') => (valor) =>
  opciones.includes(valor) ? null : mensaje;

// Cantidad de exactamente N digitos (codigo RENIPRESS: 8).
export const digitosExactos = (cantidad, nombre) => (valor) =>
  new RegExp(`^\\d{${cantidad}}$`).test(valor) ? null : `${nombre} debe tener exactamente ${cantidad} dígitos numéricos.`;

// Numero con hasta 2 decimales dentro de un rango (DECIMAL(n,2) en SQL Server).
export const decimal =
  ({ min = 0, max = Number.MAX_SAFE_INTEGER } = {}) =>
  (valor) => {
    if (!/^\d+(\.\d{1,2})?$/.test(String(valor))) return 'Debe ser un número con hasta 2 decimales.';
    const numero = Number(valor);
    return numero >= min && numero <= max ? null : `Debe estar entre ${min} y ${max}.`;
  };

// Hora HH:MM de 24 horas.
export const hora = (valor) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(valor) ? null : 'Ingresa una hora válida (HH:MM).';

// El numero de este campo no puede ser menor que el de otro campo del mismo form.
export const noMenorQue = (otroCampo, mensaje) => (valor, form) =>
  !esVacio(form[otroCampo]) && Number(valor) < Number(form[otroCampo]) ? mensaje : null;

const aMinutos = (hhmm) => {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm ?? '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/**
 * RIT Art. 20: ningun turno puede durar mas de 12 horas continuas y una guardia dura exactamente 12.
 * Se aplica a la hora de salida; la duracion cruza la medianoche si salida <= entrada.
 */
export const duracionDeTurno = (campoEntrada, campoGuardia) => (valor, form) => {
  const entrada = aMinutos(form[campoEntrada]);
  const salida = aMinutos(valor);
  if (entrada === null || salida === null) return null;
  const duracion = salida > entrada ? salida - entrada : 1440 - (entrada - salida);
  if (duracion > 720) return 'El turno no puede durar más de 12 horas continuas (RIT, Art. 20).';
  if (form[campoGuardia] && duracion !== 720) return 'Una guardia dura exactamente 12 horas continuas (RIT, Art. 20).';
  return null;
};

/**
 * Numero de documento segun el tipo (espeja App\Rules\DocumentoIdentidad):
 *   DNI = 8 digitos; CE/PTP = digitos (9 hasta la longitud del tipo, 12 por defecto);
 *   resto = alfanumerico (6 hasta la longitud del tipo, 20 por defecto).
 * `tipo` es { codigo, longitud } o undefined si aun no se eligio tipo.
 */
export const documentoIdentidad = (tipo) => (valor) => {
  if (!tipo) return null;
  const codigoTipo = String(tipo.codigo).toUpperCase();
  if (codigoTipo === 'DNI') return /^\d{8}$/.test(valor) ? null : 'El DNI debe tener exactamente 8 dígitos numéricos.';
  if (codigoTipo === 'CE' || codigoTipo === 'PTP') {
    const maximo = Math.max(9, tipo.longitud ?? 12);
    return new RegExp(`^\\d{9,${maximo}}$`).test(valor) ? null : `El número de documento debe tener solo dígitos (entre 9 y ${maximo}).`;
  }
  const maximo = Math.max(6, tipo.longitud ?? 20);
  return new RegExp(`^[A-Za-z0-9]{6,${maximo}}$`).test(valor)
    ? null
    : `El número de documento debe ser alfanumérico (entre 6 y ${maximo} caracteres).`;
};

// Mayor de edad (18) y no mas de 100 anos, a partir de AAAA-MM-DD.
export const edadLaboral = (valor) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!m) return 'Ingresa una fecha válida.';
  const hoy = new Date();
  const nacimiento = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  if (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate())) edad -= 1;
  if (edad < 18) return 'El trabajador debe ser mayor de 18 años.';
  return edad > 100 ? 'La fecha de nacimiento no es válida.' : null;
};

/**
 * Arma la funcion validate(form) que espera useCrudResource.
 * Devuelve { campo: [mensaje] } (el mismo formato que los 422 de Laravel), o {} si todo esta bien.
 *
 *   validador({ MicroredCodigo: [requerido, codigo], MicroredTelefono: [telefonoPeruano] })
 */
export function validador(reglasPorCampo) {
  return (form) => {
    const errores = {};
    for (const [campo, reglas] of Object.entries(reglasPorCampo)) {
      const valor = form[campo];
      for (const regla of reglas) {
        if (regla !== requerido && esVacio(valor)) continue;
        const mensaje = regla(valor, form);
        if (mensaje) {
          errores[campo] = [mensaje];
          break;
        }
      }
    }
    return errores;
  };
}
