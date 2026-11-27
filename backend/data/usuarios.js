import { leerArchivo, guardarArchivo } from "./archivo.js";

// () -> [Usuario]
export async function obtenerTodos() {
    return await leerArchivo("usuarios");
}

// Number -> Usuario
export async function obtenerPorId(id) {
    const usuarios = await obtenerTodos();
    return usuarios.find((usuario) => usuario.id === id);
}

// String -> Usuario
export async function obtenerPorNombre(nombre) {
    const usuarios = await obtenerTodos();
    return usuarios.find((usuario) => usuario.usuario === nombre);
}

// Usuario -> Usuario
export async function crear(usuario) {
    const usuarios = await obtenerTodos();
    usuarios.push(usuario);
    await guardarArchivo("usuarios", usuarios);
    return usuario;
}

// Number -> Object -> Usuario
export async function actualizar(id, datos) {
    const usuarios = await obtenerTodos();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);
    if (indice === -1) {
        return null;
    }
    usuarios[indice] = { ...usuarios[indice], ...datos, id: id };
    await guardarArchivo("usuarios", usuarios);
    return usuarios[indice];
}

// Number -> Boolean
export async function eliminar(id) {
    const usuarios = await obtenerTodos();
    const quedan = usuarios.filter((usuario) => usuario.id !== id);
    if (quedan.length === usuarios.length) {
        return false;
    }
    await guardarArchivo("usuarios", quedan);
    return true;
}

// () -> Number
export async function obtenerProximoId() {
    const usuarios = await obtenerTodos();
    return usuarios.reduce((mayor, usuario) => Math.max(mayor, usuario.id), 0) + 1;
}
