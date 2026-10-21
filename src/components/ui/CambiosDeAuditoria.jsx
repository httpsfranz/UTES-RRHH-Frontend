// Antes / despues de un registro de auditoria: una fila por campo que cambio (o que se creo o elimino).
const leer = (json) => {
  try {
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
};

const texto = (valor) => (valor === null || valor === undefined || valor === '' ? '—' : typeof valor === 'object' ? JSON.stringify(valor) : String(valor));

export default function CambiosDeAuditoria({ anteriores, nuevos }) {
  const antes = leer(anteriores);
  const despues = leer(nuevos);
  const campos = [...new Set([...Object.keys(antes), ...Object.keys(despues)])];
  if (campos.length === 0) return <p className="text-sm text-muted">Este evento no modificó datos de un registro.</p>;

  return (
    <div className="max-h-[50vh] overflow-auto rounded-2xl border border-line">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-page text-[10px] uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-3 py-2">Campo</th>
            <th className="px-3 py-2">Antes</th>
            <th className="px-3 py-2">Después</th>
          </tr>
        </thead>
        <tbody>
          {campos.map((campo) => (
            <tr key={campo} className="border-t border-line-soft align-top">
              <td className="px-3 py-1.5 font-medium text-heading">{campo}</td>
              <td className="px-3 py-1.5 text-rose-700">{texto(antes[campo])}</td>
              <td className="px-3 py-1.5 text-emerald-700">{texto(despues[campo])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
