import { useEffect, useState } from "react";
import { api } from "../api.js";

// pide datos al backend y maneja los estados de carga y error
export function useDatos(ruta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // si la ruta cambia antes de que llegue la respuesta, la respuesta vieja se descarta
    let vigente = true;
    setCargando(true);
    setError(null);
    api
      .get(ruta)
      .then((respuesta) => {
        if (vigente) setDatos(respuesta);
      })
      .catch((e) => {
        if (vigente) setError(e.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [ruta, version]);

  return { datos, cargando, error, recargar: () => setVersion((v) => v + 1) };
}
