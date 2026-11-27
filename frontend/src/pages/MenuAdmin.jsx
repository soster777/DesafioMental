import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useDatos } from "../hooks/useDatos.js";
import { IconoCarpa } from "../components/Iconos.jsx";

export default function MenuAdmin() {
  const { usuario } = useAuth();
  const usuarios = useDatos("/usuarios");
  const preguntas = useDatos("/preguntas");

  const listaUsuarios = usuarios.datos || [];
  const jugadas = listaUsuarios.reduce((total, u) => total + (u.partidas || 0), 0);

  return (
    <section className="pantalla panel-admin">
      <p className="panel-sub">Panel de administración</p>
      <h2>Hola, {usuario.usuario}</h2>

      <ul className="panel-numeros">
        <li><strong>{usuarios.datos ? listaUsuarios.length : "—"}</strong><span>Usuarios</span></li>
        <li><strong>{preguntas.datos ? preguntas.datos.length : "—"}</strong><span>Preguntas</span></li>
        <li><strong>{usuarios.datos ? jugadas : "—"}</strong><span>Partidas jugadas</span></li>
      </ul>

      <Link to="/jugar" className="panel-probar">
        <IconoCarpa />
        <strong>Probar partida</strong>
        <span>No cuenta para el ranking.</span>
      </Link>
    </section>
  );
}
