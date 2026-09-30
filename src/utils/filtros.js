// Filtros de entrada: limpian lo que el usuario escribe MIENTRAS escribe, para que ni siquiera
// pueda teclear caracteres invalidos (letras en un telefono, espacios en un codigo).
// Es comodidad de usuario; el backend valida igual.

const FILTROS = {
  // Solo digitos (telefono, ubigeo, DNI, enteros sin signo).
  digitos: (valor) => valor.replace(/\D/g, ''),
  // Codigos de catalogo: mayusculas, sin espacios, solo letras/numeros y - _ . :
  codigo: (valor) => valor.toUpperCase().replace(/[^A-Z0-9_.:-]/g, ''),
  // Direccion IP v4/v6.
  ip: (valor) => valor.replace(/[^0-9a-fA-F.:]/g, ''),
};

export function aplicarFiltro(nombre, valor) {
  const filtro = FILTROS[nombre];
  return filtro ? filtro(valor) : valor;
}
