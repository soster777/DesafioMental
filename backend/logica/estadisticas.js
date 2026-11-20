import { MEZCLADAS } from "./partida.js";

// [Partida] -> String -> [Partida]
export function partidasDelUsuario(partidas, usuario) {
    return partidas.filter((partida) => partida.usuario === usuario);
}

// [Partida] -> [Partida]
export function soloFinalizadas(partidas) {
    return partidas.filter((partida) => partida.estado !== "en curso");
}

// [Partida] -> [Partida]
function soloCompletadas(partidas) {
    return partidas.filter((partida) => partida.estado === "completada");
}

// [Partida] -> Object
export function estadisticasPersonales(partidas) {
    const completadas = soloCompletadas(partidas);
    const respondidas = partidas.reduce((total, partida) => total + partida.respuestas.length, 0);
    const correctas = partidas.reduce((total, partida) => total + partida.correctas, 0);
    const mejorPuntaje = completadas.reduce((mayor, partida) => {
        if (partida.puntaje > mayor) {
            return partida.puntaje;
        }
        return mayor;
    }, 0);
    const mejorRacha = partidas.reduce((mayor, partida) => {
        if (partida.mejorRacha > mayor) {
            return partida.mejorRacha;
        }
        return mayor;
    }, 0);

    let porcentaje = 0;
    if (respondidas > 0) {
        porcentaje = Math.round((correctas / respondidas) * 100);
    }

    return {
        completadas: completadas.length,
        respondidas: respondidas,
        porcentaje: porcentaje,
        mejorPuntaje: mejorPuntaje,
        mejorRacha: mejorRacha,
    };
}

// [Partida] -> String -> String -> [Partida]
export function filtrarHistorial(partidas, categoria, estado) {
    const filtradas = partidas.filter(
        (partida) =>
            (categoria === "todas" || partida.categoria === categoria) &&
            (estado === "todas" || partida.estado === estado)
    );
    return filtradas.sort((a, b) => b.fin - a.fin);
}

// Partida -> Partida -> Number
function compararRanking(a, b) {
    if (a.puntaje !== b.puntaje) {
        return b.puntaje - a.puntaje;
    }
    if (a.duracion !== b.duracion) {
        return a.duracion - b.duracion;
    }
    return a.fin - b.fin;
}

// [Partida] -> [Partida]
export function ranking(partidas) {
    return soloCompletadas(partidas).sort(compararRanking).slice(0, 10);
}

// [Partida] -> Object
export function resumirHistorial(partidas) {
    if (partidas.length == 0) {
        // caso base
        return { completadas: 0, abandonadas: 0, puntaje: 0 };
    } else {
        // caso recursivo
        const resto = resumirHistorial(partidas.slice(1));
        const primera = partidas[0];
        if (primera.estado === "completada") {
            return {
                completadas: resto.completadas + 1,
                abandonadas: resto.abandonadas,
                puntaje: resto.puntaje + primera.puntaje,
            };
        } else {
            return {
                completadas: resto.completadas,
                abandonadas: resto.abandonadas + 1,
                puntaje: resto.puntaje,
            };
        }
    }
}

// (a -> b) -> (c -> a) -> (c -> b)
function composite(f, g) {
    return (x) => f(g(x));
}

// [a -> a] -> (a -> a)
function compositeAll(listaFs) {
    if (listaFs.length == 0) {
        // caso base
        return (x) => x;
    } else {
        // caso recursivo
        return composite(listaFs[0], compositeAll(listaFs.slice(1)));
    }
}

// [Partida] -> [Respuesta]
function todasLasRespuestas(partidas) {
    return partidas.reduce((respuestas, partida) => [...respuestas, ...partida.respuestas], []);
}

// String -> ([Respuesta] -> [Respuesta])
function deLaCategoria(categoria) {
    return (respuestas) => respuestas.filter((respuesta) => respuesta.categoria === categoria);
}

// [Respuesta] -> [Boolean]
function aAciertos(respuestas) {
    return respuestas.map((respuesta) => respuesta.acerto);
}

// [Boolean] -> Number
function calcularPorcentaje(aciertos) {
    if (aciertos.length == 0) {
        return null;
    }
    const cantidadCorrectas = aciertos.filter((acierto) => acierto === true).length;
    return Math.round((cantidadCorrectas / aciertos.length) * 100);
}

// [Partida] -> String -> Number
export function porcentajePorCategoria(partidas, categoria) {
    if (categoria === MEZCLADAS) {
        // en una partida mezclada cada respuesta queda con la categoría de su pregunta,
        // así que acá filtro por partida y cuento todas sus respuestas
        const calcularMezcladas = compositeAll([calcularPorcentaje, aAciertos, todasLasRespuestas]);
        return calcularMezcladas(partidas.filter((partida) => partida.categoria === MEZCLADAS));
    }
    const calcular = compositeAll([calcularPorcentaje, aAciertos, deLaCategoria(categoria), todasLasRespuestas]);
    return calcular(partidas);
}
