import { leerArchivo, guardarArchivo } from "./archivo.js";

// () -> [Pregunta]
export async function obtenerTodas() {
    return await leerArchivo("preguntas");
}

// Number -> Pregunta
export async function obtenerPorId(id) {
    const preguntas = await obtenerTodas();
    return preguntas.find((pregunta) => pregunta.id === id);
}

// Pregunta -> Pregunta
export async function crear(pregunta) {
    const preguntas = await obtenerTodas();
    preguntas.push(pregunta);
    await guardarArchivo("preguntas", preguntas);
    return pregunta;
}

// Number -> Object -> Pregunta
export async function actualizar(id, datos) {
    const preguntas = await obtenerTodas();
    const indice = preguntas.findIndex((pregunta) => pregunta.id === id);
    if (indice === -1) {
        return null;
    }
    preguntas[indice] = { ...preguntas[indice], ...datos, id: id };
    await guardarArchivo("preguntas", preguntas);
    return preguntas[indice];
}

// Number -> Boolean
export async function eliminar(id) {
    const preguntas = await obtenerTodas();
    const quedan = preguntas.filter((pregunta) => pregunta.id !== id);
    if (quedan.length === preguntas.length) {
        return false;
    }
    await guardarArchivo("preguntas", quedan);
    return true;
}

// () -> Number
export async function obtenerProximoId() {
    const preguntas = await obtenerTodas();
    return preguntas.reduce((mayor, pregunta) => Math.max(mayor, pregunta.id), 0) + 1;
}
