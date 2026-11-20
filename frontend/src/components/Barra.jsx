import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Barra() {
  const { usuario, logout, mostrarMensaje } = useApp();
  const navigate = useNavigate();

  async function salir() {
    await logout();
    mostrarMensaje("Cerraste sesión.");
    navigate("/login");
  }

  return (
    <header className="barra">
      <h1>
        <Link to="/">Desafío Mental</Link>
      </h1>
      {usuario && (
        <nav className="nav">
          <NavLink to="/menu">Menú</NavLink>
          <NavLink to="/historial">Historial</NavLink>
          <NavLink to="/ranking">Ranking</NavLink>
          {usuario.rol === "admin" && <NavLink to="/admin/preguntas">Preguntas</NavLink>}
          <span>{usuario.usuario}</span>
          <button type="button" className="salir" onClick={salir}>
            Cerrar sesión
          </button>
        </nav>
      )}
    </header>
  );
}
