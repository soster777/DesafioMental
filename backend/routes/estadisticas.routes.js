import { Router } from "express";
import { requiereSesion } from "../middlewares/sesion.js";
import { mostrarEstadisticas, mostrarPorcentaje, mostrarRanking } from "../controllers/estadisticas.controllers.js";

const router = Router();

// GET /api/estadisticas
router.get("/estadisticas", requiereSesion, mostrarEstadisticas);

// GET /api/estadisticas/:categoria
router.get("/estadisticas/:categoria", requiereSesion, mostrarPorcentaje);

// GET /api/ranking -> general; GET /api/ranking?categoria=Historia -> solo esa categoría
router.get("/ranking", requiereSesion, mostrarRanking);

export default router;
