import { lazy, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, KeyRound, Network, ScrollText, ShieldCheck, UserCog, UserRound } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { tonoDeArea } from '../../nav/moduleIcons';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import ZonaDesplazable from '../../components/ui/ZonaDesplazable';
import GrupoDeCatalogos from '../../components/ui/GrupoDeCatalogos';
import TarjetaDeCatalogo from '../../components/ui/TarjetaDeCatalogo';
import ModalDePagina from '../../components/ui/ModalDePagina';

// Todo lo de Seguridad en un solo panel (como Configuracion > Catalogos): cada tarjeta abre su pantalla completa en un
// modal. `permiso` es el que hace falta para ver la tarjeta (ademas de SEGURIDAD_VER, que pide el panel).
const SECCIONES_DE_SEGURIDAD = [
  {
    titulo: 'Cuentas',
    items: [
      { id: 'usuarios', titulo: 'Usuarios', descripcion: 'Cuentas de acceso: crear, bloquear, desactivar y restablecer la clave.', icono: UserRound, pagina: lazy(() => import('./UsuarioPage')) },
      { id: 'roles-de-usuario', titulo: 'Roles de cada usuario', descripcion: 'Qué rol tiene cada cuenta y desde cuándo (quién lo asignó o revocó).', icono: UserCog, pagina: lazy(() => import('./UsuarioRolPage')) },
      { id: 'ambitos', titulo: 'Alcance de datos', descripcion: 'Qué microred o establecimiento ve cada usuario.', icono: Network, pagina: lazy(() => import('./UsuarioAmbitoPage')) },
    ],
  },
  {
    titulo: 'Roles y permisos',
    items: [
      { id: 'roles', titulo: 'Roles', descripcion: 'Roles por responsabilidad y los permisos de cada uno.', icono: ShieldCheck, pagina: lazy(() => import('./RolPage')) },
      { id: 'permisos', titulo: 'Permisos', descripcion: 'Catálogo de permisos del sistema (ver, editar, aprobar…).', icono: KeyRound, pagina: lazy(() => import('./PermisoPage')) },
    ],
  },
  {
    titulo: 'Control',
    items: [
      { id: 'sesiones', titulo: 'Sesiones de acceso', descripcion: 'Ingresos, intentos fallidos y sesiones abiertas (se pueden revocar).', icono: Clock, pagina: lazy(() => import('./SesionAccesoPage')) },
      { id: 'auditoria', titulo: 'Auditoría', descripcion: 'Quién creó, cambió o desactivó cada dato, y por qué.', icono: ScrollText, permiso: 'SEGURIDAD_AUDITORIA', pagina: lazy(() => import('./AuditoriaPage')) },
    ],
  },
];

/**
 * Seguridad: usuarios, roles, alcance, sesiones y auditoria en una sola pantalla. `?abrir=usuarios` abre una tarjeta
 * directamente (lo usan los enlaces de las notificaciones y las rutas antiguas de cada pantalla).
 */
export default function SeguridadPage() {
  const auth = useAuth();
  const [params, setParams] = useSearchParams();
  const secciones = SECCIONES_DE_SEGURIDAD.map((s) => ({ ...s, items: s.items.filter((i) => !i.permiso || auth.tiene(i.permiso)) })).filter((s) => s.items.length);
  const pedido = params.get('abrir');
  const [elegido, setElegido] = useState(null);
  const abierto = elegido ?? secciones.flatMap((s) => s.items).find((i) => i.id === pedido) ?? null;

  function cerrar() {
    setElegido(null);
    if (pedido) setParams({}, { replace: true });
  }

  return (
    <PageContainer>
      <PageHeader title="Seguridad" subtitle="Cuentas de usuario, roles, alcance de datos, sesiones y auditoría. Pulsa una tarjeta para administrarla." />
      <ZonaDesplazable>
        {secciones.map((seccion) => (
          <GrupoDeCatalogos key={seccion.titulo} titulo={seccion.titulo}>
            {seccion.items.map((item) => (
              <TarjetaDeCatalogo
                key={item.id}
                icono={item.icono}
                titulo={item.titulo}
                descripcion={item.descripcion}
                tono={tonoDeArea('Seguridad')}
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
