import { createContext, useEffect, useState } from "react";
import { api, obtenerToken, guardarToken, borrarToken } from "../../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // al abrir la app, si hay un token guardado le pregunto al backend de quién es
  useEffect(() => {
    if (obtenerToken() === null) {
      setCargandoSesion(false);
      return;
    }
    api
      .get("/auth/yo")
      .then(setUsuario)
      .catch((error) => {
        if (error.status === 401) {
          borrarToken();
        }
      })
      .finally(() => setCargandoSesion(false));
  }, []);

  async function login(nombre, clave) {
    const respuesta = await api.post("/auth/login", { usuario: nombre, clave: clave });
    guardarToken(respuesta.token);
    setUsuario(respuesta.usuario);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // aunque falle el servidor, la sesión se cierra igual en este navegador
    }
    borrarToken();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargandoSesion, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
