import * as preguntasData from "../data/preguntas.js";
import { crearError } from "./error.js";
import { categoriasParaJugar } from "../logica/partida.js";
import { validarPregunta } from "../logica/preguntas.js";

// () -> [String]
export async function obtenerCategorias() {
    return categoriasParaJugar(await preguntasData.obtenerTodas());
}

// () -> [Pregunta]
export async function obtenerPreguntas() {
    return await preguntasData.obtenerTodas();
}

// Object -> Pregunta
export async function crearPregunta(datos) {
    const { errores, pregunta } = validarPregunta(datos);
    if (errores.length > 0) {
        throw crearError(400, "Revisá los datos de la pregunta.", errores);
    }
    return await preguntasData.crear({ id: await preguntasData.obtenerProximoId(), ...pregunta });
}

// String -> undefined
async function controlarQueExista(idTexto) {
    if ((await preguntasData.obtenerPorId(Number(idTexto))) === undefined) {
        throw crearError(404, "No existe la pregunta " + idTexto + ".");
    }
}

// String -> Object -> Pregunta
export async function actualizarPregunta(idTexto, datos) {
    await controlarQueExista(idTexto);
    const { errores, pregunta } = validarPregunta(datos);
    if (errores.length > 0) {
        throw crearError(400, "Revisá los datos de la pregunta.", errores);
    }
    return await preguntasData.actualizar(Number(idTexto), pregunta);
}

// String -> undefined
export async function eliminarPregunta(idTexto) {
    await controlarQueExista(idTexto);
    // las partidas guardan una copia de sus preguntas, así que borrar no rompe el historial
    await preguntasData.eliminar(Number(idTexto));
}
