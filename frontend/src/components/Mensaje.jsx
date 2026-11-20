import { useApp } from "../context/AppContext.jsx";

export default function Mensaje() {
  const { mensaje } = useApp();
  if (mensaje === null) {
    return null;
  }
  return (
    <div className={"mensaje " + mensaje.tipo} role="status">
      {mensaje.texto}
    </div>
  );
}
