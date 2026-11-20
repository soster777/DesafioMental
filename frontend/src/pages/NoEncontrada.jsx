import { Link } from "react-router-dom";
import { Candado, Esposas } from "../components/Recortes.jsx";

export default function NoEncontrada() {
  return (
    <section className="pantalla no-encontrada">
      <div className="no-encontrada-dibujos" aria-hidden="true">
        <span className="recorte-404 esposas"><Esposas /></span>
        <span className="numero-404">404</span>
        <span className="recorte-404 candado"><Candado /></span>
      </div>
      <h2>¡Esta página se escapó!</h2>
      <p className="globo-404">
        Ni las esposas ni el candado pudieron retenerla. La dirección que buscás no existe o se movió.
      </p>
      <Link to="/" className="boton-link">Volver a la función</Link>
    </section>
  );
}
