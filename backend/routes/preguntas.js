import { Router } from "express";
import * as preguntasData from "../data/preguntas.js";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import { categoriasParaJugar } from "../logica/partida.js";
import { validarPregunta } from "../logica/preguntas.js";

const router = Router();

router.use(requiereSesion);

// cualquier usuario logueado necesita las categorías para jugar y filtrar
router.get("/categorias", async (req, res) => {
    res.json(categoriasParaJugar(await preguntasData.obtenerTodas()));
});

router.get("/", soloAdmin, async (req, res) => {
    res.json(await preguntasData.obtenerTodas());
});

router.post("/", soloAdmin, async (req, res) => {
    const { errores, pregunta } = validarPregunta(req.body || {});
    if (errores.length > 0) {
        return res.status(400).json({ error: "Revisá los datos de la pregunta.", errores: errores });
    }
    const nueva = await preguntasData.crear({ id: await preguntasData.obtenerProximoId(), ...pregunta });
    res.status(201).json(nueva);
});

router.put("/:id", soloAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if ((await preguntasData.obtenerPorId(id)) === undefined) {
        return res.status(404).json({ error: "No existe la pregunta " + req.params.id + "." });
    }
    const { errores, pregunta } = validarPregunta(req.body || {});
    if (errores.length > 0) {
        return res.status(400).json({ error: "Revisá los datos de la pregunta.", errores: errores });
    }
    const actualizada = await preguntasData.actualizar(id, pregunta);
    res.json(actualizada);
});

router.delete("/:id", soloAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if ((await preguntasData.obtenerPorId(id)) === undefined) {
        return res.status(404).json({ error: "No existe la pregunta " + req.params.id + "." });
    }
    // las partidas guardan una copia de sus preguntas, así que borrar no rompe el historial
    await preguntasData.eliminar(id);
    res.status(204).end();
});

export default router;
