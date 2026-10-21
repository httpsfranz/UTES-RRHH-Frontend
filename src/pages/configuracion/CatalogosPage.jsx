import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { puedeVerArea } from '../../nav/acceso';
import { tonoDeArea } from '../../nav/moduleIcons';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import ZonaDesplazable from '../../components/ui/ZonaDesplazable';
import GrupoDeCatalogos from '../../components/ui/GrupoDeCatalogos';
import TarjetaDeCatalogo from '../../components/ui/TarjetaDeCatalogo';
import ModalDePagina from '../../components/ui/ModalDePagina';
import { CATALOGOS } from './catalogosConfig';

/**
 * Administracion > Configuracion: turnos, horarios, tolerancias, biometria, calendario no laborable y todos los catalogos
 * pequenos (tipos, motivos, estados, cargos...) en una sola pantalla. Cada tarjeta abre su administracion completa
 * (crear, editar, activar o deshabilitar) en un modal, sin salir de aqui. `?abrir=id` abre una tarjeta directamente (lo
 * usan las rutas antiguas de cada pantalla).
 */
export default function CatalogosPage() {
  const auth = useAuth();
  const [params, setParams] = useSearchParams();
  const [elegido, setElegido] = useState(null);
  const grupos = CATALOGOS.filter((grupo) => puedeVerArea(auth, grupo.area))
    .map((grupo) => ({ ...grupo, items: grupo.items.filter((item) => !item.permiso || auth.tiene(item.permiso)) }))
    .filter((grupo) => grupo.items.length > 0);
  const pedido = params.get('abrir');
  const abierto = elegido ?? grupos.flatMap((g) => g.items).find((i) => i.id === pedido) ?? null;

  function cerrar() {
    setElegido(null);
    if (pedido) setParams({}, { replace: true });
  }

  return (
    <PageContainer>
      <PageHeader title="Configuración" subtitle="Turnos, horarios, tolerancias, biometría y las listas que usan los formularios. Pulsa una tarjeta para administrarla." />

      <ZonaDesplazable>
        {grupos.map((grupo) => (
          <GrupoDeCatalogos key={grupo.titulo ?? grupo.area} titulo={grupo.titulo ?? grupo.area}>
            {grupo.items.map((item) => (
              <TarjetaDeCatalogo
                key={item.id}
                icono={item.icono}
                titulo={item.titulo}
                descripcion={item.descripcion}
                tono={tonoDeArea(grupo.area)}
                onClick={() => setElegido(item)}
              />
            ))}
          </GrupoDeCatalogos>
        ))}
      </ZonaDesplazable>

      <ModalDePagina abierto={Boolean(abierto)} onClose={cerrar} titulo={abierto?.titulo} pagina={abierto?.pagina} />
    </PageContainer>
  );
}
