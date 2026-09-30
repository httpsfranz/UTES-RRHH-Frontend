import Modal from '../Modal';
import Form from './Form';
import FormActions from './FormActions';

// Modal de crear/editar: titulo + <form> con el error general + Cancelar/Guardar.
// Los campos del recurso van como children (el <Entidad>Form de cada modulo).
export default function FormModal({ open, onClose, title, onSubmit, error, submitting, children }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <Form onSubmit={onSubmit} generalError={error}>
        {children}
        <FormActions onCancel={onClose} submitting={submitting} />
      </Form>
    </Modal>
  );
}
