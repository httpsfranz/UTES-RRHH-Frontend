import { Bell, FileText, Network, Users } from 'lucide-react';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import { ALCANCES_NOTIFICACION } from '../../utils/opciones';


// Regla de envio de un tipo de aviso: quienes lo reciben (el interesado y/o roles con ambito sobre el lugar del evento)
// y si ademas se envia por correo.
export default function TipoNotificacionForm({ form, setForm, errors }) {
  return (
    <>
      <Field form={form} setForm={setForm} errors={errors} name="TipoNotificacionNombre" label="Nombre" icon={Bell} required maxLength={150} />
      <Field form={form} setForm={setForm} errors={errors} name="TipoNotificacionDescripcion" label="Cuándo se envía" icon={FileText} maxLength={300} />
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="TipoNotificacionAlcance" label="Destinatarios" icon={Network} options={ALCANCES_NOTIFICACION} required />
        <Field form={form} setForm={setForm} errors={errors} name="TipoNotificacionRolesDestino" label="Roles (códigos separados por coma)" icon={Users} maxLength={300} filter="codigo" placeholder="RRHH_RED,RESP_EESS" />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoNotificacionAlInteresado" label="Avisar también a la persona interesada" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoNotificacionEnviaCorreo" label="Enviar además por correo electrónico" />
      <HelpText>Roles: ADMIN, RRHH_RED, JEFE_MICRORED, RESP_EESS, PROGRAMADOR, TRABAJADOR, PORTERIA. El correo se reintenta solo hasta 3 veces.</HelpText>
    </>
  );
}
