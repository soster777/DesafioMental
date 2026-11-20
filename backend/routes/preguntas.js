import { Router } from "express";
import { leer, guardar } from "../datos.js";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import { categoriasParaJugar } from "../logica/partida.js";
import { validarPregunta, siguienteId } from "../logica/preguntas.js";

const router = Router();

router.use(requiereSesion);

// cualquier usuario logueado necesita las categorías para jugar y filtrar
router.get("/categorias", (req, res) => {
    res.json(categoriasParaJugar(leer("preguntas")));
});

router.get("/", soloAdmin, (req, res) => {
    res.json(leer("preguntas"));
});

router.post("/", soloAdmin, (req, res) => {
    const { errores, pregunta } = validarPregunta(req.body || {});
    if (errores.length > 0) {
        return res.status(400).json({ error: "Revisá los datos de la pregunta.", errores: errores });
    }
    const preguntas = leer("preguntas");
    const nueva = { id: siguienteId(preguntas), ...pregunta };
    preguntas.push(nueva);
    guardar("preguntas", preguntas);
    res.status(201).json(nueva);
});

router.put("/:id", soloAdmin, (req, res) => {
    const id = Number(req.params.id);
    const preguntas = leer("preguntas");
    if (!preguntas.some((p) => p.id === id)) {
        return res.status(404).json({ error: "No existe la pregunta " + req.params.id + "." });
    }
    const { errores, pregunta } = validarPregunta(req.body || {});
    if (errores.length > 0) {
        return res.status(400).json({ error: "Revisá los datos de la pregunta.", errores: errores });
    }
    const actualizada = { id: id, ...pregunta };
    guardar("preguntas", preguntas.map((p) => (p.id === id ? actualizada : p)));
    res.json(actualizada);
});

router.delete("/:id", soloAdmin, (req, res) => {
    const id = Number(req.params.id);
    const preguntas = leer("preguntas");
    if (!preguntas.some((p) => p.id === id)) {
        return res.status(404).json({ error: "No existe la pregunta " + req.params.id + "." });
    }
    // las partidas guardan una copia de sus preguntas, así que borrar no rompe el historial
    guardar("preguntas", preguntas.filter((p) => p.id !== id));
    res.status(204).end();
});

export default router;
