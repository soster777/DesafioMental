import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { IconoCarpa, IconoPergamino, IconoTrofeo, IconoPregunta } from "./Iconos.jsx";

export default function Barra() {
  const { usuario, logout, mostrarMensaje } = useApp();
  const navigate = useNavigate();

  async function salir() {
    await logout();
    mostrarMensaje("Cerraste sesión.");
    navigate("/login");
  }

  const links = [
    { a: "/menu", texto: "Menú", Icono: IconoCarpa },
    { a: "/historial", texto: "Historial", Icono: IconoPergamino },
    { a: "/ranking", texto: "Ranking", Icono: IconoTrofeo },
  ];
  if (usuario && usuario.rol === "admin") {
    links.push({ a: "/admin/preguntas", texto: "Preguntas", Icono: IconoPregunta });
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
