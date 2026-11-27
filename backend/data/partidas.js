import { leerArchivo, guardarArchivo } from "./archivo.js";

// () -> [Partida]
export async function obtenerTodas() {
    return await leerArchivo("partidas");
}

// String -> Partida
export async function obtenerPorId(id) {
    const partidas = await obtenerTodas();
    return partidas.find((partida) => partida.id === id);
}

// String -> [Partida]
export async function obtenerDelUsuario(usuario) {
    const partidas = await obtenerTodas();
    return partidas.filter((partida) => partida.usuario === usuario);
}

// Partida -> Partida
export async function crear(partida) {
    const partidas = await obtenerTodas();
    partidas.push(partida);
    await guardarArchivo("partidas", partidas);
    return partida;
}

// String -> Partida -> Partida
export async function actualizar(id, partida) {
    const partidas = await obtenerTodas();
    const indice = partidas.findIndex((p) => p.id === id);
    if (indice === -1) {
        return null;
    }
    partidas[indice] = { ...partida, id: id };
    await guardarArchivo("partidas", partidas);
    return partidas[indice];
}

// String -> undefined
export async function eliminarDelUsuario(usuario) {
    const partidas = await obtenerTodas();
    await guardarArchivo("partidas", partidas.filter((partida) => partida.usuario !== usuario));
}
