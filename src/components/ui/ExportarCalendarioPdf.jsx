import { useState } from 'react';
import { FileDown, ScrollText } from 'lucide-react';
import Button from './Button';
import Select from './Select';
import { ToolbarItem } from './Toolbar';

// El PDF sale siempre en horizontal; aqui solo se elige el tamaño de hoja.
const PAPELES = [
  { value: 'a4', label: 'A4' },
  { value: 'a3', label: 'A3' },
];

/**
 * Selector de papel y boton "Exportar PDF" de un calendario mensual. Va dentro de la Toolbar de cada pantalla con calendario
 * (Asistencia diaria, Calendario de programación, Ausencias y vacaciones), de modo que todas imprimen igual.
 *
 *   cal  resultado de useCalendarioAsistencia (calendario, exportando, exportarPdf)
 */
export default function ExportarCalendarioPdf({ cal }) {
  const [form, setForm] = useState({ Papel: 'a4' });
  return (
    <>
      <ToolbarItem ancho="sm">
        <Select form={form} setForm={setForm} name="Papel" label="Papel PDF" icon={ScrollText} options={PAPELES} />
      </ToolbarItem>
      <Button variant="secondary" icon={FileDown} disabled={!cal.calendario || cal.exportando} onClick={() => cal.exportarPdf(form.Papel)}>
        {cal.exportando ? 'Generando PDF…' : 'Exportar PDF'}
      </Button>
    </>
  );
}
