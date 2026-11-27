import { Router } from "express";
import * as partidasData from "../data/partidas.js";
import * as preguntasData from "../data/preguntas.js";
import { requiereSesion } from "../middlewares/sesion.js";
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

const router = Router();

router.use(requiereSesion);

// Request -> Response -> Partida
async function buscarPartida(req, res) {
    const partida = await partidasData.obtenerPorId(req.params.id);
    if (partida === undefined) {
        res.status(404).json({ error: "No existe la partida." });
        return null;
    }
    if (partida.usuario !== req.usuario.usuario) {
        res.status(403).json({ error: "Esa partida es de otro usuario." });
        return null;
    }
    return partida;
}

// historial con filtros: GET /api/partidas?categoria=Historia&estado=completada
router.get("/", async (req, res) => {
    const categoria = comoTexto(req.query.categoria) || "todas";
    const estado = comoTexto(req.query.estado) || "todas";
    if (!ESTADOS.includes(estado)) {
        return res.status(400).json({ error: "El estado tiene que ser todas, completada o abandonada." });
    }
    const mias = soloFinalizadas(await partidasData.obtenerDelUsuario(req.usuario.usuario));
    const filtradas = filtrarHistorial(mias, categoria, estado).map((p) => ({
        id: p.id,
        categoria: p.categoria,
        puntaje: p.puntaje,
        correctas: p.correctas,
        estado: p.estado,
        fin: p.fin,
    }));
    res.json({ partidas: filtradas, resumen: resumirHistorial(mias) });
});

router.post("/", async (req, res) => {
    const cuerpo = req.body || {};
    const categoria = comoTexto(cuerpo.categoria);
    const cantidad = Number(cuerpo.cantidad);
    if (![5, 10].includes(cantidad)) {
        return res.status(400).json({ error: "La cantidad de preguntas tiene que ser 5 o 10." });
    }
    const banco = await preguntasData.obtenerTodas();
    if (!categoriasParaJugar(banco).includes(categoria)) {
        return res.status(400).json({ error: "La categoría elegida no existe." });
    }
    const preguntas = elegirPreguntas(banco, categoria, cantidad);
    if (preguntas === null) {
        return res
            .status(400)
            .json({ error: "No hay suficientes preguntas de " + categoria + " para una partida de " + cantidad + "." });
    }

    // si el usuario dejó una partida colgada (cerró la pestaña), queda como abandonada
    for (const p of await partidasData.obtenerDelUsuario(req.usuario.usuario)) {
        if (p.estado === "en curso") {
            await partidasData.actualizar(p.id, finalizarPartida(p, "abandonada"));
        }
    }
    const nueva = await partidasData.crear(crearPartida(req.usuario.usuario, categoria, preguntas));
    res.status(201).json(paraElCliente(nueva));
});

router.get("/:id", async (req, res) => {
    const partida = await buscarPartida(req, res);
    if (partida !== null) {
        res.json(paraElCliente(partida));
    }
});

// opcion: índice de la opción elegida, o null si se terminó el tiempo
router.post("/:id/respuestas", async (req, res) => {
    const partida = await buscarPartida(req, res);
    if (partida === null) {
        return;
    }
    if (partida.estado !== "en curso") {
        return res.status(409).json({ error: "La partida ya terminó." });
    }

    const pregunta = preguntaActual(partida);
    const cuerpo = req.body || {};
    let opcion = cuerpo.opcion === null ? null : Number(cuerpo.opcion);
    if (opcion !== null && !(Number.isInteger(opcion) && opcion >= 0 && opcion < pregunta.opciones.length)) {
        return res.status(400).json({ error: "La opción elegida no es válida." });
    }
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

    res.json({
        elegida: opcion,
        correcta: pregunta.correcta,
        partida: paraElCliente(actualizada),
    });
});

// abandonar: PATCH /api/partidas/:id con { "estado": "abandonada" }
router.patch("/:id", async (req, res) => {
    const partida = await buscarPartida(req, res);
    if (partida === null) {
        return;
    }
    if ((req.body || {}).estado !== "abandonada") {
        return res.status(400).json({ error: "Solo se puede cambiar el estado a abandonada." });
    }
    if (partida.estado !== "en curso") {
        return res.status(409).json({ error: "La partida ya terminó." });
    }
    const abandonada = finalizarPartida(partida, "abandonada");
    await partidasData.actualizar(abandonada.id, abandonada);
    res.json(paraElCliente(abandonada));
});

export default router;
