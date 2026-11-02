import { useState } from 'react';
import { CalendarDays, FileDown, Hospital } from 'lucide-react';
import { descargarArchivo } from '../../api/descargas';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useOpciones } from '../../hooks/useOpciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import Select from '../../components/ui/Select';

const ANEXOS = [
  ['012', 'Nombrados y plazo fijo'],
  ['013', 'Destacados'],
  ['014', 'Contratados CAS'],
  ['015', 'Médicos residentes'],
  ['016', 'SERUMS e internos'],
];

/** Formatos oficiales del RIT: consolidados por condicion (Anexos 012 a 016), registro manual (017) y planilla de descuentos. */
export default function AnexosOficialesPage() {
  const { eessFijo } = useAlcanceDeEess();
  const [form, setForm] = useState({ periodo: '', eess: eessFijo ?? '', fecha: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');
  const { opciones: periodos } = useOpciones('/periodos-asistencia', { params: {}, sinOpcion: 'Elige el período', etiqueta: (p) => `${String(p.mes).padStart(2, '0')}/${p.anio} · ${p.estado}` });
  const { opciones: establecimientos } = useOpciones('/establecimientos', { sinOpcion: 'Elige el establecimiento' });

  async function bajar(ruta, params, nombre) {
    setError((await descargarArchivo(ruta, params, nombre)) ?? '');
  }
  const listo = Boolean(form.periodo && form.eess);

  return (
    <PageContainer>
      <PageHeader title="Anexos oficiales" subtitle="Formatos del RIT con las columnas y firmas del reglamento (Anexos 012 a 017)." />
      <Alert>{error}</Alert>
      <FormGrid>
        <Select form={form} setForm={setForm} name="periodo" label="Período" icon={CalendarDays} options={periodos} />
        {!eessFijo && <Select form={form} setForm={setForm} name="eess" label="Establecimiento" icon={Hospital} options={establecimientos} />}
      </FormGrid>
      <FormGrid>
        {ANEXOS.map(([numero, nombre]) => (
          <Button key={numero} variant="secondary" icon={FileDown} disabled={!listo} onClick={() => bajar(`/reportes/anexos/${numero}`, { periodo_asistencia_id: form.periodo, eess_id: form.eess }, `Anexo_${numero}.pdf`)}>
            Anexo {numero}: {nombre}
          </Button>
        ))}
        <Button variant="secondary" icon={FileDown} disabled={!form.periodo} onClick={() => bajar('/reportes/planilla-descuentos', { periodo_asistencia_id: form.periodo, ...(form.eess ? { eess_id: form.eess } : {}) }, 'Planilla_descuentos.pdf')}>
          Planilla de descuentos
        </Button>
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} name="fecha" label="Día del registro manual" icon={CalendarDays} type="date" />
        <Button variant="secondary" icon={FileDown} disabled={!form.eess} onClick={() => bajar('/reportes/anexos/017', { eess_id: form.eess, fecha: form.fecha }, 'Anexo_017.pdf')}>
          Anexo 017: registro de asistencia
        </Button>
      </FormGrid>
      <HelpText>Los consolidados salen de la asistencia calculada: revisa el período antes de imprimirlos para la firma.</HelpText>
    </PageContainer>
  );
}
