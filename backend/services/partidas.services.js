import * as partidasData from "../data/partidas.js";
import * as preguntasData from "../data/preguntas.js";
import { crearError } from "./error.js";
import { comoTexto } from "../logica/usuarios.js";
import {
    SEGUNDOS_POR_PREGUNTA,
    categoriasParaJugar,
    elegirPreguntas,
    crearPartida,
    preguntaActual,
    responder,
    quedanPreguntas,
    avanzar,
    finalizarPartida,
    paraElCliente,
} from "../logica/partida.js";
import { soloFinalizadas, filtrarHistorial, resumirHistorial } from "../logica/estadisticas.js";

// margen para los 2 segundos que el front muestra la respuesta y la demora de la red
const LIMITE_POR_PREGUNTA = (SEGUNDOS_POR_PREGUNTA + 5) * 1000;
const ESTADOS = ["todas", "completada", "abandonada"];

// String -> Usuario -> Partida
async function buscarPartida(id, usuario) {
    const partida = await partidasData.obtenerPorId(id);
    if (partida === undefined) {
        throw crearError(404, "No existe la partida.");
    }
    if (partida.usuario !== usuario.usuario) {
        throw crearError(403, "Esa partida es de otro usuario.");
    }
    return partida;
}

// Usuario -> Object -> { partidas: [Object], resumen: Object }
export async function obtenerHistorial(usuario, filtros) {
    const categoria = comoTexto(filtros.categoria) || "todas";
    const estado = comoTexto(filtros.estado) || "todas";
    if (!ESTADOS.includes(estado)) {
        throw crearError(400, "El estado tiene que ser todas, completada o abandonada.");
    }
    const mias = soloFinalizadas(await partidasData.obtenerDelUsuario(usuario.usuario));
    const filtradas = filtrarHistorial(mias, categoria, estado).map((p) => ({
        id: p.id,
        categoria: p.categoria,
        puntaje: p.puntaje,
        correctas: p.correctas,
        estado: p.estado,
        fin: p.fin,
    }));
    return { partidas: filtradas, resumen: resumirHistorial(mias) };
}

// Usuario -> Object -> Partida
export async function iniciarPartida(usuario, cuerpo) {
    const categoria = comoTexto(cuerpo.categoria);
    const cantidad = Number(cuerpo.cantidad);
    if (![5, 10].includes(cantidad)) {
        throw crearError(400, "La cantidad de preguntas tiene que ser 5 o 10.");
    }
    const banco = await preguntasData.obtenerTodas();
    if (!categoriasParaJugar(banco).includes(categoria)) {
        throw crearError(400, "La categoría elegida no existe.");
    }
    const preguntas = elegirPreguntas(banco, categoria, cantidad);
    if (preguntas === null) {
        throw crearError(400, "No hay suficientes preguntas de " + categoria + " para una partida de " + cantidad + ".");
    }

    // si el usuario dejó una partida colgada (cerró la pestaña), queda como abandonada
    for (const partida of await partidasData.obtenerDelUsuario(usuario.usuario)) {
        if (partida.estado === "en curso") {
            await partidasData.actualizar(partida.id, finalizarPartida(partida, "abandonada"));
        }
    }
    const nueva = await partidasData.crear(crearPartida(usuario.usuario, categoria, preguntas));
    return paraElCliente(nueva);
}

// String -> Usuario -> Partida
export async function obtenerPartida(id, usuario) {
    return paraElCliente(await buscarPartida(id, usuario));
}

// opcion: índice de la opción elegida, o null si se terminó el tiempo
// String -> Usuario -> Object -> { elegida: Number, correcta: Number, partida: Partida }
export async function responderPregunta(id, usuario, cuerpo) {
    const partida = await buscarPartida(id, usuario);
    if (partida.estado !== "en curso") {
        throw crearError(409, "La partida ya terminó.");
    }

    const pregunta = preguntaActual(partida);
    let opcion = cuerpo.opcion === null ? null : Number(cuerpo.opcion);
    if (opcion !== null && !(Number.isInteger(opcion) && opcion >= 0 && opcion < pregunta.opciones.length)) {
        throw crearError(400, "La opción elegida no es válida.");
    }
    // el tiempo lo controla el servidor: si se pasó, cuenta como sin responder
    if (Date.now() - partida.preguntaDesde > LIMITE_POR_PREGUNTA) {
        opcion = null;
    }

    let actualizada = responder(partida, opcion);
    if (quedanPreguntas(actualizada)) {
        actualizada = avanzar(actualizada);
    } else {
        actualizada = finalizarPartida(actualizada, "completada");
    }
    await partidasData.actualizar(actualizada.id, actualizada);

    return { elegida: opcion, correcta: pregunta.correcta, partida: paraElCliente(actualizada) };
}

// String -> Usuario -> Object -> Partida
export async function abandonarPartida(id, usuario, cuerpo) {
    const partida = await buscarPartida(id, usuario);
    if (cuerpo.estado !== "abandonada") {
        throw crearError(400, "Solo se puede cambiar el estado a abandonada.");
    }
    if (partida.estado !== "en curso") {
        throw crearError(409, "La partida ya terminó.");
    }
    const abandonada = finalizarPartida(partida, "abandonada");
    await partidasData.actualizar(abandonada.id, abandonada);
    return paraElCliente(abandonada);
}
