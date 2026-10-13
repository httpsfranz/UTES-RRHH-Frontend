import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

/**
 * Autocompleta nombres y apellidos al escribir un DNI de 8 digitos (GET /consulta-dni/{dni}). Si el servicio externo no
 * esta configurado o no responde, el estado pasa a 'no_disponible' y el formulario se llena a mano como siempre.
 *
 *   activo       solo se consulta cuando el tipo de documento es DNI y se esta creando un trabajador
 *   dni          lo escrito en el campo
 *   alEncontrar  (datos) => void  recibe { nombres, apellido_paterno, apellido_materno }
 *
 * Estados: 'inactivo' | 'consultando' | 'encontrado' | 'no_encontrado' | 'no_disponible'. `yaRegistrado` avisa que ese DNI ya
 * es un trabajador del sistema.
 */
export function useConsultaDni({ activo, dni, alEncontrar }) {
  const [resultado, setResultado] = useState({ dni: null, estado: 'inactivo', yaRegistrado: false });
  const callback = useRef(alEncontrar);
  useEffect(() => {
    callback.current = alEncontrar;
  });

  const consultar = activo && /^\d{8}$/.test(dni);

  useEffect(() => {
    if (!consultar) return undefined;
    let vigente = true;
    api
      .get(`/consulta-dni/${dni}`)
      .then(({ data }) => {
        if (!vigente) return;
        if (data.encontrado) callback.current?.(data.datos);
        setResultado({ dni, estado: !data.disponible ? 'no_disponible' : data.encontrado ? 'encontrado' : 'no_encontrado', yaRegistrado: Boolean(data.existe_en_sistema) });
      })
      .catch(() => vigente && setResultado({ dni, estado: 'no_disponible', yaRegistrado: false }));
    return () => {
      vigente = false;
    };
  }, [consultar, dni]);

  if (!consultar) return { estado: 'inactivo', yaRegistrado: false };
  return resultado.dni === dni ? resultado : { estado: 'consultando', yaRegistrado: false };
}
