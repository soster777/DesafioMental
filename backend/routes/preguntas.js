import { Router } from "express";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import * as preguntasService from "../services/preguntas.services.js";

const router = Router();

router.use(requiereSesion);

// cualquier usuario logueado necesita las categorías para jugar y filtrar
router.get("/categorias", async (req, res, next) => {
    try {
        res.json(await preguntasService.obtenerCategorias());
    } catch (error) {
        next(error);
    }
});

router.get("/", soloAdmin, async (req, res, next) => {
    try {
        res.json(await preguntasService.obtenerPreguntas());
    } catch (error) {
        next(error);
    }
});

router.post("/", soloAdmin, async (req, res, next) => {
    try {
        res.status(201).json(await preguntasService.crearPregunta(req.body || {}));
    } catch (error) {
        next(error);
    }
});

router.put("/:id", soloAdmin, async (req, res, next) => {
    try {
        res.json(await preguntasService.actualizarPregunta(req.params.id, req.body || {}));
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", soloAdmin, async (req, res, next) => {
    try {
        await preguntasService.eliminarPregunta(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;
