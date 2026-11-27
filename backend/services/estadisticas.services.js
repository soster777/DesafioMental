import * as partidasData from "../data/partidas.js";
import * as usuariosData from "../data/usuarios.js";
import { soloFinalizadas, estadisticasPersonales, porcentajePorCategoria, ranking } from "../logica/estadisticas.js";

// Usuario -> [Partida]
async function partidasTerminadas(usuario) {
    return soloFinalizadas(await partidasData.obtenerDelUsuario(usuario.usuario));
}

// Usuario -> Object
export async function obtenerEstadisticas(usuario) {
    return estadisticasPersonales(await partidasTerminadas(usuario));
}

// Usuario -> String -> { categoria: String, porcentaje: Number }
export async function obtenerPorcentaje(usuario, categoria) {
    return { categoria: categoria, porcentaje: porcentajePorCategoria(await partidasTerminadas(usuario), categoria) };
}

// String -> [Object]
export async function obtenerRanking(categoria) {
    // las partidas de prueba de los admins no compiten
    const admins = (await usuariosData.obtenerTodos()).filter((u) => u.rol === "admin").map((u) => u.usuario);
    let partidas = (await partidasData.obtenerTodas()).filter((p) => !admins.includes(p.usuario));
    if (categoria) {
        partidas = partidas.filter((p) => p.categoria === categoria);
    }
    return ranking(partidas).map((p) => ({
        id: p.id,
        usuario: p.usuario,
        puntaje: p.puntaje,
        categoria: p.categoria,
        duracion: p.duracion,
        fin: p.fin,
    }));
}
