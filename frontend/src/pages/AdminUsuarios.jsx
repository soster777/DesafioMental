import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";

export default function AdminUsuarios() {
  const { usuario: yo, mostrarMensaje } = useApp();
  const usuarios = useDatos("/usuarios");
  const lista = usuarios.datos || [];

  async function cambiarRol(usuario, rol) {
    try {
      await api.put("/usuarios/" + usuario.id + "/rol", { rol: rol });
      mostrarMensaje(usuario.usuario + " ahora es " + rol + ".", "exito");
      usuarios.recargar();
    } catch (error) {
      mostrarMensaje(error.message, "error");
    }
  }

  async function eliminar(usuario) {
    if (!confirm("¿Eliminar a " + usuario.usuario + " y todas sus partidas?")) {
      return;
    }
    try {
      await api.delete("/usuarios/" + usuario.id);
      mostrarMensaje("Usuario eliminado.", "exito");
      usuarios.recargar();
    } catch (error) {
      mostrarMensaje(error.message, "error");
    }
  }

  return (
    <section className="pantalla">
      <h2>Usuarios ({lista.length})</h2>
      {usuarios.cargando && <Cargando texto="Cargando usuarios..." />}
      {usuarios.error && <ErrorCarga texto={usuarios.error} onReintentar={usuarios.recargar} />}
      {lista.length > 0 && (
        <div className="tabla-scroll">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Partidas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => {
                const soyYo = u.id === yo.id;
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      {u.usuario}
                      {soyYo && " (vos)"}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <select value={u.rol} disabled={soyYo} onChange={(e) => cambiarRol(u, e.target.value)}>
                        <option value="usuario">usuario</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>{u.partidas === null ? "—" : u.partidas}</td>
                    <td>
                      <div className="celda-acciones">
                        <button type="button" className="secundario" disabled={soyYo} onClick={() => eliminar(u)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
