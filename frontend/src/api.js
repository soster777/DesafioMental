const CLAVE_TOKEN = "dm_token";

// en el navegador solo queda el token de la sesión; todos los datos viven en el backend
export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token);
}

export function borrarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}

async function pedir(metodo, ruta, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  const token = obtenerToken();
  if (token !== null) {
    opciones.headers.Authorization = "Bearer " + token;
  }
  if (cuerpo !== undefined) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(cuerpo);
  }

  let respuesta;
  try {
    respuesta = await fetch("/api" + ruta, opciones);
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor.");
  }
  if (respuesta.status === 204) {
    return null;
  }
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const error = new Error((datos && datos.error) || "El servidor no respondió correctamente.");
    error.status = respuesta.status;
    error.errores = (datos && datos.errores) || [];
    throw error;
  }
  return datos;
}

export const api = {
  get: (ruta) => pedir("GET", ruta),
  post: (ruta, cuerpo = {}) => pedir("POST", ruta, cuerpo),
  put: (ruta, cuerpo) => pedir("PUT", ruta, cuerpo),
  patch: (ruta, cuerpo) => pedir("PATCH", ruta, cuerpo),
  delete: (ruta) => pedir("DELETE", ruta),
};
