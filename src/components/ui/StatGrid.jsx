const COLUMNAS = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' };

export default function StatGrid({ children, columns = 4, className = '' }) {
  return <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${COLUMNAS[columns]} ${className}`}>{children}</div>;
}
