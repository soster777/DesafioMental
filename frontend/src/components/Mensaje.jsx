import { useMensaje } from "../hooks/useMensaje.jsx";

export default function Mensaje() {
  const { mensaje } = useMensaje();
  if (mensaje === null) {
    return null;
  }
  return (
    <div className={"mensaje " + mensaje.tipo} role="status">
      {mensaje.texto}
    </div>
  );
}
