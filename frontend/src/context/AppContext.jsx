import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api, obtenerToken, guardarToken, borrarToken } from "../api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const temporizadorMensaje = useRef(null);

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
    } catch {
      // aunque falle el servidor, la sesión se cierra igual en este navegador
    }
    borrarToken();
    setUsuario(null);
  }

  const mostrarMensaje = useCallback((texto, tipo = "info") => {
    setMensaje({ texto: texto, tipo: tipo });
    clearTimeout(temporizadorMensaje.current);
    temporizadorMensaje.current = setTimeout(() => setMensaje(null), 3500);
  }, []);

  return (
    <AppContext.Provider value={{ usuario, cargandoSesion, login, logout, mensaje, mostrarMensaje }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
