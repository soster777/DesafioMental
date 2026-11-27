import { Router } from "express";
import { requiereSesion } from "../middlewares/sesion.js";
import * as partidasService from "../services/partidas.services.js";

const router = Router();

router.use(requiereSesion);

// historial con filtros: GET /api/partidas?categoria=Historia&estado=completada
router.get("/", async (req, res, next) => {
    try {
        res.json(await partidasService.obtenerHistorial(req.usuario, req.query));
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        res.status(201).json(await partidasService.iniciarPartida(req.usuario, req.body || {}));
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        res.json(await partidasService.obtenerPartida(req.params.id, req.usuario));
    } catch (error) {
        next(error);
    }
});

router.post("/:id/respuestas", async (req, res, next) => {
    try {
        res.json(await partidasService.responderPregunta(req.params.id, req.usuario, req.body || {}));
    } catch (error) {
        next(error);
    }
});

// abandonar: PATCH /api/partidas/:id con { "estado": "abandonada" }
router.patch("/:id", async (req, res, next) => {
    try {
        res.json(await partidasService.abandonarPartida(req.params.id, req.usuario, req.body || {}));
    } catch (error) {
        next(error);
    }
});

export default router;
