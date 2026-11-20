import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Errores from "../components/Errores.jsx";
import Boleto from "../components/Boleto.jsx";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(event) {
    event.preventDefault();
    if (usuario.trim() === "" || clave === "") {
      setErrores(["Completá todos los campos."]);
      return;
    }
    setEnviando(true);
    try {
      await login(usuario.trim(), clave);
      navigate("/menu");
    } catch (error) {
      setErrores([error.message]);
      setEnviando(false);
    }
  }

  return (
    <section className="pantalla">
      <Boleto />
      <h2>Iniciar sesión</h2>
      <form onSubmit={manejarSubmit} noValidate>
        <label>
          Nombre de usuario
          <input type="text" autoComplete="username" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} />
        </label>
        <Errores errores={errores} />
        <button type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </section>
  );
}
