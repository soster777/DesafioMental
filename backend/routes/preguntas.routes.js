import { Router } from "express";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import {
    listarCategorias,
    listarPreguntas,
    registrarPregunta,
    modificarPregunta,
    borrarPregunta,
} from "../controllers/preguntas.controllers.js";

const router = Router();

router.use(requiereSesion);

// GET /api/preguntas/categorias (cualquier usuario las necesita para jugar)
router.get("/categorias", listarCategorias);

// GET /api/preguntas
router.get("/", soloAdmin, listarPreguntas);

// POST /api/preguntas
router.post("/", soloAdmin, registrarPregunta);

// PUT /api/preguntas/:id
router.put("/:id", soloAdmin, modificarPregunta);

// DELETE /api/preguntas/:id
router.delete("/:id", soloAdmin, borrarPregunta);

export default router;
