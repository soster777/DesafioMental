import { Router } from "express";
import {
    listarCategorias,
    listarPreguntas,
    registrarPregunta,
    modificarPregunta,
    borrarPregunta,
} from "../controllers/preguntas.controllers.js";

const router = Router();

// GET /api/preguntas/categorias
router.get("/categorias", listarCategorias);

// GET /api/preguntas
router.get("/", listarPreguntas);

// POST /api/preguntas
router.post("/", registrarPregunta);

// PUT /api/preguntas/:id
router.put("/:id", modificarPregunta);

// DELETE /api/preguntas/:id
router.delete("/:id", borrarPregunta);

export default router;
