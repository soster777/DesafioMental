import crypto from "node:crypto";

export const SEGUNDOS_POR_PREGUNTA = 15;

// [Pregunta] -> [String]
// categoría especial: no la tiene ninguna pregunta, junta preguntas de todas
export const MEZCLADAS = "Mezcladas";

// [Pregunta] -> [String] con las categorías para jugar: las reales más "Mezcladas"
export function categoriasParaJugar(banco) {
    return [...categoriasDe(banco), MEZCLADAS];
}

export function categoriasDe(banco) {
    return banco.reduce((categorias, pregunta) => {
        if (categorias.includes(pregunta.categoria)) {
            return categorias;
        }
        return [...categorias, pregunta.categoria];
    }, []);
}

// [a] -> [a]
function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const auxiliar = copia[i];
        copia[i] = copia[j];
        copia[j] = auxiliar;
    }
    return copia;
}

// [Pregunta] -> String -> Number -> [Pregunta]
export function elegirPreguntas(banco, categoria, cantidad) {
    // en "Mezcladas" entra todo el banco; si no, solo las de esa categoría
    const disponibles = categoria === MEZCLADAS ? banco : banco.filter((pregunta) => pregunta.categoria === categoria);
    if (disponibles.length < cantidad) {
        return null;
    }
    return mezclar(disponibles).slice(0, cantidad);
}

// String -> String -> [Pregunta] -> Partida
export function crearPartida(usuario, categoria, preguntas) {
    const ahora = Date.now();
    return {
        id: crypto.randomUUID(),
        usuario: usuario,
        categoria: categoria,
        preguntas: preguntas,
        indiceActual: 0,
        respuestas: [],
        puntaje: 0,
        correctas: 0,
        incorrectas: 0,
        rachaActual: 0,
        mejorRacha: 0,
        inicio: ahora,
        preguntaDesde: ahora,
        fin: null,
        duracion: 0,
        estado: "en curso",
    };
}

// Partida -> Pregunta
export function preguntaActual(partida) {
    return partida.preguntas[partida.indiceActual];
}

// Partida -> Number -> Partida
export function responder(partida, opcionElegida) {
    const pregunta = preguntaActual(partida);
    const acerto = opcionElegida === pregunta.correcta;

    let puntos = 0;
    let rachaActual = 0;
    let correctas = partida.correctas;
    let incorrectas = partida.incorrectas;
    if (acerto) {
        puntos = pregunta.puntos;
        rachaActual = partida.rachaActual + 1;
        correctas = correctas + 1;
    } else {
        incorrectas = incorrectas + 1;
    }

    let mejorRacha = partida.mejorRacha;
    if (rachaActual > mejorRacha) {
        mejorRacha = rachaActual;
    }

    const respuesta = {
        idPregunta: pregunta.id,
        categoria: pregunta.categoria,
        elegida: opcionElegida,
        acerto: acerto,
        puntos: puntos,
    };

    return {
        ...partida,
        respuestas: [...partida.respuestas, respuesta],
        puntaje: partida.puntaje + puntos,
        correctas: correctas,
        incorrectas: incorrectas,
        rachaActual: rachaActual,
        mejorRacha: mejorRacha,
    };
}

// Partida -> Boolean
export function quedanPreguntas(partida) {
    return partida.indiceActual < partida.preguntas.length - 1;
}

// Partida -> Partida
export function avanzar(partida) {
    return { ...partida, indiceActual: partida.indiceActual + 1, preguntaDesde: Date.now() };
}

// Partida -> String -> Partida
export function finalizarPartida(partida, estado) {
    const fin = Date.now();
    return { ...partida, estado: estado, fin: fin, duracion: fin - partida.inicio };
}

// Partida -> Partida
export function paraElCliente(partida) {
    // le saco la respuesta correcta a cada pregunta para que no se pueda ver desde el navegador
    const preguntas = partida.preguntas.map((pregunta) => {
        const { correcta, ...resto } = pregunta;
        return resto;
    });
    return { ...partida, preguntas: preguntas };
}
