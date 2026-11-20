import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import { IconoPregunta, IconoUsuarios, IconoTrofeo, IconoCarpa } from "../components/Iconos.jsx";

const ACCESOS = [
  { a: "/admin/preguntas", titulo: "Gestionar preguntas", texto: "Alta, edición y baja del banco.", Icono: IconoPregunta },
  { a: "/admin/usuarios", titulo: "Gestionar usuarios", texto: "Roles y bajas de cuentas.", Icono: IconoUsuarios },
  { a: "/ranking", titulo: "Ver ranking", texto: "Los mejores puntajes de los jugadores.", Icono: IconoTrofeo },
  { a: "/jugar", titulo: "Probar partida", texto: "No cuenta para el ranking.", Icono: IconoCarpa },
];

export default function MenuAdmin() {
  const { usuario } = useApp();
  const usuarios = useDatos("/usuarios");
  const preguntas = useDatos("/preguntas");

  const listaUsuarios = usuarios.datos || [];
  const jugadas = listaUsuarios.reduce((total, u) => total + u.partidas, 0);

  return (
    <section className="pantalla panel-admin">
      <p className="panel-sub">Panel de administración</p>
      <h2>Hola, {usuario.usuario}</h2>

      <ul className="panel-numeros">
        <li><strong>{usuarios.datos ? listaUsuarios.length : "—"}</strong><span>Usuarios</span></li>
        <li><strong>{preguntas.datos ? preguntas.datos.length : "—"}</strong><span>Preguntas</span></li>
        <li><strong>{usuarios.datos ? jugadas : "—"}</strong><span>Partidas jugadas</span></li>
      </ul>

      <nav className="panel-accesos">
        {ACCESOS.map(({ a, titulo, texto, Icono }) => (
          <Link key={a} to={a}>
            <Icono />
            <strong>{titulo}</strong>
            <span>{texto}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
