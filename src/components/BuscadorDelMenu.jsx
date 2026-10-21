import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { menuPara } from '../nav/acceso';

const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// "Buscar en el sistema": encuentra una pantalla del menu por su nombre o su modulo y la abre.
export default function BuscadorDelMenu() {
  const auth = useAuth();
  const navegar = useNavigate();
  const [texto, setTexto] = useState('');
  const [indice, setIndice] = useState(0);
  const entrada = useRef(null);
  const opciones = useMemo(() => menuPara(auth).flatMap((g) => g.children.map((c) => ({ ...c, grupo: g.label }))), [auth]);
  const consulta = normalizar(texto.trim());
  const resultados = consulta ? opciones.filter((o) => normalizar(`${o.label} ${o.grupo} ${o.buscar ?? ''}`).includes(consulta)).slice(0, 8) : [];

  function ir(opcion) {
    setTexto('');
    entrada.current?.blur();
    navegar(opcion.path);
  }

  return (
    <div className="relative hidden md:block">
      <label className="flex w-64 items-center gap-2 rounded-xl border border-line bg-page/70 px-3.5 py-2 text-sm text-muted focus-within:border-brand focus-within:bg-surface">
        <Search size={16} className="shrink-0" />
        <input
          ref={entrada}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setIndice(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setIndice((i) => Math.min(i + 1, resultados.length - 1));
            if (e.key === 'ArrowUp') setIndice((i) => Math.max(i - 1, 0));
            if (e.key === 'Enter' && resultados[indice]) ir(resultados[indice]);
            if (e.key === 'Escape') setTexto('');
          }}
          placeholder="Buscar en el sistema…"
          aria-label="Buscar una pantalla del sistema"
          className="w-full bg-transparent text-heading outline-none placeholder:text-muted"
        />
      </label>
      {resultados.length > 0 && (
        <ul className="absolute left-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-surface py-1 shadow-[var(--shadow-pop)]">
          {resultados.map((r, i) => (
            <li key={r.path}>
              <button type="button" onMouseDown={() => ir(r)} className={`flex w-full flex-col px-4 py-2 text-left text-sm ${i === indice ? 'bg-page' : ''} hover:bg-page`}>
                <span className="font-medium text-heading">{r.label}</span>
                <span className="text-xs text-muted">{r.grupo}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
