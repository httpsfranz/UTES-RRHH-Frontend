import { useMemo, useState } from 'react';
import { ListaContext } from './listaContext';

const META_INICIAL = { conEstado: false, soloTabla: true, defs: [] };

export default function ListaProvider({ children }) {
  // Por defecto solo lo vigente: lo deshabilitado se ve eligiendo "Vigente: No" (o "Todos").
  const [estado, setEstado] = useState('activos'); // 'todos' | 'activos' | 'inactivos'
  const [vista, setVista] = useState('auto'); // 'auto' | 'tarjetas' | 'tabla'
  const [valores, setValores] = useState({}); // filtros derivados de columnas: { [key]: valor }
  const [meta, setMeta] = useState(META_INICIAL);
  const [busqueda, setBusqueda] = useState('');

  const value = useMemo(
    () => ({ estado, setEstado, vista, setVista, valores, setValores, meta, setMeta, busqueda, setBusqueda }),
    [estado, vista, valores, meta, busqueda],
  );

  return <ListaContext.Provider value={value}>{children}</ListaContext.Provider>;
}
