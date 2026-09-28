import Alert from './Alert';

// Envoltorio del <form> del modal: el espaciado entre campos (space-y-4) y el
// error general (422 sin campo asociado, o el catch generico de guardar) viven
// aca una sola vez en vez de repetirse en cada Page.
export default function Form({ onSubmit, generalError, children }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Alert variant="text">{generalError}</Alert>
      {children}
    </form>
  );
}
