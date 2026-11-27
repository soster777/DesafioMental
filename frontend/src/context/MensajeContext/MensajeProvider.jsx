import { createContext, useCallback, useRef, useState } from "react";

const MensajeContext = createContext(null);

export function MensajeProvider({ children }) {
  const [mensaje, setMensaje] = useState(null);
  const temporizador = useRef(null);

  const mostrarMensaje = useCallback((texto, tipo = "info") => {
    setMensaje({ texto: texto, tipo: tipo });
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setMensaje(null), 3500);
  }, []);

  return (
    <MensajeContext.Provider value={{ mensaje, mostrarMensaje }}>
      {children}
    </MensajeContext.Provider>
  );
}

export default MensajeContext;
