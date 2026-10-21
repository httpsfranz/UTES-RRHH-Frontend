import GraficoBarras from './GraficoBarras';
import GraficoDona from './GraficoDona';
import GraficoLineas from './GraficoLineas';
import WidgetKpis from './WidgetKpis';
import WidgetLista from './WidgetLista';
import WidgetTareas from './WidgetTareas';

// Cada widget que manda el backend se dibuja segun su `tipo`; el panel no sabe de roles.
export default function Widget({ widget, alAgrupar }) {
  switch (widget.tipo) {
    case 'tareas':
      return <WidgetTareas titulo={widget.titulo} items={widget.items} vacio={widget.vacio} />;
    case 'kpis':
      return <WidgetKpis items={widget.items} />;
    case 'dona':
      return <GraficoDona titulo={widget.titulo} subtitulo={widget.subtitulo} segmentos={widget.segmentos} />;
    case 'lineas':
      return <GraficoLineas titulo={widget.titulo} subtitulo={widget.subtitulo} categorias={widget.categorias} titulos={widget.titulos} series={widget.series} agrupaciones={widget.agrupaciones} agrupacion={widget.agrupacion} alAgrupar={alAgrupar} />;
    case 'barras':
      return (
        <GraficoBarras
          titulo={widget.titulo}
          subtitulo={widget.subtitulo}
          categorias={widget.categorias}
          series={widget.series}
          horizontal={widget.horizontal}
          apiladas={widget.apiladas}
          normalizado={widget.normalizado}
        />
      );
    case 'lista':
      return <WidgetLista titulo={widget.titulo} columnas={widget.columnas} filas={widget.filas} vacio={widget.vacio} enlace={widget.enlace} total={widget.total} />;
    default:
      return null;
  }
}
