export default function Table({ columns, rows, getRowKey = (row) => row.id }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-page/60">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-line last:border-0 hover:bg-page/60">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-3 text-heading">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}