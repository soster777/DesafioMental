import { comoTexto } from "./usuarios.js";
import { MEZCLADAS } from "./partida.js";

// Object -> { errores: [String], pregunta: Pregunta }
export function validarPregunta(datos) {
    const enunciado = comoTexto(datos.enunciado).trim();
    const categoria = comoTexto(datos.categoria).trim();
    let opciones = [];
    if (Array.isArray(datos.opciones)) {
        opciones = datos.opciones.map((opcion) => comoTexto(opcion).trim());
    }
    const correcta = Number(datos.correcta);
    const puntos = Number(datos.puntos);

    const errores = [];
    if (enunciado === "") {
        errores.push("El enunciado es obligatorio.");
    }
    if (categoria === "") {
        errores.push("La categoría es obligatoria.");
    } else if (categoria.toLowerCase() === MEZCLADAS.toLowerCase()) {
        // "Mezcladas" es el modo que junta todas, no puede ser la categoría de una pregunta
        errores.push("La categoría " + MEZCLADAS + " está reservada para las partidas mezcladas.");
    }
    if (opciones.length !== 4 || opciones.includes("")) {
        errores.push("Tiene que haber 4 opciones completas.");
    } else if (opciones.some((opcion, i) => opciones.indexOf(opcion) !== i)) {
        // si indexOf encuentra la opción en otra posición, es que está repetida
        errores.push("Las opciones no se pueden repetir.");
    }
    if (![0, 1, 2, 3].includes(correcta)) {
        errores.push("Elegí cuál es la opción correcta.");
    }
    if (![10, 20].includes(puntos)) {
        errores.push("El puntaje tiene que ser 10 o 20.");
    }

    return {
        errores: errores,
        pregunta: { categoria: categoria, enunciado: enunciado, opciones: opciones, correcta: correcta, puntos: puntos },
    };
}

// [Pregunta] -> Number
export function siguienteId(preguntas) {
    return preguntas.reduce((mayor, pregunta) => Math.max(mayor, pregunta.id), 0) + 1;
}
