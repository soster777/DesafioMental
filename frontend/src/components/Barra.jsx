import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { IconoCarpa, IconoPergamino, IconoTrofeo, IconoPregunta, IconoUsuarios } from "./Iconos.jsx";

export default function Barra() {
  const { usuario, logout, mostrarMensaje } = useApp();
  const navigate = useNavigate();

  async function salir() {
    await logout();
    mostrarMensaje("Cerraste sesión.");
    navigate("/login");
  }

  const esAdmin = usuario && usuario.rol === "admin";
  const links = [{ a: "/menu", texto: "Menú", Icono: IconoCarpa }];
  // el admin solo prueba partidas, así que no tiene historial
  if (!esAdmin) {
    links.push({ a: "/historial", texto: "Historial", Icono: IconoPergamino });
  }
  links.push({ a: "/ranking", texto: "Ranking", Icono: IconoTrofeo });
  if (esAdmin) {
    links.push({ a: "/admin/preguntas", texto: "Preguntas", Icono: IconoPregunta });
    links.push({ a: "/admin/usuarios", texto: "Usuarios", Icono: IconoUsuarios });
  }

  return (
    <>
      <header className="barra">
        <h1>
          <Link to="/">Desafío Mental</Link>
        </h1>
        {usuario && (
          <nav className="nav">
            {links.map(({ a, texto }) => (
              <NavLink key={a} to={a} className="link-arriba">
                {texto}
              </NavLink>
            ))}
            <span>{usuario.usuario}</span>
            <button type="button" className="salir" onClick={salir}>
              Cerrar sesión
            </button>
          </nav>
        )}
      </header>

      {usuario && (
        <nav className="nav-inferior" aria-label="Secciones">
          {links.map(({ a, texto, Icono }) => (
            <NavLink key={a} to={a}>
              <Icono />
              <span>{texto}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
