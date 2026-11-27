import { Router } from "express";
import { requiereSesion } from "../middlewares/sesion.js";
import {
    listarHistorial,
    empezarPartida,
    buscarPartida,
    responder,
    abandonar,
} from "../controllers/partidas.controllers.js";

const router = Router();

router.use(requiereSesion);

// GET /api/partidas?categoria=Historia&estado=completada
router.get("/", listarHistorial);

// POST /api/partidas
router.post("/", empezarPartida);

// GET /api/partidas/:id
router.get("/:id", buscarPartida);

// POST /api/partidas/:id/respuestas
router.post("/:id/respuestas", responder);

// PATCH /api/partidas/:id con { "estado": "abandonada" }
router.patch("/:id", abandonar);

export default router;
