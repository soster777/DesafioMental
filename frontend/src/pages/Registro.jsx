import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useMensaje } from "../hooks/useMensaje.jsx";
import Errores from "../components/Errores.jsx";

export default function Registro() {
  const { mostrarMensaje } = useMensaje();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: "", email: "", clave: "", confirmacion: "" });
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // un solo manejador para todos los inputs: usa el name del input como clave
  function cambiar(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function manejarSubmit(event) {
    event.preventDefault();
    setEnviando(true);
    try {
      await api.post("/auth/registro", form);
      mostrarMensaje("Cuenta creada. Ya podés iniciar sesión.", "exito");
      navigate("/login");
    } catch (error) {
      setErrores(error.errores.length > 0 ? error.errores : [error.message]);
      setEnviando(false);
    }
  }

  return (
    <section className="pantalla">
      <h2>Crear cuenta</h2>
      <form onSubmit={manejarSubmit} noValidate>
        <label>
          Nombre de usuario
          <input name="usuario" type="text" autoComplete="username" value={form.usuario} onChange={cambiar} />
        </label>
        <label>
          Correo electrónico
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={cambiar} />
        </label>
        <label>
          Contraseña
          <input name="clave" type="password" autoComplete="new-password" value={form.clave} onChange={cambiar} />
        </label>
        <label>
          Confirmar contraseña
          <input name="confirmacion" type="password" autoComplete="new-password" value={form.confirmacion} onChange={cambiar} />
        </label>
        <Errores errores={errores} />
        <button type="submit" disabled={enviando}>
          Registrarme
        </button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </section>
  );
}
