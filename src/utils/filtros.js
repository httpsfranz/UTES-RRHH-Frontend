// Filtros de entrada: limpian lo que el usuario escribe MIENTRAS escribe, para que ni siquiera
// pueda teclear caracteres invalidos (letras en un telefono, espacios en un codigo).
// Es comodidad de usuario; el backend valida igual.

const FILTROS = {
  // Solo digitos (telefono, ubigeo, DNI, enteros sin signo).
  digitos: (valor) => valor.replace(/\D/g, ''),
  // Codigos de catalogo: mayusculas, sin espacios, solo letras/numeros y - _ . :
  codigo: (valor) => valor.toUpperCase().replace(/[^A-Z0-9_.:-]/g, ''),
  // Numero con hasta 2 decimales (horas, factores): un solo punto, sin signo.
  decimal: (valor) => {
    const limpio = valor.replace(',', '.').replace(/[^\d.]/g, '');
    const [entera, ...resto] = limpio.split('.');
    return resto.length ? `${entera}.${resto.join('').slice(0, 2)}` : entera;
  },
  // Documentos alfanumericos (pasaporte): mayusculas, solo letras y numeros.
  alfanumerico: (valor) => valor.toUpperCase().replace(/[^A-Z0-9]/g, ''),
  // Nombre de usuario de la cuenta: minusculas, numeros y . _ -
  usuario: (valor) => valor.toLowerCase().replace(/[^a-z0-9._-]/g, ''),
  // Direccion IP v4/v6.
  ip: (valor) => valor.replace(/[^0-9a-fA-F.:]/g, ''),
};

export function aplicarFiltro(nombre, valor) {
  const filtro = FILTROS[nombre];
  return filtro ? filtro(valor) : valor;
}
