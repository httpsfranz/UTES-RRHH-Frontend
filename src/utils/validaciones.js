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
