import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <section className="pantalla">
      <h2>Página no encontrada</h2>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </section>
  );
}
