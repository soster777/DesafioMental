import { Router } from "express";
import { mostrarEstadisticas, mostrarPorcentaje, mostrarRanking } from "../controllers/estadisticas.controllers.js";

const router = Router();

// GET /api/estadisticas
router.get("/estadisticas", mostrarEstadisticas);

// GET /api/estadisticas/:categoria
router.get("/estadisticas/:categoria", mostrarPorcentaje);

// GET /api/ranking -> general; GET /api/ranking?categoria=Historia -> solo esa categoría
router.get("/ranking", mostrarRanking);

export default router;
