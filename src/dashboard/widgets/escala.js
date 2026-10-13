// Tope "redondo" del eje vertical (5, 10, 20, 50, 100...) para que las marcas de los graficos queden en numeros limpios.
export function topeDelEje(maximo) {
  if (maximo <= 5) return 5;
  const magnitud = 10 ** Math.floor(Math.log10(maximo));
  return Math.ceil(maximo / (magnitud / 2)) * (magnitud / 2);
}
