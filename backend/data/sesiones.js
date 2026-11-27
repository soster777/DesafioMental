import { leerArchivo, guardarArchivo } from "./archivo.js";

// las sesiones se guardan como { token: nombreDeUsuario }

// String -> String
export async function obtenerUsuario(token) {
    const sesiones = await leerArchivo("sesiones");
    return sesiones[token];
}

// String -> String -> undefined
export async function crear(token, usuario) {
    const sesiones = await leerArchivo("sesiones");
    sesiones[token] = usuario;
    await guardarArchivo("sesiones", sesiones);
}

// String -> undefined
export async function eliminar(token) {
    const sesiones = await leerArchivo("sesiones");
    delete sesiones[token];
    await guardarArchivo("sesiones", sesiones);
}

// String -> undefined
export async function eliminarDelUsuario(usuario) {
    const sesiones = await leerArchivo("sesiones");
    for (const token in sesiones) {
        if (sesiones[token] === usuario) {
            delete sesiones[token];
        }
    }
    await guardarArchivo("sesiones", sesiones);
}
