// Texto de ayuda breve bajo un titulo o encima de un grupo de campos.
export default function HelpText({ children }) {
  return <p className="text-xs text-muted">{children}</p>;
}
